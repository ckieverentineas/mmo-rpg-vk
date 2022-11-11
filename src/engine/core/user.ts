import { PrismaClient } from "@prisma/client"
import { randomInt } from "crypto";
import { Context } from "vk-io";
import { prisma } from "../.."
import { Gen_Inline_Button } from "./button";
async function random(min: number, max: number) {
	return min + Math.random() * (max - min);
}
async function Load(context: any, target: string) {
	const find_player: any = await prisma.userType.findFirst({where: {name: target}, include:{UserConfig: true}})
	const user: any = await prisma.user.findFirst({
		where: 		{	idvk: context.senderId,
						id_user_config: find_player.UserConfig[0].id	}
	})
	const body = await prisma.body.findMany({
		where: 	 {	id_user: 	 	user.id	},
		include: { 	body_config: 	true	}
	})
	const weapon = await prisma.weapon.findMany({
		where: 	 {	id_user: 	 	user.id	},
		include: { 	weapon_config: 	true	}
	})
	const armor = await prisma.armor.findMany({
		where: 	 {	id_user: 	 	user.id	},
		include: { 	armor_config: 	true	}
	})
	const skill = await prisma.skill.findMany({
		where: 	 {	id_user: 	 	user.id	},
		include: { 	skill_config: 	true	}
	})
	return { 'user': user, 'body': body, 'weapon': weapon, 'armor': armor, 'skill': skill }
}

