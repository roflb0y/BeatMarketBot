import { bot } from "../bot.js";
import { Database } from "../database/database.js";
import * as keyboardMarkups from "../markups/keyboardMarkups.js";
import * as inlineMarkups from "../markups/inlineMarkups.js";
import { getLang } from "../assets/getLang.js";

const db = new Database();

bot.start(async ctx => {
    await db.addUser(ctx);
    const user = await db.getUser(ctx.message.from.id);
    const lang = await getLang(user.locale);

    const mainButtons = keyboardMarkups.mainButtons(user, lang);

    ctx.reply(lang.startMessage, mainButtons);
});