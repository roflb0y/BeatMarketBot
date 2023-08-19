import { bot } from "../bot.js";
import { Database } from "../database/database.js";
import * as keyboardMarkups from "../markups/keyboardMarkups.js";
import * as inlineMarkups from "../markups/inlineMarkups.js";

const db = new Database();

bot.start(async ctx => {
    await db.addUser(ctx);
    const user = await db.getUser(ctx.message.from.id);
    const mainButtons = await keyboardMarkups.mainButtons(user);

    ctx.reply("Привет! Добро пожаловать в BeatMarket!", mainButtons);
});