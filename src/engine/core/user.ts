import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function Player_get(idvk: number) {
    const user_get = await prisma.user.findFirst({
        where: {
            idvk: idvk
        }
    })
    return user_get
}
