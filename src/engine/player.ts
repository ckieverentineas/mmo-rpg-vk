import { PrismaClient } from "@prisma/client";
import { HearManager } from "@vk-io/hear";
import { randomInt } from "crypto";
import { Keyboard, KeyboardBuilder } from "vk-io";
import { IQuestionMessageContext } from "vk-io-question";

const prisma = new PrismaClient()

export function registerUserRoutes(hearManager: HearManager<IQuestionMessageContext>): void {
	hearManager.hear(/бу/, async (context) => {
        const data = [
            {label: "Петя", name: "peta1"},
            {label: "Петя", name: "peta2"},
            {label: "Петя", name: "peta3"},
            {label: "Петя", name: "peta4"},
            {label: "Петя", name: "peta5"},
            {label: "Петя", name: "peta6"},
            {label: "Петя", name: "peta7"},
            {label: "Петя", name: "peta8"},
            {label: "Петя", name: "peta9"},
            {label: "Петя", name: "peta10"},
        ]
        let i = 0
        let limit = 6
        for(i; i< limit; i++) {
            console.log(data[i].name)
        }
    })
}