import { VK, Keyboard, IMessageContextSendOptions, ContextDefaultState, MessageContext } from 'vk-io';
import { HearManager } from '@vk-io/hear';
import { PrismaClient } from '@prisma/client'
import {
    QuestionManager,
    IQuestionMessageContext
} from 'vk-io-question';
import { randomInt } from 'crypto';
import { timeStamp } from 'console';
import { registerUserRoutes } from './engine/player'
import { InitGameRoutes } from './engine/init';
import { send } from 'process';
import { Weapon_Create } from './engine/core/weapon';
import { Skill_Create } from './engine/core/skill';
import { Gen_Inline_Button } from './engine/core/button';
import { Player, Player_register } from './engine/core/user';
import { Tutorial_Armor, Tutorial_License, Tutorial_Weapon, Tutorial_Welcome } from './engine/core/tutorial';
import { Armor_Create } from './engine/core/armor';
import { Battle_Init } from './engine/core/battle';
import { userInfo } from 'os';
import { throws } from 'assert';

//авторизация
const vk = new VK({
	token: "b603c7efd00e1ce663d70a18c8915686bbdfee594a2f8d66d77620c712df5e9c2ae9e211c4164b80df6f9",
	pollingGroupId: 207638246
	//token: 'd0d096ed5933ced08bc674c08134e4e47603a0443f4972d6595024ae32f8677b62032ec53ebfddc80ff16'
});

//инициализация
const questionManager = new QuestionManager();
const hearManager = new HearManager<IQuestionMessageContext>();
export const prisma = new PrismaClient()

/*prisma.$use(async (params, next) => {
	console.log('This is middleware!')
	// Modify or interrogate params here
	console.log(params)
	return next(params)
})*/

//настройка
vk.updates.use(questionManager.middleware);
vk.updates.on('message_new', hearManager.middleware);

//регистрация роутов из других классов
InitGameRoutes(hearManager)
registerUserRoutes(hearManager)

//миддлевар для предварительной обработки сообщений
vk.updates.on('message_new', async (context, next) => {
	//проверяем есть ли пользователь в базах данных
	const player = await Player.build(context)
	//если пользователя нет, то начинаем регистрацию
	if (Player?.user?.idvk != context.senderId) {
		//согласие на обработку данных
		const offer = await Tutorial_License(context)
		if (offer == false) {
			return
		}
		//регистрация игрока
		await Player_register(context)
		//предыстория
		await Tutorial_Welcome(context)
		//получаем список способностей
		const weapon_type = await prisma.skillConfig.findMany({
			where: {
				id_skill_category: 1
			}
		})
		//генерируем клавиатуру для предоставления способностей игроку
		const skill = await  Gen_Inline_Button(context, weapon_type)
		//Генерируем оружие игроку
		await Weapon_Create(context, skill)
		//Создаем скилл игрока для использования оружия
		//await Skill_Create(context, skill)
		//Заканчиваем обучение
		await Tutorial_Weapon(context)
		//получаем список брони
		const armor_type = await prisma.skillConfig.findMany({
			where: {
				id_skill_category: 2
			}
		})
		//генерируем клавиатуру для предоставления способностей игроку
		context.send(`А теперь перейдем к выбору брони:`)
		const armor = await  Gen_Inline_Button(context, armor_type)
		await Armor_Create(context, armor)
		Tutorial_Armor(context)
		const battla = await context.question(`-Удачи Тебе Путник в этом нелегком пути - сказал некромант
			Вы выходите из таверны, направляетесь к выходу из поселка, но вдруг вас кто-то окликает:
			- О это снова ты! А ну иди сюда 
			`,
			{
                keyboard: Keyboard.builder()
                .textButton({
                    label: 'Прикинуться невидимкой',
                    payload: {
                        command: 'invise'
                    },
                    color: 'secondary'
                })
                .row()
                .textButton({
                    label: 'Взять реванш',
                    payload: {
                        command: 'revenge'
                    },
                    color: 'secondary'
                }).oneTime().inline()
            }
		)
		if (battla.payload.command == 'invise') {
			context.send(`К сожалению ваш инвиз оказался не рабочим, после прилета удара с зади...`)
		}
		context.send(`Приготовтесь к битве!`)
		await Battle_Init(context)
		context.send(`Пишите:
		битва`)
	} else {
		//await player?.Skill_Up_Armor()
		await player.Save()
	}
	return next();
})

vk.updates.startPolling().catch(console.error);