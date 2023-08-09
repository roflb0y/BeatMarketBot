import { bot } from "../bot.js";
import { Database } from "../database/database.js";
import * as keyboardMarkups from "../markups/keyboardMarkups.js";
import * as inlineMarkups from "../markups/inlineMarkups.js";

const db = new Database();

bot.start(ctx => {
    db.addUser(ctx);
    ctx.reply("привет", keyboardMarkups.mainButtons);
});