import { Scenes } from 'telegraf';
import { Database } from '../database/database.js';
import * as keyboardMarkups from "../markups/keyboardMarkups.js";
import { getProfile } from '../search/profile.js';
import * as utils from "../services/utils.js";

const db = new Database();

export const setMediaLinkScene = new Scenes.WizardScene("SET_MEDIA_LINK_SCENE",
    async ctx => {
        ctx.reply("Отправь ссылку на свою страницу ВК, либо паблик ВК с возможностью связи через сообщения.", keyboardMarkups.cancelButton);
        ctx.wizard.next();
    },
    async ctx => {
        if (ctx.message.text === "Отменить ❌") {
            ctx.reply("Отменено", keyboardMarkups.mainButtons);
            ctx.scene.leave();
            return;
        }
        if (!utils.isValidUrl(ctx.message.text)) {
            ctx.reply("Отправь корректную ссылку")
            return;
        }
        const user = await db.getUser(ctx.message.from.id);
        user.setMediaLink(ctx.message.text);

        ctx.reply("Ссылка изменена", keyboardMarkups.mainButtons);
        getProfile(ctx);
        ctx.scene.leave();
    }
)