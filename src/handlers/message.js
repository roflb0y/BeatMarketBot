import { bot } from "../bot.js";
import { getBeat } from "../search/searchBeats.js";
import { getProfile } from "../search/profile.js";
import { Database } from "../database/database.js";
import * as utils from "../services/utils.js";
import * as inlineMarkups from "../markups/inlineMarkups.js";

const db = new Database()

bot.on("text", async ctx => {
    switch (ctx.message.text) {
        case "Загрузить бит 🎵":
            ctx.scene.enter("UPLOAD_BEAT_SCENE");
            return;
        
        case "Искать биты 🔍":
            getBeat(ctx, ctx.message.from.id, 0, "recent");
            return;

        case "Случайный бит 🎲":
            const beat_index = await db.getRandomBeat();
            getBeat(ctx, ctx.message.from.id, beat_index, "recent");
            return;

        case "Лайкнутые ❤️":
            const user = await db.getUser(ctx.message.from.id);
            if(user.liked.length === 0) { ctx.reply("Вы не лайкнули ни одного бита", inlineMarkups.deleteMessageButton); return }
            getBeat(ctx, ctx.message.from.id, 0, "myLiked");
            return;

        case "Мой профиль 💼":
            getProfile(ctx);
            return;
    }
});