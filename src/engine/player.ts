import { PrismaClient } from "@prisma/client";
import { HearManager } from "@vk-io/hear";
import { randomInt } from "crypto";
import { Keyboard, KeyboardBuilder } from "vk-io";
import { IQuestionMessageContext } from "vk-io-question";
import { Player_get } from "./core/user";

const prisma = new PrismaClient()

export function registerUserRoutes(hearManager: HearManager<IQuestionMessageContext>): void {
	hearManager.hear(/удалиться/, async (context) => {
        const user_get: any = await Player_get(context.senderId)
        const player_delete = await prisma.user.delete({
            where: {
                id: user_get?.id
            }
        })
        context.send(`Успешно удалены ${user_get?.idvk}`)
    })
}