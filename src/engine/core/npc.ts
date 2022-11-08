import { PrismaClient } from "@prisma/client"
import { randomInt } from "crypto"
import { Keyboard } from "vk-io"
import { prisma } from "../.."
import { Player } from "./user"

export class NPC extends Player {
	public static async build(context: any) : Promise<Player> {
		const config_user: any = await prisma.userConfig.findFirst({})
        console.log("🚀 ~ file: npc.ts ~ line 10 ~ NPC ~ build ~ config_user", config_user)
        const config_weapon: any = await prisma.weaponConfig.findMany({     include: {  skill_config: true  }   })
        const config_armor: any = await prisma.armorConfig.findMany({     include: {  skill_config: true  }   })
        
        const select_weapon = randomInt(1, config_weapon.length)-1
        const weapon = [{
            id_skill_config:    config_weapon[select_weapon].id_skill_config,
            id_damage_type:     1,
            lvl:                randomInt(config_weapon[select_weapon].lvl_req_min, config_weapon[select_weapon].lvl_req_max),
            atk_min:            config_weapon[select_weapon].atk_min,
            atk_max:            randomInt(config_weapon[select_weapon].atk_min+1, config_weapon[select_weapon].atk_max),
            hp:                 randomInt(config_weapon[select_weapon].hp_min, config_weapon[select_weapon].hp_max),           
        }]
        let armor = []
        const select_armor = randomInt(1, config_armor.length)-1
        const armor_type: any = await prisma.armorType.findMany()
        for (let i= 0; i < armor_type.length; i++) {
            const data: any = {
                id_armor_type: armor_type[i].id,
                id_skill_config: config_armor[select_armor].id_skill_config,
                id_damage_type: 1,
                lvl: randomInt(config_armor[select_armor].lvl_req_min, config_armor[select_armor].lvl_req_max),
                def_min: config_armor[select_armor].def_min,
                def_max: randomInt(config_armor[select_armor].def_min+1, config_armor[select_armor].def_max),
                hp: randomInt(config_armor[select_armor].hp_min, config_armor[select_armor].hp_max),
                name: armor_type[i].label
            }
            armor.push(data)
        }
        const user: any = {     idvk:           context.senderId,
                                gold:           randomInt(config_user.gold_min, config_user.gold_max),
                                hp:             randomInt(config_user.hp_min, config_user.hp_max),
                                id_user_type:   2,
                                Weapon:         weapon,
                                Armor:          armor,
                                Skill:          [{xp: 0, id_skill_config: 1, name: "Аннигиляторная пушка"}, {xp: 0, id_skill_config: 2, name: "Аннигиляторная пушка"},
                                                {xp: 0, id_skill_config: 3, name: "Аннигиляторная пушка"}, {xp: 0, id_skill_config: 4, name: "Аннигиляторная пушка"}],                 }
		const instance = new NPC()
		instance.user = user
		instance.context = context
		instance.hp_current = user?.hp
        instance.smile = {	'player': '🤖', 'npc': '👤', 'skill_up': '🦾'	}
		return instance
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