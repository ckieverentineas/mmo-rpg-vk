import { PrismaClient } from "@prisma/client"
import { randomInt } from "crypto"
import { Context } from "vk-io";
import { prisma } from "../.."

export class Player {
	static context: any;
	static user: any;
	public static async build(context: any) : Promise<Player> {
		const user = await prisma.user.findFirst({
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
		return new Player()
	}
	
	async Skill_Up_Weapon() {
		const gen = randomInt(0,100)
		console.log(gen)
		if (gen > 1) {
			const mod = randomInt(1,10)
			Player.user.Skill[0].xp+= mod
			Player.context.send(`Уровень владения оружием повышен на c ${Player.user.Skill[0].xp-mod} до ${Player.user.Skill[0].xp}`)
		}
	}
	async Skill_Up_Armor() {
		async function Finder() {
			//выбор части брони, по которой будет удар
			const part = randomInt(0, Player.user.Armor.length)
			for (let i = 0; i < Player.user.Skill.length; i++) {
				if (Player.user.Skill[i].id_skill_config == Player.user.Armor[part].id_skill_config) {
					//отправка индекса скилла, который будет на прокачке
					return i
				}
			}
			return false
		}
		//шанс прокачки
		const gen = randomInt(0,100)
		const target: any = Finder()
		if (gen > 1 && target) {
			//прокачка защитного скилла
			const mod = randomInt(1,10)
			Player.user.Skill[target].xp+= mod
			Player.context.send(`Уровень владения броней повышен на c ${Player.user.Skill[target].xp-mod} до ${Player.user.Skill[target].xp}`)
		}
	}
	async User_Sync() {
		const user = await prisma.user.findFirst({
			where:		{	idvk: 	Player.user.idvk	},
			include:	{	Weapon: true,
							Armor:	true,
							Skill:	true				}
		})
		console.log(`User data starting sync for getting new data..`)
		Player.user = user
	}
	async Save() {
		async function Skill_Sync(arr: any,) {
			async function Finder (id_skill_config: number) {
				for (let i = 0; i < Player.user.Skill.length; i++) {
					if (Player.user.Skill[i].id_skill_config == id_skill_config) {return Player.user.Skill[i]} else {return false}
				}
			}
			let filter: any = []
			let sync_on = false
			for (let i = 0; i < arr.length; i++) {
				if (!filter.includes(arr[i].id_skill_config)) {
					const select_skill = await Finder(arr[i].id_skill_config)
					if (select_skill) {
						const skill_update = await prisma.skill.update({
							where:	{	id:					select_skill?.id,		},
							data:	{	xp: 				select_skill?.xp,
										lvl: 				select_skill?.lvl		},
						})
						filter.push(arr[i].id_skill_config)
					} else {
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