import { Scenes } from 'telegraf';
import { Database } from '../database/database.js';
import * as keyboardMarkups from "../markups/keyboardMarkups.js";
import { getProfile } from '../search/profile.js';

const db = new Database(); 

export const setNickScene = new Scenes.WizardScene("SET_NICK_SCENE",
    async ctx => {
        ctx.reply("Отправьте новый ник", keyboardMarkups.cancelButton);
        ctx.wizard.next();
    },
    async ctx => {
        const user = await db.getUser(ctx.message.from.id);
        const mainButtons = await keyboardMarkups.mainButtons(user);
        if (ctx.message.text === "Отменить ❌") {
            ctx.reply("Отменено", mainButtons);
            ctx.scene.leave();
            return;
        }
        user.setNickname(ctx.message.text);

        ctx.reply("Никнейм изменен", mainButtons);
        getProfile(ctx);
        ctx.scene.leave();
    }
);