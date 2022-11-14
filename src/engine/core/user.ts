import { PrismaClient } from "@prisma/client"
import { randomInt } from "crypto";
import { Context, Keyboard } from "vk-io";
import { prisma } from "../.."
import { Gen_Inline_Button, Gen_Inline_Button_Equipment } from "./button";

export async function random(min: number, max: number) {
	return min + Math.random() * (max - min);
}

export async function Load(context: any, target: string) {
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

export async function Detector_Health(body: any) {
	let sum = 0
	for (const i in body) { sum += body[i].health }
	return sum
}
export async function Detector_Atk(data: any, body: any) {
	let sum: any = { atk_min: 0, atk_max: 0, hp: '' }
	let hp = []
	for (const i in data) {
		if (data[i].equip) {
			sum.atk_min += data[i].atk_min
			sum.atk_max += data[i].atk_max
			hp.push(data[i].hp)
		}
	}
	if (hp.length > 0) {
		let avg = 0
		for (const i in hp) { avg += hp[i] }
		avg /= hp.length
		sum.hp = avg.toFixed(2)
	} else { sum.hp = '∞' }
	if (sum.atk_max == 0) {
		for (const i in body) {
			if (body[i].atk_min > 0) {
				sum.atk_min += body[i].atk_min
				sum.atk_max += body[i].atk_max
			}
		}
	}
	return sum
}

export class Player {
	protected context: any;
	protected user: any;
	protected body: any;
	protected weapon: any;
	protected armor: any;
	protected skill: any;
	protected smile: any;
	protected health: any;
	get _health():number { return this.health }
	protected health_max: any;
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
		instance.health = await Detector_Health(data.body)
		instance.health_max = await Detector_Health(data.body)
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
				data:  { hp: 	this.weapon[i].hp, equip: this.weapon[i].equip}
			})
		}
		for(const i in this.armor) {
			const update = await prisma.armor.update({
				where: { id: 	this.armor[i].id},
				data:  { hp: 	this.armor[i].hp, equip: this.armor[i].equip}
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
	async Info() {
		let res = ''
		const ico: any = ['🧢', '👘', '🤛🏻', '🤜🏻', '🦵🏻', '🦵🏻', '👟', '👞']
		for (const i in this.body) {
			res += `${ico[i]}: ⚔${this.body[i].atk_min.toFixed(2)} - ${this.body[i].atk_max.toFixed(2)} 🛡${this.body[i].def_min.toFixed(2)} - ${this.body[i].def_max.toFixed(2)} ❤${this.body[i].health.toFixed(2)} \n`
		}
		return res
	}
	async Craft() {
		console.log(`Visit craft system by player: ${this.user.idvk}`)
		async function Selector(user: any, body: any, context: any, data: any, pattern:string, id: number, selected_part: any) {
			let target: any = null
			for (const i in data) { if (data[i].pattern == id) { target = data[i].pattern } }
			if (pattern == 'weapon_config') {
				if (!target) {
					const find = await prisma.weaponConfig.findFirst({ where: { id_skill_config: id, hidden: false } })
					target = find
				}
				const create = await prisma.weapon.create({
					data: {	id_user: 			user.id,
							id_weapon_config: 	target.id,
							id_body_config: 	selected_part.id,
							lvl: 				target.lvl + target.lvl * await random(-target.lvl_mod, target.lvl_mod),
							atk_min: 			target.atk + target.atk * await random(-target.atk_mod, target.atk_mod),
							atk_max: 			target.atk + target.atk * await random(-target.atk_mod, target.atk_mod),
							hp: 				target.hp + target.hp * await random(-target.hp_mod, target.hp_mod),
							name: 				'weapon'																	}
				})
				await context.send(`Получено оружие: ${create.name} ⚔${create.atk_min.toFixed(2)} - ${create.atk_max.toFixed(2)} 🔧${create.hp.toFixed(2)} \n Применяется на части тела: ${selected_part.label}`)
			}
			if (pattern == 'armor_config') {
				if (!target) {
					const find = await prisma.armorConfig.findFirst({ where: { id_skill_config: id, hidden: false } })
					target = find
				}
				const create = await prisma.armor.create({
					data: {	id_user: 			user.id,
							id_armor_config: 	target.id,
							id_body_config: 	selected_part.id,
							lvl: 				target.lvl + target.lvl * await random(-target.lvl_mod, target.lvl_mod),
							def_min: 			target.def + target.def * await random(-target.def_mod, target.def_mod),
							def_max: 			target.def + target.def * await random(-target.def_mod, target.def_mod),
							hp: 				target.hp + target.hp * await random(-target.hp_mod, target.hp_mod),
							name: 				'armor'																		}
				})
				await context.send(`Получено: ${create.name} 🛡${create.def_min.toFixed(2)} - ${create.def_max.toFixed(2)} 🔧${create.hp.toFixed(2)} \n Применяется на части тела: ${selected_part.label}`)
			}
			return false
		} 
		let cat_stop = false
		while (cat_stop == false) {
			const category = await prisma.skillCategory.findMany({ where: { hidden: false } })
			const skill = await  Gen_Inline_Button(this.context, category, 'Выберите категорию:')
			if (!skill) {return false}
			const skill_config = await prisma.skillConfig.findMany({ where: { id_skill_category: skill.id, hidden: false } })
			const skill_sel = await Gen_Inline_Button(this.context, skill_config, 'Что будем крафтить?')
			const part = await prisma.skillConfig.findMany({ where: { id_skill_category: 1 } })
			const part_sel: any = await Gen_Inline_Button(this.context, part, "Для какой части тела?")
			if (!skill_sel) {return false}
			if (skill_sel.id_skill_category == 2) {
				await Selector(this.user, this.body, this.context, this.weapon, 'weapon_config', skill_sel.id, part_sel)
			}
			if (skill_sel.id_skill_category == 3) {
				await Selector(this.user, this.body, this.context, this.armor, 'armor_config', skill_sel.id, part_sel)
			}
		}
		
	}
	async Inventory() {
		console.log(`Visit inventory system by player: ${this.user.idvk}`)
		let cat_stop = false
		while (cat_stop == false) {
			const category = await prisma.skillCategory.findMany({ where: { hidden: false } })
			const skill = await  Gen_Inline_Button(this.context, category, 'Выберите категорию:')
			if (!skill) {return false} else { cat_stop = true }
			if (skill.id == 3) {
				const pull: any = await Gen_Inline_Button_Equipment(this.armor, this.context, 'armor_config') 
				cat_stop = pull?.cat_stop
				this.armor = pull?.data
			}
			if (skill.id == 2) {
				const pull: any = await Gen_Inline_Button_Equipment(this.weapon, this.context, 'weapon_config') 
				cat_stop = pull?.cat_stop
				this.weapon = pull?.data
			}
		}
	}
	protected async Skill_Up(id_skill_config: number) {
		for (let i = 0; i < this.skill.length; i++) {
			if (this.skill[i].id_skill_config == id_skill_config) {
				const gen1 = randomInt(0,100)
				const gen2 = randomInt(0, 100)
				const gen3 = Math.random()
				const gen4 = Math.random()
				if (gen1 > 50 && gen2 < 50 && gen3 > 0.5 && gen4 < 0.5) {
					const mod = Math.random()
					this.skill[i].xp+= mod
					await this.context.send(`${this.smile?.skill_up}Повышение ${this.skill[i].skill_config.label} на ${mod.toFixed(2)}`)
				}
			} 
		}
	}
	async Attack() {
		console.log(`Attack from player: ${this.user.idvk}`)
		let sum: any = []
		for (const i in this.weapon) {
			if ( this.weapon[i].equip) {
				console.log(this.weapon[i].weapon_config.id_skill_config)
				await this.Skill_Up(this.weapon[i].weapon_config.id_skill_config)
				sum.push({ name: `${this.weapon[i].name}`, dmg: `${await random(this.weapon[i].atk_min, this.weapon[i].atk_max)}`})
			}
		}
		if (sum.length < 1) {
			for (const i in this.body) {
				if (this.body[i].atk_min > 0) {
					await this.Skill_Up(this.body[i].body_config.id_skill_config)
					sum.push({ name: `${this.body[i].name}`, dmg: `${await random(this.body[i].atk_min, this.body[i].atk_max)}`})
				}
			}
		}
		return sum
	}
	async Defense(sum: any) {
		console.log(`Defence from player: ${this.user.idvk}`)
		let full_dmg = 0
		for (const x in sum) {
			const parts: any = await prisma.bodyConfig.findMany({})
			const target: any = randomInt(0, parts.length)
			let find = false
			for (const i in this.armor) {
				if(this.armor[i].id_body_config == parts[target].id && this.armor[i].equip) {
					for (const j in this.body) {
						if (this.body[j].body_config.id == this.armor[i].id_body_config) {
							find = true
							const reduce = sum[x].dmg * (1 - await random(this.armor[i].def_min, this.armor[i].def_max)/100)
							this.health -= reduce
							full_dmg += reduce
							await this.Skill_Up(this.armor[i].armor_config.id_skill_config)
						}
					}
				}
			}
			if (!find) {
				for (const j in this.body) {
					if (this.body[j].body_config.id == parts[target].id) {
						find = true
						const reduce = sum[x].dmg * (1 - await random(this.body[j].def_min, this.body[j].def_max)/100)
						this.health -= reduce
						full_dmg += reduce
						await this.Skill_Up(this.body[j].body_config.id_skill_config)
					}
				}
			}
		}
		this.context.send(`${this.smile.npc} нанес 💥${full_dmg.toFixed(2)}`)
	}
	async Print() {
		const bar_current = this.health/this.health_max
		let bar = ''
		for (let i = 0; i <= 1; i += 0.1) {
			bar += (i < bar_current) ? '🟥' : '◻'
		}
		const weapon = await Detector_Atk(this.weapon, this.body)
		return `${this.smile?.player}: ${bar} [${(bar_current*100).toFixed(2)}%]\n ❤${this.health.toFixed(2)}/${this.health_max.toFixed(2)} ⚔${weapon.atk_min.toFixed(2)}-${weapon.atk_max.toFixed(2)} 🔧${weapon.hp} [${this.user.nickname}]`

	}
}