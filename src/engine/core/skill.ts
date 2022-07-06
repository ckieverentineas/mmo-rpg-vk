import { PrismaClient } from "@prisma/client"
import { Player_get } from "./user"

const prisma = new PrismaClient()

export async function Skill_Create(context: any, skill: any) {
    const user_get: any = await Player_get(context.senderId)
    const skill_create = await prisma.skill.create({
        data: {
            id_user: user_get?.id,
            id_skill_config: skill.payload.command,
            lvl: 0,
            xp: 0
        }
    })
    context.send(`🏴‍☠Получен новый скилл: ${skill.text}`)
}