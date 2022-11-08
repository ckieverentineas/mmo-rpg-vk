import { PrismaClient } from "@prisma/client"
import { randomInt } from "crypto"
import { Context } from "vk-io";
import { prisma } from "../.."

export class Player {
	context: any;
	user: any;
	hp_current: any;
	smile: any;
	public static async build(context: any) : Promise<Player> {
		const select_type: any = await prisma.userType.findFirst({	where: {	name: 'player'	}	})
		const validator: any = await prisma.user.findFirst({
			where: 		{	idvk: context.senderId,
							id_user_type: select_type.id	}
		})
		if (!validator) {
			const user_config_get: any = await prisma.userConfig.findFirst({})
			const user_create = await prisma.user.create({	
				data: {		idvk: context.senderId,
							gold: randomInt(user_config_get?.gold_min, user_config_get?.gold_max),
							hp: randomInt(user_config_get?.hp_min, user_config_get?.hp_max),
							id_user_type: select_type.id													}
			})
			context.send(`Получено золота: ${user_create.gold} \n Ваше здоровье: ${user_create.hp}`)
			console.log(`Created account for user ${user_create.idvk}`)
		}
		const user: any = await prisma.user.findFirst({
			where: 		{	idvk: context.senderId,
							id_user_type: select_type.id	},
			include: 	{	Weapon: true,
							Armor: true,
							Skill: true						}
		})
		const instance = new Player()
		instance.user = user
		instance.context = context
		instance.hp_current = user?.hp
		instance.smile = {	'player': '👤', 'npc': '🤖', 'skill_up': '⚜'	}
		return instance
	}
	async User_Sync() {
		const user: any = await prisma.user.findFirst({
			where:		{	idvk: 	this.user.idvk	},
			include:	{	Weapon: true,
							Armor:	true,
							Skill:	true				}
		})
		console.log(`User data starting sync for getting new data..`)
		this.user = user
		this.hp_current = user.hp
	}
	protected async Skill_Up(id_skill_config: number, name: string) {
		for (let i = 0; i < this.user.Skill.length; i++) {
			if (this.user.Skill[i].id_skill_config == id_skill_config) {
				const gen = randomInt(0,100)
				if (gen >= 60) {
					const mod = randomInt(1,10)
					this.user.Skill[i].xp+= mod
					this.context.send(`${this.smile?.skill_up}Повышение ${name} на ${this.user.Skill[0].xp - (this.user.Skill[0].xp-mod)}`)
				}
			} 
		}
	}
	async Print() {
		const bar_current = this.hp_current / this.user.hp
		let bar = ''
		for (let i = 0; i <= 1; i += 0.1) {
			bar += (i < bar_current) ? '⬛' : '⬜'
		}
		return `${this.smile?.player}: ${bar} ↺${(this.hp_current / this.user.hp * 100).toFixed(2)}%\n ❤${this.hp_current.toFixed(2)}/${this.user.hp.toFixed(2)} ⚔${this.user.Weapon[0].atk_min}-${this.user.Weapon[0].atk_max} 🔧${this.user.Weapon[0].hp}`
	}
	async Attack() {
		let dmg_sum = []
		for (let i = 0; i < this.user.Weapon.length; i++) {
			this.user.Weapon[i].hp--
			const dmg = randomInt(this.user.Weapon[i].atk_min, this.user.Weapon[i].atk_max) 
			await this.Skill_Up(this.user.Weapon[i].id_skill_config, this.user.Weapon[i].name)
			dmg_sum.push({name: this.user.Weapon[i].name, dmg: dmg})
		}
		return dmg_sum
	}
	async Defense(atk: any){
		for (let i = 0; i < atk.length; i++) {
			const part = randomInt(0, 6)
			this.user.Armor[part].hp--
			const def = randomInt(this.user.Armor[part].def_min, this.user.Armor[part].def_max)
			this.hp_current -= atk[i].dmg * (1 - def/100)
			await this.Skill_Up(this.user.Armor[part].id_skill_config, this.user.Armor[i].name)
			await this.context.send(`${this.smile?.npc}нанес 💥${(atk[i].dmg * (1 - def/100)).toFixed(2)} из ${atk[i].name}.`)
		}
	}
	
	async Save() {
		async function Skill_Sync(arr: any, skill: any, context: any) {
			async function Finder (id_skill_config: number, skill: any) {
				for (let i = 0; i < skill.length; i++) {
					if (skill[i].id_skill_config == id_skill_config) {return skill[i]} 
				}
				
				return false
			}
			let filter: any = []
			let sync_on = false
			for (let i = 0; i < arr.length; i++) {
				if (!filter.includes(arr[i].id_skill_config)) {
					let select_skill = await Finder(arr[i].id_skill_config, skill)
					if (select_skill) {
						const skill_update = await prisma.skill.update({
							where:	{	id:					select_skill?.id,		},
							data:	{	xp: 				select_skill?.xp,
										lvl: 				select_skill?.lvl		},
						})
						filter.push(arr[i].id_skill_config)
					}
					if (select_skill == false) {
						const skill_create = await prisma.skill.create({
							data:	{	id_user:			arr[i].id_user,
										id_skill_config:	arr[i].id_skill_config,
										lvl:				0,
										xp:					0						}	
						})
						await context.send(`🏴‍☠Получен новый скилл: ${skill_create.id_skill_config}`)
						filter.push(arr[i].id_skill_config)
						sync_on = true
					}
				}
			}
			return sync_on
		}

		const weapon = await Skill_Sync(this.user.Weapon, this.user.Skill, this.context)
		const armor = await Skill_Sync(this.user.Armor, this.user.Skill, this.context)
		if (weapon) { console.log(`Weapon skill created on server, need sync`) } else { console.log(`Weapon skill not need sync`) }
		if (armor) { console.log(`Armor skill created on server, need sync`) } else { console.log(`Armor skill not need sync`) }
		if (weapon || armor) {
			await this.User_Sync()
		}
		const save_user = await prisma.user.update({
			where:	{ id: this.user.id },
			data:	{	gold: this.user.gold,
						hp: this.user.hp,
						id_user_type: this.user.id_user_type	}
		})
		if (save_user) {
			console.log(`User ${save_user.idvk} sync success`)
		}
		for (let i = 0; i < this.user.Weapon.length; i++) {
			const save_weapon = await prisma.weapon.update({
				where:	{ id: this.user.Weapon[i].id },
				data:	{ hp: this.user.Weapon[i].hp }
			})
			if (save_weapon) {
				console.log(`Weapon ${save_weapon.name} sync success`)
			}
		}
		for (let i = 0; i < this.user.Armor.length; i++) {
			const save_armor = await prisma.armor.update({
				where:	{ id: this.user.Armor[i].id },
				data:	{ hp: this.user.Armor[i].hp }
			})
			if (save_armor) {
				console.log(`Armor ${save_armor.name}-${save_armor.id} sync success`)
			}
		}
	}
}

export async function Player_get(idvk: number) {
    const user_get = await prisma.user.findFirst({
        where: {
            idvk: idvk
        }
    })
    return user_get
}