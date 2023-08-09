import { bot } from "../bot.js";
import * as search from "../search/searchBeats.js";

// /^page/ типо когда колбек начинается на page это regex хдхдхдх
bot.action(/^page/, async ctx => {
    let zalupa, page, type;

    [zalupa, page, type] = ctx.callbackQuery.data.split("_");
    search.getBeat(ctx, Number(page), type);
})

bot.action("profile_set_nick", async ctx => {
    ctx.scene.enter("SET_NICK_SCENE");
})

bot.action("profile_set_media_link", async ctx => {
    ctx.scene.enter("SET_MEDIA_LINK_SCENE");
})