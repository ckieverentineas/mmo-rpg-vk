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
import { Player } from './engine/core/user';
import { Request, Response, Application } from 'express';
import express = require('express');
import * as os from 'os';
//авторизация
const vk = new VK({
	token: "b603c7efd00e1ce663d70a18c8915686bbdfee594a2f8d66d77620c712df5e9c2ae9e211c4164b80df6f9",
	//pollingGroupId: 207638246,
	webhookConfirmation: "b69aa45b",
	webhookSecret: "dsafeighwuhq8t742178tfiuhwef"
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
	const player = await Player.build(context)
	await player.Detector()
	await player.Sync()
	//проверяем есть ли пользователь в базах данных
	//const player = await Player.build({ context })
	//если пользователя нет, то начинаем регистрацию
	/*if (!player) {
		//согласие на обработку данных
		const offer = await Tutorial_License(context)
		if (offer == false) {
			return
		}
		//предыстория
		await Tutorial_Welcome(context)
		//получаем список способностей
		const weapon_type = await prisma.skillConfig.findMany({
			where: {
				id_skill_category: 1
			}
		})
		//генерируем клавиатуру для предоставления способностей игроку
		const skill = await  Gen_Inline_Button(context, weapon_type, 'ddd')
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
		const armor = await  Gen_Inline_Button(context, armor_type, 'ddd')
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
			context.send(`К сожалению ваш инвиз оказался не рабочим, после прилета удара сзади...`)
		}
		context.send(`Приготовтесь к битве!`)
		await player.User_Sync()
		await player.Save()
		await Battle_Init(context)
		context.send(`Пишите:
		битва`)
	} else {
		//await player?.Skill_Up_Armor()
		await player.Save()
	}*/
	//await player.Save()
	const  push = await context.send('Быстрый доступ',
            { keyboard: Keyboard.builder()
                .textButton({   label: 'инвентарь',
                                payload: { command: "left" },
                                color: 'primary'              }).row()
                .textButton({   label: `крафт`,
                                payload: { command: "left" },
                                color: 'primary'              }).row()
                .textButton({   label: 'битва',
                                payload: { command: 'right' },
                                color: 'primary'              })
                .oneTime() }
    )
	return next();
})


const app: Application = express();
const PORT = 5000;
app.post('/', function (req: Request, res: Response) {
	console.log(req)
	res.send('af84ab51');
});
const information: any = os.networkInterfaces()
app.listen(PORT, () => {
    console.log(
        `Server running on http://${information.Ethernet[1].address}:${PORT}.`
    )
});
app.post('/', vk.updates.getWebhookCallback());
vk.updates.start({ webhook: { path: `/` } }).then(() => console.log('Server stand up!')).catch(console.log);
