import { PrismaClient } from "@prisma/client"
import { randomInt } from "crypto";
import { Context } from "vk-io";
import { Z_PARTIAL_FLUSH } from "zlib";
import { prisma } from "../.."
import { Gen_Inline_Button } from "./button";
async function random(min: number, max: number) {
	return min + Math.random() * (max - min);
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
		const instance = new Player()
		instance.user = {
			id: user.id, idvk: user.idvk, id_user_config: user.id_user_config,
			gold: user.gold, nickname: user.nickname, crdate: user.crdate
		}
		instance.body = body
		instance.weapon = weapon
		instance.armor = armor
		instance.skill = skill
		instance.context = context
		instance.smile = {	'player': '👤', 'npc': '🤖', 'skill_up': '⚜'	}
		return instance
	}
	async Sync() {
		console.log(`Sync data for player: ${this.user.idvk}`)
		const user: any = await prisma.user.findFirst({
			where: 		{	id: this.user.id	}
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
		const instance = new Player()
		instance.user = {
			id: user.id, idvk: user.idvk, id_user_config: user.id_user_config,
			gold: user.gold, nickname: user.nickname, crdate: user.crdate
		}
		instance.body = body
		instance.weapon = weapon
		instance.armor = armor
		instance.skill = skill
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
		async function Finder(skill: any, id: number) {
			for (const i in skill) {
				if (skill[i].id_skill_config == id) { return true }
			}
			return false
		} 
		const filter: number[] = []
		for (const i in this.body) {
			const target: number = this.body[i].body_config.id_skill_config
			if (!filter.includes(target)) { 
				const find = await Finder(this.skill, target)
				if (!find) {
					const add = await prisma.skill.create({ data: { id_user: this.user.id, id_skill_config: target}})
					const info = await prisma.skillConfig.findFirst({ where: {id: target}})
					this.context.send(`${this.smile.skill_up}Способность ${info?.label} теперь доступна.`)
				} else { filter.push(target) }
			} else { continue }
		}
		for (const i in this.weapon) {
			const target: number = this.weapon[i].weapon_config.id_skill_config
			if (!filter.includes(target)) { 
				const find = await Finder(this.skill, target)
				if (!find) {
					const add = await prisma.skill.create({ data: { id_user: this.user.id, id_skill_config: target}})
					const info = await prisma.skillConfig.findFirst({ where: {id: target}})
					this.context.send(`${this.smile.skill_up}Способность ${info?.label} теперь доступна.`)
				} else { filter.push(target) }
			} else { continue }
		}
		for (const i in this.armor) {
			const target: number = this.armor[i].armor_config.id_skill_config
			if (!filter.includes(target)) { 
				const find = await Finder(this.skill, target)
				if (!find) {
					const add = await prisma.skill.create({ data: { id_user: this.user.id, id_skill_config: target}})
					const info = await prisma.skillConfig.findFirst({ where: {id: target}})
					this.context.send(`${this.smile.skill_up}Способность ${info?.label} теперь доступна.`)
				} else { filter.push(target) }
			} else { continue }
		}
	}
}