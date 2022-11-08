import { PrismaClient } from "@prisma/client"
import { randomInt } from "crypto"
import { Player_get } from "./user"
import { prisma } from "../.."

async function Weapon_Config_Get(skill: any) {
    const weapon_config_get = await prisma.weaponConfig.findFirst({
        where: {
            id_skill_config: skill.payload.command
        }
    })
    return weapon_config_get
}

export async function Weapon_Create(context:any, skill: any) {
    const user_get: any = await Player_get(context.senderId)
    const weapon_config_get:any = await Weapon_Config_Get(skill)
    const weapon_create = await prisma.weapon.create({
        data:{
            id_user: user_get?.id,
            id_skill_config: skill.payload.command,
            id_damage_type: 1,
            lvl: randomInt(weapon_config_get?.lvl_req_min || 0, weapon_config_get?.lvl_req_max || 5),
            atk_min: weapon_config_get?.atk_min || 1,
            atk_max: randomInt(weapon_config_get?.atk_min+1, weapon_config_get?.atk_max || 5),
            hp: randomInt(weapon_config_get?.hp_min || 0, weapon_config_get?.hp_max || 5),
            name: skill.text
        }
    })
    await context.send(`Получено оружие: ${weapon_create.name}
                ⚔${weapon_create.atk_min}-${weapon_create.atk_max} 🔧${weapon_create.hp}`)
}