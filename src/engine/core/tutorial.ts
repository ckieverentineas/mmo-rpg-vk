import { PrismaClient } from "@prisma/client";
import { Keyboard } from "vk-io";

const prisma = new PrismaClient()

export async function Tutorial_Welcome(context: any) {
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

		
		context.send(`О себе ничего не расскажу, и о тебе тоже но позже может быть еще увидимся,
		приснилось мне во снах сегодня, что все это произойдет, нет времени обьяснять!
		Позже все узнаешь у прохожих, а сейчас давайка выбирай себе оружие, что даст те скилл:`)
}

export async function Tutorial_License(context: any) {
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
			return false;
		}
}
export async function Tutorial_Weapon(context: any) {
    await context.send(`Обозначения:
					⚔ - минимальный и максимальный урон, наносящийся по цели;
					🔧 - прочность оружия, количество ударов, что выдержит оружие, прежде чем треснет.`
		)
}

export async function Tutorial_Armor(context: any) {
    await context.send(`Обозначения:
						🛡 - минимальный и максимальный поглощаемый урон вашей броней;
						🔧 - прочность брони, количество ударов, что выдержит ваша броня, прежде чем треснет.`
		)
}