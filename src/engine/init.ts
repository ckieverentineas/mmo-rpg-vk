import { PrismaClient } from "@prisma/client";
import { HearManager } from "@vk-io/hear";
import { randomInt } from "crypto";
import { Keyboard, KeyboardBuilder } from "vk-io";
import { IQuestionMessageContext } from "vk-io-question";

const prisma = new PrismaClient()

export function InitGameRoutes(hearManager: HearManager<IQuestionMessageContext>): void {
	hearManager.hear(/init/, async (context) => {
		//user
		const user_type = await prisma.userType.createMany({
			data: [
				{
					name: 'player',
					description: 'простой смертный человек',
					label: 'Игрок'
				},
				{
					name: 'npc',
					description: 'простой смертный npc',
					label: 'Искуственный Интеллект'
				}
			],
			skipDuplicates: true
		})
		user_type ? console.log('Success init UserType on server') : console.log('Fail init UserType on server')
		
		const user_config = await prisma.userConfig.create({
			data: {
				hp_min: 5,
				hp_max: 10,
				gold_min: 5,
				gold_max: 10
			}
		})
		user_config ? console.log('Success init UserConfig on server') : console.log('Fail init UserConfig on server')

		const skill_category = await prisma.skillCategory.createMany({
			data: [
				{
					name: 'weapon',
					description: 'Все, что позволяет ломать лицо противнику.',
					label: 'Оружие'
				},
				{
					name: 'armor',
					description: 'Все, что позволит поглощать урон своего врага.',
					label: 'Броня'
				}
			],
			skipDuplicates: true
		})
		console.log((skill_category ? "Success" : "Fail") + " init SkillCategory")

		const skill_config = await prisma.skillConfig.createMany({
			data: [
				{
					name: 'sword',
					description: 'Меч - холодное оружие с ближним радуисом поражения',
					label: 'Меч',
					id_skill_category: 1,
				},
				{
					name: 'staff',
					description: 'Посох - магическое оружие с дальним радуисом поражения',
					label: 'Посох',
					id_skill_category: 1,
				},
				{
					name: 'pistol',
					description: 'Пистолет - огнестрельное оружие с дальним радуисом поражения',
					label: 'Пистолет',
					id_skill_category: 1,
				},
				{
					name: 'cane',
					description: 'Трость - боевое оружие с ближним радуисом поражения',
					label: 'Трость',
					id_skill_category: 1,
				},
				{
					name: 'armor',
					description: 'Броня - комплект брони защищает вас сильнее.',
					label: 'Броня',
					id_skill_category: 2,
				},
			],
			skipDuplicates: true
		})
		console.log((skill_config ? "Success" : "Fail") + " init SkillConfig")

		const weapon_config = await prisma.weaponConfig.createMany({
			data: [
				{
					id_skill_config: 1,
					atk_min: 1,
					atk_max: 5,
					lvl_req_min: 1,
					lvl_req_max: 5,
					hp_min: 100,
					hp_max: 1500
				},
				{
					id_skill_config: 2,
					atk_min: 2,
					atk_max: 6,
					lvl_req_min: 1,
					lvl_req_max: 5,
					hp_min: 100,
					hp_max: 1000
				},
				{
					id_skill_config: 3,
					atk_min: 2,
					atk_max: 7,
					lvl_req_min: 1,
					lvl_req_max: 5,
					hp_min: 100,
					hp_max: 700
				},
				{
					id_skill_config: 4,
					atk_min: 1,
					atk_max: 4,
					lvl_req_min: 1,
					lvl_req_max: 5,
					hp_min: 100,
					hp_max: 2000
				}
			],
			skipDuplicates: true
		})
		weapon_config ? console.log('Success init WeaponConfig on server') : console.log('Fail init WeaponConfig on server')
	
		const armor_type = await prisma.armorType.createMany({
			data: [
				{
					name: 'helmet',
					description: 'Шлем - часть комплекта доспехов, блокирующие урон по голове',
					label: 'Шлем'
				},
				{
					name: 'harness',
					description: 'Нагрудник - часть комплекта доспехов, блокирующие урон по туловищу',
					label: 'Нагрудник'
				},
				{
					name: 'arm',
					description: 'Поручи - часть комплекта доспехов, блокирующие урон по рукам',
					label: 'Поручи'
				},
				{
					name: 'gloves',
					description: 'Перчатки - часть комплекта доспехов, блокирующие урон по кистям',
					label: 'Перчатки'
				},
				{
					name: 'thigh',
					description: 'Хз че это - часть комплекта доспехов, блокирующие урон по голеням',
					label: 'Набедренник'
				},
				{
					name: 'shin',
					description: 'Поножи - часть комплекта доспехов, блокирующие урон по ногам',
					label: 'Поножи'
				},
				{
					name: 'foot',
					description: 'Ботинки - часть комплекта доспехов, блокирующие урон по ступням',
					label: 'Ботинки'
				},
			],
			skipDuplicates: true
		})
		console.log((armor_type ? "Success" : "Fail") + " init ArmorType")

		const armor_config = await prisma.armorConfig.create({
			data: {
				id_skill_config: 5,
				def_min: 1,
				def_max: 10,
				lvl_req_min: 1,
				lvl_req_max: 5,
				hp_min: 1000,
				hp_max: 10000
			}
		})
		console.log((armor_config ? "Success" : "Fail") + " init ArmorConfig")

		const battle_type = await prisma.battleType.create({
			data: {
				name: 'pve',
				description: 'битва против мобов',
				label: 'Битва против мобов'
			}
		})
		console.log((battle_type ? "Success" : "Fail") + " init BattleType")
		
		const damage_type = await prisma.damageType.createMany({
			data: [
				{
					name: 'physical',
					description: 'Физический урон - материальный урон по любому реальному обьекту.',
					label: 'Физический урон'
				},
				{
					name: 'magic',
					description: 'Магический урон - проходит сквозь всё и не щадит даже нематериальное.',
					label: 'Магический урон'
				}
			]
		})
		console.log((damage_type ? "Success" : "Fail") + " init DamageType")

		context.send('Игра инициализированна успешно.')
	})
}