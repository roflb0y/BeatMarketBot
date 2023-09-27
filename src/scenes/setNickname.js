import { Scenes } from 'telegraf';
import { globalLangConsts } from '../bot.js';
import { Database } from '../database/database.js';
import * as keyboardMarkups from "../markups/keyboardMarkups.js";
import { getProfile } from '../search/profile.js';
import { getLang } from '../assets/getLang.js';

const db = new Database(); 

export const setNickScene = new Scenes.WizardScene("SET_NICK_SCENE",
    async ctx => {
        ctx.reply("Отправьте новый ник", keyboardMarkups.cancelButton);
        ctx.wizard.next();
    },
    async ctx => {
        if(ctx.callbackQuery) { return }
        
        const user = await db.getUser(ctx.message.from.id);
        const lang = await getLang(user.locale);
        const mainButtons = keyboardMarkups.mainButtons(user, lang);

        if (globalLangConsts.cancel.includes(ctx.message.text)) {
            ctx.reply(lang.basic_messages.cancelled, mainButtons);
            ctx.scene.leave();
            return;
        }
        user.setNickname(ctx.message.text);

        ctx.reply("Никнейм изменен", mainButtons);
        getProfile(ctx);
        ctx.scene.leave();
    }
);