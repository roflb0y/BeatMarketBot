import { getBeat } from "../search/searchBeats.js";
import { Database } from "../database/database.js";
import * as utils from "../services/utils.js";
import * as inlineMarkups from "../markups/inlineMarkups.js";

const db = new Database();

export async function getProfile(ctx) {
    const user = await db.getUser(ctx.message.from.id);
    const uploaded_beats = await db.getBeatsByUserCount(user);

    const verifStatus = user.isVerified ? "✅" : "❌";
    const inlineButtons = await inlineMarkups.profileButtons(user);
    const joined_ago = utils.getTimeSince(user.join_date) + " назад";

    const replystr = `*💼 Ваш профиль:*\n\n*👩‍💻 Никнейм:* ${user.nickname}\n*🌏 Соцсеть:* ${utils.prepareString(user.media_link)}\n*🧭 Верификация:* ${verifStatus}\n*☁ Загружено битов:* ${uploaded_beats}\n\n*Первый запуск бота:* ${joined_ago}`;

    ctx.replyWithMarkdownV2(replystr, inlineButtons);
}