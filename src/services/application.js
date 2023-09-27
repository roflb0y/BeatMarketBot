import { Database } from "../database/database.js";
import { bot } from "../bot.js";
import * as utils from "../services/utils.js";
import * as inlineMarkups from "../markups/inlineMarkups.js";
import * as keyboardMarkups from "../markups/keyboardMarkups.js";
import * as actionReasons from "../assets/actionReasons.js";
import { getLang } from "../assets/getLang.js";

const db = new Database();

export async function sendApplication(user) {
    const admins = await db.getAdmins();

    const msg = `*Новая заявка на верификацию*\n\n*Айди телеграма:* ${user.user_id}\n*Никнейм:* ${user.nickname}\n*Соцсеть:* ${utils.prepareString(user.media_link)}`;
    const inlineButtons = inlineMarkups.applicationCheckButtons(user.user_id);

    admins.forEach(user => {
        bot.telegram.sendMessage(user.user_id, msg, { parse_mode: "MarkdownV2", reply_markup: inlineButtons.reply_markup });
    });
};

bot.action(/^application_/, async ctx => {
    let zalupa, action, user_id;
    [zalupa, action, user_id] = ctx.callbackQuery.data.split("_");

    const user = await db.getUser(user_id);
    const lang = await getLang(user.locale);

    if (!user.haveApplied) { ctx.editMessageText(`Заявка уже была рассмотрена другим модератором\nСтатус верификации пользователя ${user.nickname}: ${user.isVerified}`, inlineMarkups.deleteMessageButton(lang)); return }

    if (action === "apply") {
        ctx.editMessageText(`✅ Заявка пользователя ${user.nickname} одобрена`);

        user.setApplied(0);
        user.setVerified(1);

        const mainButtons = keyboardMarkups.mainButtons(user, lang);
        bot.telegram.sendMessage(user_id, "✅ Ваша заявка на верификацию одобрена\n\nЖелаем успешных продаж в BeatMarket!", mainButtons);
        return;
    }

    if (action === "deny") {
        const inlineButtons = inlineMarkups.denyVerificationReasons(user_id);
        ctx.editMessageText(`Выберите причину отклонения заявки`, inlineButtons);

        return;
    }
});

bot.action(/^denyreasons_/, async ctx => {
    let zalupa, reasonId, user_id;
    [zalupa, reasonId, user_id] = ctx.callbackQuery.data.split("_");

    const denyReason = actionReasons.applicationDenyReason(reasonId);
    const user = await db.getUser(user_id)

    ctx.editMessageText(`❌ Заявка пользователя ${user.nickname} отклонена по причине:\n\n${denyReason}`);
    ctx.telegram.sendMessage(user.user_id, `❌ Ваша заявка на верификацию была отклонена. \n\nПричина: ${denyReason}`);

    user.setApplied(0);
})