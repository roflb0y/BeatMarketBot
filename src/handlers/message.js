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
            getBeat(ctx, 0, "recent");
            return;

        case "Случайный бит 🎲":
            const beat_index = await db.getRandomBeat();
            getBeat(ctx, beat_index, "recent");
            return;

        case "Мой профиль 💼":
            getProfile(ctx);
            return;
    }
});