export class Player {
	protected context: any;
	protected user: any;
	protected body: any;
	protected weapon: any;
	protected armor: any;
	protected skill: any;
	protected smile: any;
	public static async build(context: any): Promise<typeof instance>{
		const find_player: any = await prisma.userType.findFirst({where: {name: 'player'}, include:{UserConfig: true}})
		const validator: any = await prisma.user.findFirst({
			where: 		{	idvk: context.senderId,
							id_user_config: find_player.UserConfig[0].id	}
		})
		if (!validator) {
			const user_create = await prisma.user.create({	
				data: 	{	id_user_config: find_player.UserConfig[0].id,
							idvk: context.senderId, 
							gold: find_player.UserConfig[0].gold + find_player.UserConfig[0].gold * await random(-find_player.UserConfig[0].gold_mod, find_player.UserConfig[0].gold_mod),
							nickname: 'alienNames().trim()'								
						}
			})
			const body_config = await prisma.bodyConfig.findMany({include:{skill_config: true}})
			for (const i in body_config) {
				const body_create = await prisma.body.create({
					data: {	id_user: user_create.id,
							id_body_config: body_config[i].id,
							atk_min: body_config[i].atk + body_config[i].atk * await random(-body_config[i].atk_mod, body_config[i].atk_mod),
							atk_max: body_config[i].atk + body_config[i].atk * await random(-body_config[i].atk_mod, body_config[i].atk_mod),
							def_min: body_config[i].def + body_config[i].def * await random(-body_config[i].def_mod, body_config[i].def_mod),
							def_max: body_config[i].def + body_config[i].def * await random(-body_config[i].def_mod, body_config[i].def_mod),
							health: body_config[i].health + body_config[i].health * await random(-body_config[i].health_mod, body_config[i].health_mod),
							name: body_config[i].skill_config.label
						}
				})
			}
			console.log(`Created account for user ${user_create.idvk}`)
		}
		const data = await Load(context, 'player')
		const instance = new Player()
		instance.user = data.user
		instance.body = data.body
		instance.weapon = data.weapon
		instance.armor = data.armor
		instance.skill = data.skill
		instance.context = context
		instance.smile = {	'player': '👤', 'npc': '🤖', 'skill_up': '⚜'	}
		return instance
	}
	async Sync() {
		console.log(`Sync data for player: ${this.user.idvk}`)
		const data = await Load(this.context, 'player')
		this.user = data.user
		this.body = data.body
		this.weapon = data.weapon
		this.armor = data.armor
		this.skill = data.skill
	}
	async Save() {
		console.log(`Save status for player: ${this.user.idvk}`)
		for (const i in this.user) {
			const update = await prisma.user.update({
				where:  { id: 	this.user.id },
				data: 	{ gold: this.user.gold }
			})
		}
		for(const i in this.weapon) {
			const update = await prisma.weapon.update({
				where: { id: 	this.weapon[i].id},
				data:  { hp: 	this.weapon[i].hp}
			})
		}
		for(const i in this.armor) {
			const update = await prisma.armor.update({
				where: { id: 	this.armor[i].id},
				data:  { hp: 	this.armor[i].hp}
			})
		}
		for (const i in this.skill) {
			const update = await prisma.skill.update({
                where: { id:     this.skill[i].id},
                data:  { xp:     this.skill[i].xp}
            })
		}
	}
	async Detector() {
		console.log(`Reseach new skills for player: ${this.user.idvk}`)
		async function Anal(skill: any, data: any, context: any, pattern: string, smile: string) {
			for (const i in data) {
				const target: number = data[i][pattern].id_skill_config
				if (!filter.includes(target)) { 
					const find = await Finder(skill, target)
					if (!find) {
						const add = await prisma.skill.create({ data: { id_user: data[i].id_user, id_skill_config: target}})
						const info = await prisma.skillConfig.findFirst({ where: {id: target}})
						await context.send(`${smile}Способность ${info?.label} теперь доступна.`)
					} else { filter.push(target) }
				} else { continue }
			}
		}
		async function Finder(skill: any, id: number) {
			for (const i in skill) {
				if (skill[i].id_skill_config == id) { return true }
			}
			return false
		} 
		const filter: number[] = []
		await Anal(this.skill, this.body, this.context, 'body_config', this.smile.skill_up)
		await Anal(this.skill, this.weapon, this.context, 'weapon_config', this.smile.skill_up)
		await Anal(this.skill, this.armor, this.context, 'armor_config', this.smile.skill_up)
	}
	async Print() {
		let res = ''
		const ico: any = ['🧢', '👘', '🤛🏻', '🤜🏻', '🦵🏻', '🦵🏻', '👟', '👞']
		for (const i in this.body) {
			res += `${ico[i]}: ⚔${this.body[i].atk_min.toFixed(2)} - ${this.body[i].atk_max.toFixed(2)} 🛡${this.body[i].def_min.toFixed(2)} - ${this.body[i].def_max.toFixed(2)} ❤${this.body[i].health.toFixed(2)} \n`
		}
		this.context.send(`${res}`)
	}
	async Craft() {
		async function Selector(user: any, body: any, context: any, data: any, pattern:string, id: number) {
			let target: any = null
			for (const i in data) {
				if (data[i].pattern == id) { target = data[i].pattern }
			}
			if (pattern == 'weapon_config') {
				if (!target) {
					const find = await prisma.weaponConfig.findFirst({ where: { id_skill_config: id, hidden: false } })
					target = find
				}
				const create = await prisma.weapon.create({
					data: {
						id_user: user.id,
						id_weapon_config: target.id,
						id_body_config: body[randomInt(0, body.length)].id_body_config,
						lvl: target.lvl + target.lvl * await random(-target.lvl_mod, target.lvl_mod),
						atk_min: target.atk + target.atk * await random(-target.atk_mod, target.atk_mod),
						atk_max: target.atk + target.atk * await random(-target.atk_mod, target.atk_mod),
						hp: target.hp + target.hp * await random(-target.hp_mod, target.hp_mod),
						name: 'weapon'
					}
				})
				await context.send(`Получено оружие: ${create.name} ⚔${create.atk_min}-${create.atk_max} 🔧${create.hp}`)
			}
			if (pattern == 'armor_config') {
				if (!target) {
					const find = await prisma.armorConfig.findFirst({ where: { id_skill_config: id, hidden: false } })
					target = find
				}
				const create = await prisma.armor.create({
					data: {
						id_user: user.id,
						id_armor_config: target.id,
						id_body_config: body[randomInt(0, body.length)].id_body_config,
						lvl: target.lvl + target.lvl * await random(-target.lvl_mod, target.lvl_mod),
						def_min: target.def + target.def * await random(-target.def_mod, target.def_mod),
						def_max: target.def + target.def * await random(-target.def_mod, target.def_mod),
						hp: target.hp + target.hp * await random(-target.hp_mod, target.hp_mod),
						name: 'armor'
					}
					
				})
				await context.send(`Получено: ${create.name} 🛡${create.def_min}-${create.def_max} 🔧${create.hp}`)
			}
			return false
		} 
		const category = await prisma.skillCategory.findMany({ where: { hidden: false } })
		const skill = await  Gen_Inline_Button(this.context, category, 'Выберите категорию:')
		if (!skill) {return false}
		const skill_config = await prisma.skillConfig.findMany({ where: { id_skill_category: skill.id, hidden: false } })
		const skill_sel = await Gen_Inline_Button(this.context, skill_config, 'Что будем крафтить?')
		if (!skill_sel) {return false}
		if (skill_sel.id_skill_category == 2) {
			await Selector(this.user, this.body, this.context, this.weapon, 'weapon_config', skill_sel.id)
		}
		if (skill_sel.id_skill_category == 3) {
			await Selector(this.user, this.body, this.context, this.armor, 'armor_config', skill_sel.id)
		}
	}
}