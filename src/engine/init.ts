import { PrismaClient } from "@prisma/client";
import { HearManager } from "@vk-io/hear";
import { randomInt } from "crypto";
import { Keyboard, KeyboardBuilder } from "vk-io";
import { IQuestionMessageContext } from "vk-io-question";
import { prisma } from ".."

export function InitGameRoutes(hearManager: HearManager<IQuestionMessageContext>): void {
	hearManager.hear(/init/, async (context) => {
		//user
		const user_type1 = await prisma.userType.create({
			data: {
				name: 'player',
				description: 'простой смертный человек',
				label: 'Игрок'
			}
		})
		const user_type2 = await prisma.userType.create({
			data: {
				name: 'npc',
				description: 'простой смертный npc',
				label: 'Искуственный Интеллект'
			}
		})
		user_type1 && user_type2 ? console.log('Success init UserType on server') : console.log('Fail init UserType on server')
		
		const user_config = await prisma.userConfig.create({
			data: {
				hp_min: 5,
				hp_max: 10,
				gold_min: 5,
				gold_max: 10
			}
		})
		user_config ? console.log('Success init UserConfig on server') : console.log('Fail init UserConfig on server')

		const skill_category1 = await prisma.skillCategory.create({
			data: {
				name: 'weapon',
				description: 'Все, что позволяет ломать лицо противнику.',
				label: 'Оружие'
			}
		})
		const skill_category2 = await prisma.skillCategory.create({
			data: {
				name: 'armor',
				description: 'Все, что позволит поглощать урон своего врага.',
				label: 'Броня'
			}
		})
		console.log((skill_category1 && skill_category2 ? "Success" : "Fail") + " init SkillCategory")

		const skill_config1 = await prisma.skillConfig.create({
			data: {
				name: 'sword',
				description: 'Меч - холодное оружие с ближним радуисом поражения',
				label: 'Меч',
				id_skill_category: 1,
			}
		})
		const skill_config2 = await prisma.skillConfig.create({
			data: {
				name: 'staff',
				description: 'Посох - магическое оружие с дальним радуисом поражения',
				label: 'Посох',
				id_skill_category: 1,
			}
		})
		const skill_config3 = await prisma.skillConfig.create({
			data: {
				name: 'pistol',
				description: 'Пистолет - огнестрельное оружие с дальним радуисом поражения',
				label: 'Пистолет',
				id_skill_category: 1,
			}
		})
		const skill_config4 = await prisma.skillConfig.create({
			data: {
				name: 'cane',
				description: 'Трость - боевое оружие с ближним радуисом поражения',
				label: 'Трость',
				id_skill_category: 1,
			}
		})
		const skill_config5 = await prisma.skillConfig.create({
			data: {
				name: 'armeasy',
				description: 'Легкая броня - комплект брони защищает вас от легких царапин.',
				label: 'Легкая броня',
				id_skill_category: 2,
			}
		})
		const skill_config6 = await prisma.skillConfig.create({
			data: {
				name: 'armmedium',
				description: 'Средняя броня - комплект брони защищает вас кровоточащих ударов.',
				label: 'Средняя броня',
				id_skill_category: 2,
			}
		})
		const skill_config7 = await prisma.skillConfig.create({
			data: {
				name: 'armhard',
				description: 'Тяжелая броня - комплект брони защищает от стрел и пробивающего оружия.',
				label: 'Тяжелая броня',
				id_skill_category: 2,
			}
		})
		
		console.log((skill_config1 && skill_config2 && skill_config3 && skill_config4 && skill_config5 && skill_config6 && skill_config7 ? "Success" : "Fail") + " init SkillConfig")

		const weapon_config1 = await prisma.weaponConfig.create({
			data: {
				id_skill_config: 1,
				atk_min: 1,
				atk_max: 5,
				lvl_req_min: 1,
				lvl_req_max: 5,
				hp_min: 100,
				hp_max: 1500
			}
		})
		const weapon_config2 = await prisma.weaponConfig.create({
			data: {
				id_skill_config: 2,
				atk_min: 2,
				atk_max: 6,
				lvl_req_min: 1,
				lvl_req_max: 5,
				hp_min: 100,
				hp_max: 1000
			}
		})
		const weapon_config3 = await prisma.weaponConfig.create({
			data: {
				id_skill_config: 3,
				atk_min: 2,
				atk_max: 7,
				lvl_req_min: 1,
				lvl_req_max: 5,
				hp_min: 100,
				hp_max: 700
			}
		})
		const weapon_config4 = await prisma.weaponConfig.create({
			data: {
				id_skill_config: 4,
				atk_min: 1,
				atk_max: 4,
				lvl_req_min: 1,
				lvl_req_max: 5,
				hp_min: 100,
				hp_max: 2000
			}
		})

		weapon_config1 && weapon_config2 && weapon_config3 && weapon_config4 ? console.log('Success init WeaponConfig on server') : console.log('Fail init WeaponConfig on server')
	
		const armor_type1 = await prisma.armorType.create({
			data: {
				name: 'helmet',
				description: 'Шлем - часть комплекта доспехов, блокирующие урон по голове',
				label: 'Шлем'
			}
		})
		const armor_type2 = await prisma.armorType.create({
			data: {
				name: 'harness',
				description: 'Нагрудник - часть комплекта доспехов, блокирующие урон по туловищу',
				label: 'Нагрудник'
			}
		})
		const armor_type3 = await prisma.armorType.create({
			data: {
				name: 'arm',
				description: 'Поручи - часть комплекта доспехов, блокирующие урон по рукам',
				label: 'Поручи'
			}
		})
		const armor_type4 = await prisma.armorType.create({
			data: {
				name: 'gloves',
				description: 'Перчатки - часть комплекта доспехов, блокирующие урон по кистям',
				label: 'Перчатки'
			}
		})
		const armor_type5 = await prisma.armorType.create({
			data: {
				name: 'thigh',
				description: 'Хз че это - часть комплекта доспехов, блокирующие урон по голеням',
				label: 'Набедренник'
			}
		})
		const armor_type6 = await prisma.armorType.create({
			data: {
				name: 'shin',
				description: 'Поножи - часть комплекта доспехов, блокирующие урон по ногам',
				label: 'Поножи'
			}
		})
		const armor_type7 = await prisma.armorType.create({
			data: {
				name: 'foot',
				description: 'Ботинки - часть комплекта доспехов, блокирующие урон по ступням',
				label: 'Ботинки'
			}
		})

		console.log((armor_type1 && armor_type2 && armor_type3 && armor_type4 && armor_type5 && armor_type6 && armor_type7 ? "Success" : "Fail") + " init ArmorType")

		const armor_config1 = await prisma.armorConfig.create({
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
		const armor_config2 = await prisma.armorConfig.create({
			data: {
				id_skill_config: 6,
				def_min: 5,
				def_max: 10,
				lvl_req_min: 2,
				lvl_req_max: 10,
				hp_min: 1000,
				hp_max: 5000
			}
		})
		const armor_config3 = await prisma.armorConfig.create({
			data: {
				id_skill_config: 7,
				def_min: 7,
				def_max: 14,
				lvl_req_min: 3,
				lvl_req_max: 15,
				hp_min: 1000,
				hp_max: 2500
			}
		})
		console.log((armor_config1 && armor_config2 && armor_config3 ? "Success" : "Fail") + " init ArmorConfig")

		const battle_type = await prisma.battleType.create({
			data: {
				name: 'pve',
				description: 'битва против мобов',
				label: 'Битва против мобов'
			}
		})
		console.log((battle_type ? "Success" : "Fail") + " init BattleType")
		
		const damage_type1 = await prisma.damageType.create({
			data: {
				name: 'physical',
				description: 'Физический урон - материальный урон по любому реальному обьекту.',
				label: 'Физический урон'
			}
		})
		const damage_type2 = await prisma.damageType.create({
			data: {
				name: 'magic',
				description: 'Магический урон - проходит сквозь всё и не щадит даже нематериальное.',
				label: 'Магический урон'
			}
		})
		console.log((damage_type1 && damage_type2 ? "Success" : "Fail") + " init DamageType")

		context.send('Игра инициализированна успешно.')
		await prisma.$disconnect()
	})
}