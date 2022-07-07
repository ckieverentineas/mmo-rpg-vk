import { PrismaClient } from "@prisma/client"
import { randomInt } from "crypto"

const prisma = new PrismaClient()

export async function Player_get(idvk: number) {
    const user_get = await prisma.user.findFirst({
        where: {
            idvk: idvk
        }
    })
    return user_get
}
export async function Player_register(context:any) {
    //регистрация пользователя
		const user_config_get = await prisma.userConfig.findFirst({})
		const user_create = await prisma.user.create({
			data: {
				idvk: context.senderId,
				gold: randomInt(user_config_get?.gold_min||5, user_config_get?.gold_max||10),
				hp: randomInt(user_config_get?.hp_min||5, user_config_get?.hp_max||10),
				id_user_type: 1
			}
		})
        context.send(`Получено золота: ${user_create.gold}
            Ваше здоровье: ${user_create.hp}`)
		console.log(`Created account for user ${user_create.idvk}`)
}
