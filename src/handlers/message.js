import { bot, globalLangConsts } from "../bot.js";
import { getBeat } from "../search/searchBeats.js";
import { getProfile } from "../search/profile.js";
import { Database } from "../database/database.js";
import { getLang } from "../assets/getLang.js";
import * as inlineMarkups from "../markups/inlineMarkups.js";

const db = new Database();

bot.on("text", async ctx => {
    if (globalLangConsts.upload_beat.includes(ctx.message.text)) {
        ctx.scene.enter("UPLOAD_BEAT_SCENE");
        return;
    }

    else if (globalLangConsts.recent_beats.includes(ctx.message.text)) {
        getBeat(ctx, ctx.message.from.id, 0, "recent");
        return;
    }

    else if (globalLangConsts.my_profile.includes(ctx.message.text)) {
        getProfile(ctx);
        return;
    }
        
    else if (globalLangConsts.random_beat.includes(ctx.message.text)) {
        const beat_index = await db.getRandomBeat();
        getBeat(ctx, ctx.message.from.id, beat_index, "recent");
        return;
    }

    else if (globalLangConsts.fav_beats.includes(ctx.message.text)) {
        const user = await db.getUser(ctx.message.from.id);
        const lang = await getLang(user.locale);

        if(user.liked.length === 0) { ctx.reply(lang.no_fav_beats, inlineMarkups.deleteMessageButton(lang)); return }
        getBeat(ctx, ctx.message.from.id, 0, "myLiked");
        return;
    }
});