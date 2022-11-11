import { PrismaClient } from "@prisma/client"
import { Keyboard } from "vk-io"
import { prisma } from "../.."

export async function Gen_Inline_Button(context: any, weapon_type: any, mesa: string) {
    let checker = false
    let counter = 0
    let current = 0
    let modif = 0
    let skill:any = {}
    while (checker == false) {
        let keyboard = Keyboard.builder()
        counter = 0
        current = modif
        const limit = 6
        let weapon_list = ''
        while (current < weapon_type.length && counter < limit ) {
            keyboard.textButton({   label: weapon_type[current].label,
                                    payload: {  command: weapon_type[current]   },
                                    color: 'primary'
            })
            weapon_list += `${weapon_type[current].label} - ${weapon_type[current].description} \n`
            counter++
            current++
            if (counter%2 == 0) {
                keyboard.row()
            }
        }
        keyboard.row()
        .textButton({
            label: '<',
            payload: {
                command: "left"
            },
            color: 'primary'
        })
        .textButton({
            label: 'назад',
            payload: {
                command: 'back'
            },
            color: 'primary'
        })
        .textButton({
            label: '>',
            payload: {
                command: 'right'
            },
            color: 'primary'
        })
        skill = await context.question(`${mesa}\n${weapon_list}`,
                                            {
                                                keyboard: keyboard.inline()
                                            }
        )
        if (!skill.payload) {
            context.send('Жмите по inline кнопкам!')
        } else {
            if (skill.payload.command == 'back') {
                context.send('Вы нажали назад')
                modif = 0
                return false
            }
            if (skill.payload.command == 'left') {
                modif-limit >= 0 && modif < weapon_type.length ? modif-=limit : context.send('Позади ничего нет!')
                continue
            }
            if (skill.payload.command == 'right') {
                console.log('test ' + modif + ' total:' + weapon_type.length)
                modif+limit < weapon_type.length ? modif+=limit: context.send('Впереди ничего нет')
                continue
            }
            checker = true
            console.log("🚀 ~ file: button.ts ~ line 75 ~ Gen_Inline_Button ~ skill.payload.command", skill.payload.command)
            return skill.payload.command
        }
    }
}
