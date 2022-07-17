import { PrismaClient } from "@prisma/client"
import { randomInt } from "crypto"
import { Keyboard } from "vk-io"
import { Player_get } from "./user"

const prisma = new PrismaClient()

export async function Battle_Init(context: any) {
    /*const battle_init = await prisma.battleRegistrator.create({
        data: {
            id_battle_type: 1,
        }
    })
    console.log((battle_init))*/

    const npc_config_get = await prisma.userConfig.findFirst({})
    const npc_create = {
        idvk: 0,
        gold: randomInt(npc_config_get?.gold_min||5, npc_config_get?.gold_max||10),
        hp: randomInt(npc_config_get?.hp_min||5, npc_config_get?.hp_max||10),
        id_user_type: 2
    }

    const weapon_config_get: any = await prisma.weaponConfig.findFirst({
        where: {
            id_skill_config: 1
        }
    })
    const npc_weapon = {
        id_skill_config: 1,
        id_damage_type: 1,
        lvl: randomInt(weapon_config_get?.lvl_req_min || 0, weapon_config_get?.lvl_req_max || 5),
        atk_min: weapon_config_get?.atk_min,
        atk_max: randomInt(weapon_config_get?.atk_min+1 || 0, weapon_config_get?.atk_max || 5),
        hp: randomInt(weapon_config_get?.hp_min || 0, weapon_config_get?.hp_max || 5),
    }

    const player_avatar_load: any = await prisma.user.findFirst({
        where: {
            idvk: context.senderId
        }
    })
    const player_weapon_load: any = await prisma.weapon.findFirst({
        where: {
            id_user: player_avatar_load?.id
        }
    })
    const player_armor:any = await prisma.armor.findMany({
        where: {
            id_user: player_avatar_load.id
        }
    })
    context.send(`Вы: ❤${player_avatar_load?.hp} ⚔${player_weapon_load?.atk_min}-${player_weapon_load?.atk_max} 🔧${player_weapon_load?.hp}`)
    while (npc_create.hp > 0 && player_avatar_load.hp > 0) {
        const battle = await context.question(`
                NPC: ❤${npc_create.hp} ⚔${npc_weapon.atk_min}-${npc_weapon.atk_max} 🔧${npc_weapon.hp}
            `,
            {
                keyboard: Keyboard.builder()
                .textButton({
                    label: 'Атака',
                    payload: {
                        command: 'attack'
                    },
                    color: 'secondary'
                })
                .row()
                .textButton({
                    label: 'убежать',
                    payload: {
                        command: 'Отказаться'
                    },
                    color: 'secondary'
                }).oneTime()
            }
        )
        if (battle.payload.command == "attack") {
            const dmg = randomInt(player_weapon_load?.atk_min, player_weapon_load?.atk_max) 
            npc_create.hp = npc_create.hp - dmg
            context.send(`Вы нанесли 💥${dmg}`)
            
            const armor_type = randomInt(1, 7)
            const mob_dmg = randomInt(npc_weapon.atk_min, npc_weapon.atk_max)*(1-randomInt(player_armor[`${armor_type}`][`def_min`], player_armor[`${armor_type}`][`def_max`])/100)
            player_avatar_load.hp = player_avatar_load.hp - mob_dmg
            context.send(`NPC нанес 💥${mob_dmg.toFixed(2)}`)
            context.send(`Вы: ❤${player_avatar_load?.hp.toFixed(2)} ⚔${player_weapon_load?.atk_min}-${player_weapon_load?.atk_max} 🔧${player_weapon_load?.hp}`)
        }
    }
    context.send(`Вы победили`)
    
}