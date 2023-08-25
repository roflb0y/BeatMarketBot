import { getBeat } from "../search/searchBeats.js";
import { Database } from "../database/database.js";
import * as utils from "../services/utils.js";
import * as inlineMarkups from "../markups/inlineMarkups.js";
import { getLang } from "../assets/getLang.js";

const db = new Database();

export async function getProfile(ctx) {
    const user = await db.getUser(ctx.message.from.id);
    const lang = await getLang(user.locale);

    const uploaded_beats = await db.getBeatsByUserCount(user);
    const verifStatus = user.isVerified ? "✅" : "❌";
    const joined_ago = utils.getTimeSince(user.join_date);
    const preparedPrices = utils.prepareString(user.prices);

    const inlineButtons = await inlineMarkups.profileButtons(user, lang);
    const replystr = `${lang.profile[0]}\n\n${lang.profile[1]} ${user.nickname}\n${lang.profile[2]} ${utils.prepareString(user.media_link)}\n${lang.profile[3]} ${verifStatus}\n${lang.profile[4]} ${uploaded_beats}\n\n${lang.profile[5]}\n${preparedPrices}\n\n${lang.profile[6]} ${joined_ago}`;

    ctx.replyWithMarkdownV2(replystr, inlineButtons);
}