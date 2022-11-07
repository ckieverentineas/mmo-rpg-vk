import { PrismaClient } from "@prisma/client"
import { randomInt } from "crypto"
import { Context } from "vk-io";
import { prisma } from "../.."

export class Player {
	static context: any;
	static user: any;
	static hp_max: number;
	public static async build(context: any) : Promise<Player> {
		const user: any = await prisma.user.findFirst({
			where: {
				idvk: context.senderId
			},
			include: {
				Weapon: true,
				Armor: true,
				Skill: true
			}
		})
		this.user = user
		this.context = context
		this.hp_max = user.hp
		return new Player()
	}
	async User_Sync() {
		const user: any = await prisma.user.findFirst({
			where:		{	idvk: 	Player.user.idvk	},
			include:	{	Weapon: true,
							Armor:	true,
							Skill:	true				}
		})
		console.log(`User data starting sync for getting new data..`)
		Player.user = user
		Player.hp_max = user.hp
	}
	private async Skill_Up(id_skill_config: number, name: string) {
		for (let i = 0; i < Player.user.Skill.length; i++) {
			if (Player.user.Skill[i].id_skill_config == id_skill_config) {
				const gen = randomInt(0,100)
				if (gen >= 50) {
					const mod = randomInt(1,10)
					Player.user.Skill[i].xp+= mod
					Player.context.send(`⚜Повышение ${name} на ${Player.user.Skill[0].xp - (Player.user.Skill[0].xp-mod)}`)
				}
			} 
		}
	}
	async Print() {
		const hp_current = Player.user.hp / Player.hp_max 
		let bar = ''
		for (let i = 0; i <= 1; i += 0.1) {
			if (i < hp_current) {
				bar += '⬛'
			} else {
				bar += '⬜'
			}
		}
		console.log(bar)
		return `👤: ${bar}↺${(Player.user.hp / Player.hp_max * 100).toFixed(2)}% \n ❤${Player.user.hp.toFixed(2)}/${Player.hp_max.toFixed(2)} ⚔${Player.user.Weapon[0].atk_min}-${Player.user.Weapon[0].atk_max} 🔧${Player.user.Weapon[0].hp}`
	}
	async Attack() {
		let dmg_sum = []
		for (let i = 0; i < Player.user.Weapon.length; i++) {
			Player.user.Weapon[i].hp--
			const dmg = randomInt(Player.user.Weapon[i].atk_min, Player.user.Weapon[i].atk_max) 
			await this.Skill_Up(Player.user.Weapon[i].id_skill_config, Player.user.Weapon[i].name)
			dmg_sum.push({name: Player.user.Weapon[i].name, dmg: dmg})
		}
		return dmg_sum
	}
	async Defense(atk: any){
		for (let i = 0; i < atk.length; i++) {
			const part = randomInt(0, 6)
			Player.user.Armor[part].hp--
			const def = randomInt(Player.user.Armor[part].def_min, Player.user.Armor[part].def_max)
			Player.user.hp -= atk[i].dmg * (1 - def/100)
			await this.Skill_Up(Player.user.Armor[part].id_skill_config, Player.user.Armor[i].name)
			await Player.context.send(`🤖нанес 💥${(atk[i].dmg * (1 - def/100)).toFixed(2)} из ${atk[i].name}.`)
		}
	}
	
	async Save() {
		async function Skill_Sync(arr: any,) {
			async function Finder (id_skill_config: number) {
				for (let i = 0; i < Player.user.Skill.length; i++) {
					if (Player.user.Skill[i].id_skill_config == id_skill_config) {return Player.user.Skill[i]} 
				}
				return false
			}
			let filter: any = []
			let sync_on = false
			for (let i = 0; i < arr.length; i++) {
				if (!filter.includes(arr[i].id_skill_config)) {
					let select_skill = await Finder(arr[i].id_skill_config)
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
						await Player.context.send(`🏴‍☠Получен новый скилл: ${skill_create.id_skill_config}`)
						filter.push(arr[i].id_skill_config)
						sync_on = true
					}
				}
			}
			return sync_on
		}

		const weapon = await Skill_Sync(Player.user.Weapon)
		const armor = await Skill_Sync(Player.user.Armor)
		if (weapon) { console.log(`Weapon skill created on server, need sync`) } else { console.log(`Weapon skill not need sync`) }
		if (armor) { console.log(`Armor skill created on server, need sync`) } else { console.log(`Armor skill not need sync`) }
		if (weapon || armor) {
			await this.User_Sync()
		}
		const save_user = await prisma.user.update({
			where:	{ id: Player.user.id },
			data:	{	gold: Player.user.gold,
						hp: Player.user.hp,
						id_user_type: Player.user.id_user_type	}
		})
		if (save_user) {
			console.log(`User ${save_user.idvk} sync success`)
		}
		for (let i = 0; i < Player.user.Weapon.length; i++) {
			const save_weapon = await prisma.weapon.update({
				where:	{ id: Player.user.Weapon[i].id },
				data:	{ hp: Player.user.Weapon[i].hp }
			})
			if (save_weapon) {
				console.log(`Weapon ${save_weapon.name} sync success`)
			}
		}
		for (let i = 0; i < Player.user.Armor.length; i++) {
			const save_armor = await prisma.armor.update({
				where:	{ id: Player.user.Armor[i].id },
				data:	{ hp: Player.user.Armor[i].hp }
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
export async function Player_register(context:any) {
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
        context.send(`Получено золота: ${user_create.gold}
            Ваше здоровье: ${user_create.hp}`)
		console.log(`Created account for user ${user_create.idvk}`)
}