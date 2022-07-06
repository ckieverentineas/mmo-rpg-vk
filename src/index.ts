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
		//согласие на обработку
		const answer = await context.question(
			'Согласны-ли Вы на обработку персональных данных?',
			{
				keyboard: Keyboard.builder()
				.textButton({
					label: 'да',
					payload: {
						command: 'Согласиться'
					},
					color: 'positive'
				})
				.row()
				.textButton({
					label: 'Отказаться',
					payload: {
						command: 'Отказаться'
					},
					color: 'negative'
				}).oneTime()
			}
		);
		
		if (!/да|yes|Согласиться|конечно/i.test(answer.text|| '{}')) {
			await context.send('Тогда, мы не можем совершить регистрацию');
			return;
		}
		//регистрация пользователя
		const user_config_get = await prisma.userConfig.findFirst({})
		const user_create = await prisma.user.create({
			data: {
				idvk: context.senderId,
				gold: randomInt(user_config_get?.gold_min||5, user_config_get?.gold_max||10),
				hp: randomInt(user_config_get?.hp_min||5, user_config_get?.hp_max||10),
				id_user_type: 1
			}
		})
		console.log(`Created account for user ${user_create.idvk}`)
		//приветствие игрока
		const counter_players = await prisma.user.count()
		await context.send(`Добро пожаловать в вселенную Мастеров Рун.
							Сейчас ее населяет: ${counter_players} игроков.
							Существует в ней и сопровождает мир: 0 NPC.
							В этот солнечный день вы каким-то образом оказались в этой вселенной.`
		);
		
		const begin = await context.question(`Таверна. Пол. Ваша душа смотрит на свое бездыханное тело после смертной схватки с какими-то чудаками.
											Внезапно в помещение входит таинственный некромант кастует высокоуровневое заклинание.
											Вас притягивает обратно в тело и загадочный человек в плаще спрашивает,
											- Ты помнишь, что произошло?`,
											{
												keyboard: Keyboard.builder()
												.textButton({
													label: 'Я ничего не помню.',
													payload: {
														command: 'Согласиться'
													},
													color: 'secondary'
												})
												.row()
												.textButton({
													label: 'А ты кто?',
													payload: {
														command: 'Отказаться'
													},
													color: 'secondary'
												}).oneTime()
											}
		)

		const weapon_type = await prisma.skillConfig.findMany({
			where: {
				id_skill_category: 1
			}
		})
		let checker = false
		let counter = 0
		let current = 0
		let modif = 0
		let skill:any = {}
		while (checker == false) {
			let keyboard = Keyboard.builder()
			counter = 0
			current = modif
			while (current < weapon_type.length && counter < 5 ) {
				keyboard.textButton({
					label: weapon_type[current].label,
					payload: {
						command: weapon_type[current].id
					},
					color: 'primary'
				})
				counter++
				current++
			}
			keyboard.row()
			.textButton({
				label: '<',
				payload: {
					command: "left"
				},
				color: 'primary'
			})
			.textButton({
				label: 'назад',
				payload: {
					command: 'back'
				},
				color: 'primary'
			})
			.textButton({
				label: '>',
				payload: {
					command: 'right'
				},
				color: 'primary'
			})
			let weapon_list = ''
			await weapon_type.forEach(element => {
				weapon_list += `- ${element.description} \n`
			});
			skill = await context.question(`О себе ничего не расскажу, и о тебе тоже но позже может быть еще увидимся,
												приснилось мне во снах сегодня, что все это произойдет, нет времени обьяснять!
												Позже все узнаешь у прохожих, а сейчас давайка выбирай себе оружие, что даст те скилл:
												${weapon_list}
												Держи дистанцию с врагом, или наоборот не отдаляйся.`,
												{
													keyboard: keyboard.inline()
												}
			)
			if (!skill.payload) {
				context.send('Жмите по inline кнопкам!')
			} else {
				if (skill.payload.command == 'back') {
					context.send('Вы нажали назад')
					modif = 0
					continue
				}
				if (skill.payload.command == 'left') {
					modif-5 >= 0 && modif < weapon_type.length ? modif-=5 : context.send('Позади ничего нет!')
					continue
				}
				if (skill.payload.command == 'right') {
					console.log('test ' + modif + ' total:' + weapon_type.length)
					modif+5 < weapon_type.length ? modif+=5: context.send('Впереди ничего нет')
					continue
				}
				checker = true
			}
		}
		

		await Weapon_Create(context, skill)
		await Skill_Create(context, skill)
		

		
		
		await context.send(`Запомни на последок:
					⚔ - минимальный и максимальный урон, наносящийся по цели;
					🔧 - прочность оружия, количество ударов, что выдержит оружие, прежде чем треснет.`,
					{
						keyboard: Keyboard.builder()
						.textButton({
							label: 'Войти в стартовый город',
							payload: {
								command: 'Согласиться'
							},
							color: 'secondary'
						})
						.row()
						.textButton({
							label: 'Пойти нафиг',
							payload: {
								command: 'Отказаться'
							},
							color: 'secondary'
						})
					}
		)
	}
	return next();
})

vk.updates.startPolling().catch(console.error);