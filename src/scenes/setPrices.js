import { Scenes } from 'telegraf';
import { Database } from '../database/database.js';
import * as keyboardMarkups from "../markups/keyboardMarkups.js";
import { getProfile } from '../search/profile.js';
import { getLang } from '../assets/getLang.js';

const db = new Database(); 

export const setPricesScene = new Scenes.WizardScene("SET_PRICES_SCENE",
    async ctx => {
        ctx.reply("Отправьте цены на свои биты в таком виде:\n\nЛизинг - 500 RUB\nПолные права - 1000 RUB\nЭксклюзив - 1500 RUB", keyboardMarkups.cancelButton);
        ctx.wizard.next();
    },
    async ctx => {
        if(ctx.callbackQuery) { return }

        const user = await db.getUser(ctx.message.from.id);
        const lang = await getLang(user.locale);
        const mainButtons = await keyboardMarkups.mainButtons(user, lang);
        if (ctx.message.text === "Отменить ❌") {
            ctx.reply("Отменено", mainButtons);
            ctx.scene.leave();
            return;
        }
        user.setPrices(ctx.message.text);

        ctx.reply("Цены изменены", mainButtons);
        getProfile(ctx);
        ctx.scene.leave();
    }
);