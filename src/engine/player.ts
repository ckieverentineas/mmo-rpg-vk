import { PrismaClient } from "@prisma/client";
import { HearManager } from "@vk-io/hear";
import { randomInt } from "crypto";
import { Keyboard, KeyboardBuilder } from "vk-io";
import { IQuestionMessageContext } from "vk-io-question";
import { prisma } from "..";
import { Player } from "./core/user";
import { NPC } from "./core/npc";

const event: string[] = []
export function registerUserRoutes(hearManager: HearManager<IQuestionMessageContext>): void {

    hearManager.hear(/битва/, async (context) => {
        const player = await Player.build(context)
        const npc = await NPC.build(context)
        await npc.Detector()
        await npc.Sync()
        await npc.Save()
        while (player._health > 0 && npc._health > 0) {
            const turn = await context.question(`
                    ${await player.Print()}\n ${await npc.Print()}
                `,{ keyboard: Keyboard.builder()
                    .textButton({   label: 'Атака',
                                    payload: {  command: 'attack'   },
                                    color: 'secondary'                  }).row()
                    .textButton({   label: 'Отмена',
                                    payload: {  command: 'back' },
                                    color: 'secondary'
                                                                        }).oneTime() }
            )
            if (turn) {
                const atk_player = await player.Attack()
                await npc.Defense(atk_player)
                const atk_npc = await npc.Attack()
                await player.Defense(atk_npc)
            }
        }
        await player.Save()
        await npc.Save()
    })
    hearManager.hear(/pvp/, async (context) => {
        const init_fight = await context.question(`
                Готовы к пвп? Жмите Приступить!`,
            {
                keyboard: Keyboard.builder()
                .textButton({   label: 'Начать',
                                payload: {  command: 'pvp'  },
                                color: 'secondary'              }).row()
                .textButton({   label: 'Отмена',
                                payload: {  command: 'back' },
                                color: 'secondary'              }).oneTime()
            }
        )
        const config: any = {    'pvp':  PVP_Init,
                            'back': Back        }
        config[init_fight.payload.command](context)
        async function Back(context: any) {
            
        }
        async function PVP_Init(context: any) {
            const player = await Player.build(context)
            const npc = await NPC.build(context)
            let fight_end = false
            while (fight_end == false) {
                const turn = await context.question(`
                        ${await player.Print()}`,
                    {
                        keyboard: Keyboard.builder()
                        .textButton({   label: 'Атака',
                                        payload: {  command: 'attack'   },
                                        color: 'secondary'                  }).row()
                        .textButton({   label: 'Отмена',
                                        payload: {  command: 'back' },
                                        color: 'secondary'
                                                                            }).oneTime()
                    }
                )
                if (turn) {
                    event.push(`${context.senderId} did attack`)
                    const test = await player.Attack()
                    await player.Defense(test)
                    context.send(`${await npc.Print()}`)
                }
                player.Save()
            }
            
        }
    })
    hearManager.hear(/крафт/, async (context) => { 
        const player = await Player.build(context)
        await player.Craft()
    })
    hearManager.hear(/инвентарь/, async (context) => { 
        const player = await Player.build(context)
        await player.Inventory()
        await player.Save()
    })
}