import { PrismaClient } from "@prisma/client";
import { HearManager } from "@vk-io/hear";
import { randomInt } from "crypto";
import { Keyboard, KeyboardBuilder } from "vk-io";
import { IQuestionMessageContext } from "vk-io-question";
import { Player, Player_get } from "./core/user";
import { Battle_Init } from './core/battle';
import { prisma } from "..";


export function registerUserRoutes(hearManager: HearManager<IQuestionMessageContext>): void {
	hearManager.hear(/удалиться/, async (context) => {
        const player = await Player.build(context)
        console.log(JSON.stringify(player))
        const player_delete = await prisma.user.delete({
            where: {
                id: Player.user.id
            }
        })
        if (player_delete) {
            context.send(`Успешно удалены ${player_delete?.idvk}`)
        } else {
            context.send(`${JSON.stringify(player)}`)
        }
    })
    hearManager.hear(/битва/, async (context) => {
        await Battle_Init(context)
    })
}