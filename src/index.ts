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
		const keyboard = Keyboard.builder()
		await weapon_type.forEach(element => {
			keyboard.textButton({
					label: element.label,
					payload: {
						command: element.id
					},
					color: 'primary'
			}).row()
		});

		let weapon_list = ''
		await weapon_type.forEach(element => {
			weapon_list += `- ${element.description} \n`
		});

		const skill = await context.question(`О себе ничего не расскажу, и о тебе тоже но позже может быть еще увидимся,
											приснилось мне во снах сегодня, что все это произойдет, нет времени обьяснять!
											Позже все узнаешь у прохожих, а сейчас давайка выбирай себе оружие, что даст те скилл:
											${weapon_list}
											Держи дистанцию с врагом, или наоборот не отдаляйся.`,
											{
												keyboard: keyboard
											}
		)

		console.log(skill)
		const weapon_config_get = await prisma.weaponConfig.findFirst({
			where: {
				id_skill_config: skill.payload.command
			}
		})
		const user_get = await prisma.user.findFirst({
			where: {
				idvk: context.senderId
			}
		})

		const skill_create = await prisma.skill.create({
			data: {
				id_user: user_get?.id,
				id_skill_config: skill.payload.command,
				lvl: 0,
				xp: 0
			}
		})
		context.send(`🏴‍☠Получен новый скилл: ${skill.text}`)
		const weapon_create = await prisma.weapon.create({
			data:{
				id_user: user_get?.id,
				id_skill_config: skill.payload.command,
				id_damage_type: 1,
				lvl: randomInt(weapon_config_get?.lvl_req_min || 0, weapon_config_get?.lvl_req_max || 5),
				atk_min: randomInt(weapon_config_get?.atk_min || 0, weapon_config_get?.lvl_req_max || 5),
				atk_max: randomInt(weapon_config_get?.atk_min || 0, weapon_config_get?.atk_max || 5),
				hp: randomInt(weapon_config_get?.hp_min || 0, weapon_config_get?.hp_max || 5),
				name: skill.text
			}
		})
		await context.send(`Получено оружие: ${weapon_create.name}
					⚔${weapon_create.atk_min}-${weapon_create.atk_max} 🔧${weapon_create.hp}`)
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