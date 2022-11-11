import { PrismaClient } from "@prisma/client";
import { HearManager } from "@vk-io/hear";
import { randomInt } from "crypto";
import { Keyboard, KeyboardBuilder } from "vk-io";
import { IQuestionMessageContext } from "vk-io-question";
import { prisma } from ".."

export function InitGameRoutes(hearManager: HearManager<IQuestionMessageContext>): void {
	hearManager.hear(/init/, async (context) => {
		const user = [	{	gold: 10, gold_mod: 0,
							user_type: {
								create: {	name: 'player', description: 'простой смертный человек', label: 'Игрок'	}
							}	
						},{	gold: 10, gold_mod: 0.1, 
							user_type: { 
								create: { name: 'slime', description: 'cкользкая слизь гигантских размеров',label: 'Слизь'	}	
							}	
						}
		]
		
		for (const i in user) {
			const game_config = await prisma.userConfig.create({	data: user[i]	})
			if (!game_config) {context.send(`Ошибка при инициализации типов пользователей`)}
		}
		const skill_category = [	
			{	name: 'body',	description: 'ваше собственное тело',	label: 'Тело', hidden: true								},
			{	name: 'weapon',	description: 'экипировка, уничтожающая ваших неприятелей',	label: 'Оружие'},
			{	name: 'armor',	description: 'экипировка, поглощающая десктруктивные воздействия против вас ', label: 'Броня'	}
		]
		for (const i in skill_category) {
			const game_config = await prisma.skillCategory.create({	data: skill_category[i]	})
			if (!game_config) {context.send(`Ошибка при инициализации категорий скиллов`)}
		}
		const body_config = [
			{	atk: 0, atk_mod: 0, def: -100, def_mod: 0.9, health: 10, health_mod: 0.2, hidden: false,
				skill_config: {	create: {	id_skill_category: 1, name: 'head',
				description: 'часть тела вашей личности, в которой находится мозг и т.п.',
				label: 'Голова', hidden: false												}	}	
			},
			{	atk: 0, atk_mod: 0, def: -50, def_mod: 0.5, health: 20, health_mod: 0.2, hidden: false,
				skill_config: {	create: {	id_skill_category: 1, name: 'body',
				description: 'часть тела вашей личности, в которой сосредоточены органы',
				label: 'Туловище', hidden: false												}	}	
			},
			{	atk: 1.5, atk_mod: 0.2, def: -10, def_mod: 0.2, health: 10, health_mod: 0.2, hidden: false,
				skill_config: {	create: {	id_skill_category: 1, name: 'arm_right',
				description: 'часть тела вашей личности, в которой можно держать оосновное оружие',
				label: 'Рука правая', hidden: false												}	}	
			},
			{	atk: 0.5, atk_mod: 0.1, def: -10, def_mod: 0.2, health: 10, health_mod: 0.2, hidden: false,
				skill_config: {	create: {	id_skill_category: 1, name: 'arm_left',
				description: 'часть тела вашей личности, в которой можно держать дополнительное оружие',
				label: 'Рука Левая', hidden: false												}	}	
			},
			{	atk: 0, atk_mod: 0, def: -25, def_mod: 0.2, health: 10, health_mod: 0.2, hidden: false,
				skill_config: {	create: {	id_skill_category: 1, name: 'leg_right',
				description: 'часть тела вашей личности, позволяюшая передвигаться',
				label: 'Нога правая', hidden: false												}	}	
			},
			{	atk: 0, atk_mod: 0, def: -25, def_mod: 0.2, health: 10, health_mod: 0.2, hidden: false,
				skill_config: {	create: {	id_skill_category: 1, name: 'leg_left',
				description: 'часть тела вашей личности, позволяюшая передвигаться',
				label: 'Нога левая', hidden: false												}	}	
			},
			{	atk: 2, atk_mod: 0.3, def: -20, def_mod: 0.5, health: 10, health_mod: 0.2, hidden: false,
				skill_config: {	create: {	id_skill_category: 1, name: 'boot_right',
				description: 'часть тела вашей личности, которая позволяет стоять на земле',
				label: 'Правый ботинок', hidden: false												}	}	
			},
			{	atk: 1, atk_mod: 0.5, def: -20, def_mod: 0.5, health: 10, health_mod: 0.2, hidden: false,
				skill_config: {	create: {	id_skill_category: 1, name: 'boot_left',
				description: 'часть тела вашей личности, которая позволяет стоять на земле',
				label: 'Левый ботинок', hidden: false												}	}	
			},
		]
		for (const i in body_config) {
			const game_config = await prisma.bodyConfig.create({data: body_config[i]})
			if (!game_config) {context.send(`Ошибка при инициализации частей тела`)}
		}
		const weapon_config = [	
			{	atk: 4, atk_mod: 0.3, lvl: 1, lvl_mod: 0.5, hp: 1500, hp_mod: 0.9, hidden: false, skill_config: {
				create: {	id_skill_category: 2, name: 'sword',
							description: 'холодное оружие с ближним радуисом поражения',
							label: 'Меч', hidden: false				}}												
			},
			{	atk: 5, atk_mod: 0.4, lvl: 1, lvl_mod: 0.5, hp: 1000, hp_mod: 0.9, hidden: false, skill_config: {
				create: {	id_skill_category: 2, name: 'staff',
							description: 'магическое оружие с дальним радуисом поражения',
							label: 'Посох', hidden: false				}}												
			},
			{	atk: 6, atk_mod: 0.5, lvl: 1, lvl_mod: 0.5, hp: 750, hp_mod: 0.9, hidden: false, skill_config: {
				create: {	id_skill_category: 2, name: 'pistol',
							description: 'огнестрельное оружие с дальним радуисом поражения',
							label: 'Пистолет', hidden: false				}}												
			},
			{	atk: 3, atk_mod: 0.7, lvl: 1, lvl_mod: 0.5, hp: 2000, hp_mod: 0.9, hidden: false, skill_config: {
				create: {	id_skill_category: 2, name: 'cane',
							description: 'боевое оружие с ближним радуисом поражения',
							label: 'Трость', hidden: false				}}												
			},
		]
		for (const i in weapon_config) {
			const game_config = await prisma.weaponConfig.create({data: weapon_config[i]})
			if (!game_config) {	context.send(`Ошибка при инициализации типов оружия`)	}
		}
		const armor_config = [
			{	def: 10, def_mod: 0.5, lvl: 1, lvl_mod: 0.5, hp: 1000, hp_mod: 0.9, hidden: false, skill_config: {
				create: {	id_skill_category: 3, name: 'armor_easy',
							description: 'комплект брони защищает вас от легких царапин.',
							label: 'Легкая броня', hidden: false			}}
			},
			{	def: 10, def_mod: 0.5, lvl: 1, lvl_mod: 0.5, hp: 1000, hp_mod: 0.9, hidden: false, skill_config: {
				create: {	id_skill_category: 3, name: 'armor_medium',
							description: 'комплект брони защищает вас кровоточащих ударов.',
							label: 'Средняя броня', hidden: false			}}
			},
			{	def: 10, def_mod: 0.5, lvl: 1, lvl_mod: 0.5, hp: 1000, hp_mod: 0.9, hidden: false, skill_config: {
				create: {	id_skill_category: 3, name: 'armor_hard',
							description: 'комплект брони защищает от стрел и пробивающего оружия.',
							label: 'Тяжелая броня', hidden: false			}}
			}
		]
		for (const i in armor_config) {
			const game_config = await prisma.armorConfig.create({data: armor_config[i]})
			if (!game_config) {context.send(`Ошибка при инициализации типов брони`)}
		}
		context.send('Игра инициализированна успешно.')
	})
}