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
import { Player_register } from './engine/core/user';
import { Tutorial_License, Tutorial_Weapon, Tutorial_Welcome } from './engine/core/tutorial';
import { Armor_Create } from './engine/core/armor';

//авторизация
const vk = new VK({
	token: "b603c7efd00e1ce663d70a18c8915686bbdfee594a2f8d66d77620c712df5e9c2ae9e211c4164b80df6f9",
	pollingGroupId: 207638246
	//token: 'd0d096ed5933ced08bc674c08134e4e47603a0443f4972d6595024ae32f8677b62032ec53ebfddc80ff16'
});

//инициализация
const questionManager = new QuestionManager();
const hearManager = new HearManager<IQuestionMessageContext>();
const prisma = new PrismaClient()

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
	const user_check = await prisma.user.findFirst({
		where: {
			idvk: context.senderId
		}
	})
	//если пользователя нет, то начинаем регистрацию
	if (!user_check) {
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
		await Skill_Create(context, skill)
		//Заканчиваем обучение
		await Tutorial_Weapon(context)
		//получаем список брони
		const armor_type = await prisma.skillConfig.findMany({
			where: {
				id_skill_category: 2
			}
		})
		//генерируем клавиатуру для предоставления способностей игроку
		const armor = await  Gen_Inline_Button(context, armor_type)
		await Armor_Create(context, armor)
		console.log(armor)
		
	}
	return next();
})

vk.updates.startPolling().catch(console.error);