import { PrismaClient } from "@prisma/client"
import { randomInt } from "crypto"
import { Keyboard } from "vk-io"
import { NPC_armor_create, NPC_create, NPC_weapon_create } from "./npc"
import { Player_get } from "./user"

const prisma = new PrismaClient()

export async function Battle_Init(context: any) {
    /*const battle_init = await prisma.battleRegistrator.create({
        data: {
            id_battle_type: 1,
        }
    })
    console.log((battle_init))*/

    const npc_create = await NPC_create()

    const npc_weapon = await NPC_weapon_create()

    const npc_armor = await NPC_armor_create()

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
    const armor_type: any = await prisma.armorType.findMany()
    while (npc_create.hp > 0 && player_avatar_load.hp > 0) {
        const battle = await context.question(`
                NPC: ❤${npc_create.hp.toFixed(2)} ⚔${npc_weapon.atk_min}-${npc_weapon.atk_max} 🔧${npc_weapon.hp}
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
            const armor_type_mob = randomInt(1, 7)
            const dmg = randomInt(player_weapon_load?.atk_min, player_weapon_load?.atk_max)*(1-randomInt(npc_armor[`${armor_type_mob}`][`def_min`], npc_armor[`${armor_type_mob}`][`def_max`])/100)
            npc_create.hp = npc_create.hp - dmg
            context.send(`Вы нанесли 💥${dmg.toFixed(2)} по 🛡${armor_type[armor_type_mob].label}`)
            player_weapon_load.hp--
            npc_armor[`${armor_type_mob}`].hp--
            
            const armor_type_player = randomInt(1, 7)
            const mob_dmg = randomInt(npc_weapon.atk_min, npc_weapon.atk_max)*(1-randomInt(player_armor[`${armor_type_player}`][`def_min`], player_armor[`${armor_type_player}`][`def_max`])/100)
            player_avatar_load.hp = player_avatar_load.hp - mob_dmg
            context.send(`NPC нанес 💥${mob_dmg.toFixed(2)} по 🛡${armor_type[armor_type_player].label}`)
            npc_weapon.hp--
            player_armor[`${armor_type_mob}`].hp--
            context.send(`Вы: ❤${player_avatar_load?.hp.toFixed(2)} ⚔${player_weapon_load?.atk_min}-${player_weapon_load?.atk_max} 🔧${player_weapon_load?.hp}`)
        }
    }
    context.send(`Вы победили`)
    
}