import { PrismaClient } from "@prisma/client"
import { randomInt } from "crypto"
import { Keyboard } from "vk-io"
import { Player_get } from "./user"

const prisma = new PrismaClient()

async function Armor_Config_Get(skill: any) {
    const weapon_config_get = await prisma.armorConfig.findFirst({
        where: {
            id_skill_config: skill.payload.command
        }
    })
    return weapon_config_get
}
async function Armor_Type_Get() {
    const weapon_config_get = await prisma.armorType.findMany()
    return weapon_config_get
}
export async function Armor_Create(context:any, skill: any) {
    const user_get: any = await Player_get(context.senderId)
    const weapon_config_get:any = await Armor_Config_Get(skill)
    console.log(user_get.id)
    const armor_type: any = await Armor_Type_Get()
    for (let i= 0; i < armor_type.length; i++) {
        const weapon_create = await prisma.armor.create({
            data:{
                id_user: user_get?.id,
                id_skill_config: skill.payload.command,
                id_damage_type: 1,
                id_armor_type: armor_type[i].id,
                lvl: randomInt(weapon_config_get?.lvl_req_min || 0, weapon_config_get?.lvl_req_max || 5),
                def_min: randomInt(weapon_config_get?.def_min || 0, weapon_config_get?.def_max || 5),
                def_max: randomInt(weapon_config_get?.def_min || 0, weapon_config_get?.def_max || 5),
                hp: randomInt(weapon_config_get?.hp_min || 0, weapon_config_get?.hp_max || 5),
                name: skill.text
            }
        })
        await context.send(`Получена броня: ${weapon_create.name} - ${armor_type[i].label}
        🛡${weapon_create.def_min}-${weapon_create.def_max} 🔧${weapon_create.hp}`)
    }
}