import { bot } from "../bot.js"
import { getBeat } from "../search/searchBeats.js";

bot.on("text", ctx => {
    switch (ctx.message.text) {
        case "Загрузить бит 🎵":
            ctx.scene.enter("UPLOAD_BEAT_SCENE");
            return;
        
        case "Искать биты 🔍":
            getBeat(ctx, 0, "recent");
    }
});