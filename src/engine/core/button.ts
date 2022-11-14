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
        .textButton({   label: '<',
                        payload: { command: "left" },
                        color: 'primary'              })
        .textButton({   label: 'Стоп',
                        payload: { command: 'back' },
                        color: 'primary'              })
        .textButton({   label: '>',
                        payload: { command: 'right' },
                        color: 'primary'              })
        skill = await context.question(
            `${mesa}\n${weapon_list}`,
            { keyboard: keyboard.inline() }
        )
        if (!skill.payload) {
            context.send('Жмите по inline кнопкам!')
        } else {
            if (skill.payload.command == 'back') {
                context.send('Действие успешно отменено')
                modif = 0
                return false
            }
            if (skill.payload.command == 'left') {
                modif-limit >= 0 && modif < weapon_type.length ? modif-=limit : context.send('Позади ничего нет!')
                continue
            }
            if (skill.payload.command == 'right') {
                modif+limit < weapon_type.length ? modif+=limit: context.send('Впереди ничего нет')
                continue
            }
            checker = true
            return skill.payload.command
        }
    }
}
export async function Finder_Part_Info(id: any) {
    const data = await prisma.bodyConfig.findFirst({where: {id: id}})
    const found = await prisma.skillConfig.findFirst({where: {id: data?.id_skill_config}})
    return found?.label
}
export async function Gen_Inline_Button_Equipment(data: any, context: any, pattern: string) {
    let stopper = false
	let modif = 0
	const lim = 3 
    const configs: any = { 'armor_config': ['def_min', 'def_max'], 'weapon_config': ['atk_min', 'atk_max']}
    while (stopper == false) {
        let i = modif
        let counter = 0
        while (i < data.length && counter <lim) {
            let keyboard = Keyboard.builder()
            if (data[i].equip) {
                keyboard
                .textButton({ 	label: 'Снять',
                                payload: { command: `${i}` },
                                color: 'secondary'			   })
                .textButton({	label: 'Разобрать',
                                payload: { command: `${i}` },
                                color: 'secondary'			   })
                .oneTime().inline()
            } else {
                keyboard
                .textButton({ 	label: 'Надеть',
                                payload: { command: `${i}` },
                                color: 'secondary'			   })
                .textButton({	label: 'Разобрать',
                                payload: { command: `${i}` },
                                color: 'secondary'			   })
                .oneTime().inline()
            }
            context.question(`${data[i].name} 🛡${data[i][configs[pattern][0]].toFixed(2)} - ${data[i][configs[pattern][1]].toFixed(2)} 🔧${data[i].hp.toFixed(2)}  \n Применяется на части тела: ${await Finder_Part_Info(data[i].id_body_config)}`,
                { keyboard: keyboard }
            )
            counter++
            i++
        }
        
        const  push = await context.question('Быстрый доступ',
            { keyboard: Keyboard.builder()
                .textButton({   label: '<',
                                payload: { command: "left" },
                                color: 'primary'              })
                .textButton({   label: `${(modif+3)/3}/${Math.round(data.length/3)}`,
                                payload: { command: "left" },
                                color: 'primary'              })
                .textButton({   label: '>',
                                payload: { command: 'right' },
                                color: 'primary'              }).row()
                .textButton({   label: 'Назад',
                                payload: { command: 'back' },
                                color: 'primary'              })
                .textButton({   label: 'Закончить',
                                payload: { command: 'end' },
                                color: 'primary'              })
                
                .oneTime() }
        )
        if (push.payload) {
            if (push.text == 'Снять') {
                data[push.payload.command].equip = false
                await context.send(`Снято ${data[push.payload.command].name}`)
            }
            if (push.text == 'Надеть') {
                const checker = await Check_Equip(data, data[push.payload.command].id_body_config)
                if (!checker) { 
                    data[push.payload.command].equip = true
                    await context.send(`Надето ${data[push.payload.command].name}`)
                } else { await context.send(`На данную часть тела уже надето: ${checker}`) }
            }
            if (push.text == 'Назад') {
                return {cat_stop: false, data: data}
            }
            if (push.text == 'Закончить') {
                return {cat_stop: true, data: data}
            }
            if (push.text == '>') {
                if (modif+lim < data.length) {
                    modif += lim
                }
            }
            if (push.text == '<') {
                if (modif-lim >= 0) {
                    modif -= lim
                }
            }
        }
    }
}
export async function Check_Equip(data: any, id_body_config: number) {
	for (const i in data) {
		if (data[i].equip && data[i].id_body_config == id_body_config) {
			return data[i].name
		}
	}
}