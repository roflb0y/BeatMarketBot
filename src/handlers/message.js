import { bot } from "../bot.js";
import { getBeat } from "../search/searchBeats.js";
import { getProfile } from "../search/profile.js";
import { Database } from "../database/database.js";
import { getGlobalConsts } from "../assets/getLang.js";
import * as inlineMarkups from "../markups/inlineMarkups.js";

const globalConsts = getGlobalConsts()
const db = new Database()

bot.on("text", async ctx => {
    if (globalConsts.upload_beat.includes(ctx.message.text)) {
        ctx.scene.enter("UPLOAD_BEAT_SCENE");
        return;
    }

    else if (globalConsts.recent_beats.includes(ctx.message.text)) {
        getBeat(ctx, ctx.message.from.id, 0, "recent");
        return;
    }

    else if (globalConsts.my_profile.includes(ctx.message.text)) {
        getProfile(ctx);
        return;
    }
        
    else if (globalConsts.random_beat.includes(ctx.message.text)) {
        const beat_index = await db.getRandomBeat();
        getBeat(ctx, ctx.message.from.id, beat_index, "recent");
        return;
    }

    else if (globalConsts.fav_beats.includes(ctx.message.text)) {
        const user = await db.getUser(ctx.message.from.id);
        if(user.liked.length === 0) { ctx.reply("Вы не лайкнули ни одного бита", inlineMarkups.deleteMessageButton); return }
        getBeat(ctx, ctx.message.from.id, 0, "myLiked");
        return;
    }

    else if (ctx.message.text === "Change language 📝") {
        const user = await db.getUser(ctx.message.from.id);
        const inlineButtons = await inlineMarkups.changeLangButtons(user, globalConsts);

        ctx.reply("Choose language", inlineButtons);
        return;
    }
});