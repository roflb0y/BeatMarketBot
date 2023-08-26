import { Scenes } from 'telegraf';
import { Database } from '../database/database.js';
import * as keyboardMarkups from "../markups/keyboardMarkups.js";
import { getProfile } from '../search/profile.js';
import * as utils from "../services/utils.js";
import { getLang } from '../assets/getLang.js';

const db = new Database();

export const setMediaLinkScene = new Scenes.WizardScene("SET_MEDIA_LINK_SCENE",
    async ctx => {
        ctx.reply("Отправь ссылку на любую свою соцсеть с возможностью связи через сообщения (например, паблик ВК)", keyboardMarkups.cancelButton);
        ctx.wizard.next();
    },
    async ctx => {
        if(ctx.callbackQuery) { return }

        const user = await db.getUser(ctx.message.from.id);
        const lang = await getLang(user.locale);
        const mainButtons = keyboardMarkups.mainButtons(user, lang);

        if (ctx.message.text === "Отменить ❌") {
            ctx.reply("Отменено", mainButtons);
            ctx.scene.leave();
            return;
        }
        if (!utils.isValidUrl(ctx.message.text)) {
            ctx.reply("Отправь корректную ссылку")
            return;
        }
        user.setMediaLink(ctx.message.text);

        ctx.reply("Ссылка изменена", mainButtons);
        getProfile(ctx);
        ctx.scene.leave();
    }
)