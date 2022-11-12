import { PrismaClient } from "@prisma/client"
import { randomInt } from "crypto"
import { Keyboard } from "vk-io"
import { prisma } from "../.."
import { Detector_Health, Load, Player, random } from "./user";


export class NPC extends Player {
	public static async build(context: any): Promise<typeof instance>{
		const find_player: any = await prisma.userType.findFirst({where: {name: 'slime'}, include:{UserConfig: true}})
		const validator: any = await prisma.user.findFirst({
			where: 		{	idvk: context.senderId,
							id_user_config: find_player.UserConfig[0].id	}
		})
		if (!validator) {
			const user_create = await prisma.user.create({	
				data: 	{	id_user_config: find_player.UserConfig[0].id,
							idvk: context.senderId, 
							gold: find_player.UserConfig[0].gold + find_player.UserConfig[0].gold * await random(-find_player.UserConfig[0].gold_mod, find_player.UserConfig[0].gold_mod),
							nickname: 'Слизь'								
						}
			})
			const body_config = await prisma.bodyConfig.findMany({include:{skill_config: true}})
			for (const i in body_config) {
				const body_create = await prisma.body.create({
					data: {	id_user: user_create.id,
							id_body_config: body_config[i].id,
							atk_min: body_config[i].atk + body_config[i].atk * await random(-body_config[i].atk_mod, body_config[i].atk_mod),
							atk_max: body_config[i].atk + body_config[i].atk * await random(-body_config[i].atk_mod, body_config[i].atk_mod),
							def_min: body_config[i].def + body_config[i].def * await random(-body_config[i].def_mod, body_config[i].def_mod),
							def_max: body_config[i].def + body_config[i].def * await random(-body_config[i].def_mod, body_config[i].def_mod),
							health: body_config[i].health + body_config[i].health * await random(-body_config[i].health_mod, body_config[i].health_mod),
							name: body_config[i].skill_config.label
						}
				})
			}
			console.log(`Created npc for user ${user_create.idvk}`)
		}
		const data = await Load(context, 'slime')
		const instance = new NPC()
		instance.user = data.user
		instance.body = data.body
		instance.weapon = data.weapon
		instance.armor = data.armor
		instance.skill = data.skill
		instance.context = context
        instance.health = await Detector_Health(data.body)
		instance.health_max = await Detector_Health(data.body)
		instance.smile = {	'player': '🤖', 'npc': '👤', 'skill_up': '🦾'	}
		return instance
	}
    async Sync() {
		console.log(`Sync data for player: ${this.user.idvk}`)
		const data = await Load(this.context, 'slime')
		this.user = data.user
		this.body = data.body
		this.weapon = data.weapon
		this.armor = data.armor
		this.skill = data.skill
	}
}