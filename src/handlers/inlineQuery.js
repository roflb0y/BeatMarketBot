import { bot } from "../bot.js";
import * as search from "../search/searchBeats.js";

// /^page/ типо когда колбек начинается на page это regex хдхдхдх
bot.action(/^page/, async ctx => {
    let zalupa, page, type;

    [zalupa, page, type] = ctx.callbackQuery.data.split("_");
    search.getBeat(ctx, Number(page), type);
})