import { PrismaClient } from "@prisma/client"
import { randomInt } from "crypto"
import { Keyboard } from "vk-io"
import { prisma } from "../.."
import { Player } from "./user"

export class NPC extends Player {
	public static async build(context: any) : Promise<NPC> {
        const select_type: any = await prisma.userType.findFirst({	where: {	name: 'npc'	}	})
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
			console.log(`Created npc for user ${user_create.idvk}`)
		}
		const user: any = await prisma.user.findFirst({
			where: 		{	idvk: context.senderId,
							id_user_type: select_type.id	},
			include: 	{	Weapon: true,
							Armor: true,
							Skill: true						}
		})
		console.log("🚀 ~ file: npc.ts ~ line 31 ~ NPC ~ build ~ user", user)
		const instance = new NPC()
		instance.user = user
		instance.context = context
		instance.hp_current = user?.hp
        instance.smile = {	'player': '🤖', 'npc': '👤', 'skill_up': '🦾'	}
		return instance
	}
    async Create_Weapon(): Promise<void>{
        const weapon_config:any = await prisma.weaponConfig.findFirst({})
        const weapon_create = await prisma.weapon.create({
            data:{
                id_user: this.user.id,
                id_skill_config: weapon_config.id_skill_config,
                id_damage_type: 1,
                lvl: randomInt(weapon_config.lvl_req_min, weapon_config.lvl_req_max),
                atk_min: weapon_config.atk_min,
                atk_max: randomInt(weapon_config.atk_min+1, weapon_config.atk_max),
                hp: randomInt(weapon_config.hp_min || 0, weapon_config.hp_max),
                name: 'Оружие нафиг'
            }
        })
    }
    async Create_Armor(): Promise<void>{
        const armor_config:any = await prisma.armorConfig.findFirst({})
        const armor_type: any = await prisma.armorType.findMany({})
        for (let i= 0; i < armor_type.length; i++) {
            const weapon_create = await prisma.armor.create({
                data:{
                    id_user: this.user.id,
                    id_skill_config: armor_config.id_skill_config,
                    id_damage_type: 1,
                    id_armor_type: armor_type[i].id,
                    lvl: randomInt(armor_config.lvl_req_min, armor_config.lvl_req_max),
                    def_min: armor_config.def_min,
                    def_max: randomInt(armor_config.def_min+1, armor_config.def_max),
                    hp: randomInt(armor_config.hp_min, armor_config.hp_max),
                    name: 'Броня нафиг'
                }
            })
        }
    }
}
export async function NPC_create() {
    const npc_config_get: any = await prisma.userConfig.findFirst({})
    const npc_create: any = {
        idvk: 0,
        gold: randomInt(npc_config_get?.gold_min||5, npc_config_get?.gold_max||10),
        hp: randomInt(npc_config_get?.hp_min||5, npc_config_get?.hp_max||10),
        id_user_type: 2
    }
    return npc_create
}
export async function NPC_weapon_create() {
    const weapon_config_get: any = await prisma.weaponConfig.findFirst({
        where: {
            id_skill_config: randomInt(1, 4)
        }
    })
    const npc_weapon: any = {
        id_skill_config: weapon_config_get.id_skill_config,
        id_damage_type: 1,
        lvl: randomInt(weapon_config_get?.lvl_req_min || 0, weapon_config_get?.lvl_req_max || 5),
        atk_min: weapon_config_get?.atk_min,
        atk_max: randomInt(weapon_config_get?.atk_min+1 || 0, weapon_config_get?.atk_max || 5),
        hp: randomInt(weapon_config_get?.hp_min || 0, weapon_config_get?.hp_max || 5),
    }
    return npc_weapon
}

export async function NPC_armor_create() {
    const armor_type: any = await prisma.armorType.findMany()
    const armor_config_get:any = await prisma.armorConfig.findFirst({
        where: {
            id_skill_config: randomInt(5,7)
        }
    })
    
    let npc_armor: any = []
    for (let i= 0; i < armor_type.length; i++) {
        const data: any = {
            id: armor_type[i].id,
            id_skill_config: armor_config_get.id_skill_config,
            id_damage_type: 1,
            id_armor_type: armor_type[i].id,
            lvl: randomInt(armor_config_get?.lvl_req_min || 0, armor_config_get?.lvl_req_max || 5),
            def_min: armor_config_get?.def_min || 0,
            def_max: randomInt(armor_config_get?.def_min+1 || 0, armor_config_get?.def_max || 5),
            hp: randomInt(armor_config_get?.hp_min || 0, armor_config_get?.hp_max || 5),
            name: armor_type[i].label
        }
        npc_armor.push(data)
    }
    return npc_armor
}