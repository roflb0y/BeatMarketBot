import { bot } from "../bot.js";
import * as search from "../search/searchBeats.js";
import * as inlineMarkups from "../markups/inlineMarkups.js";
import { Database } from "../database/database.js";
import * as application from "../services/application.js";

const db = new Database();

// /^page/ типо когда колбек начинается на page это regex хдхдхдх
bot.action(/^page/, async ctx => {
    let zalupa, page, type;

    [zalupa, page, type] = ctx.callbackQuery.data.split("_");
    search.getBeat(ctx, Number(page), type);
});

bot.action("profile_set_nick", async ctx => {
    ctx.scene.enter("SET_NICK_SCENE");
});

bot.action("profile_set_media_link", async ctx => {
    ctx.scene.enter("SET_MEDIA_LINK_SCENE");
});

bot.action("verification_apply", async ctx => {
    const user = await db.getUser(ctx.callbackQuery.from.id);
    
    if (user.media_link === null) { ctx.replyWithMarkdownV2("*Укажите ссылку на свою соцсеть чтобы подать заявку*", { reply_markup: inlineMarkups.deleteMessageButton.reply_markup }); return }

    if (user.haveApplied) { ctx.reply("Вы уже подали заявку на верификацию"); return }
    if (user.isVerified) { ctx.reply("Вы уже верифицированы"); return }
    ctx.replyWithMarkdownV2("*Вы действительно хотите подать заявку на верификацию?*\n\nПроверьте чтобы с Вами можно было связаться через указанную соцсеть\\.\n\nВы не сможете изменить данные своего профиля в случае одобрения заявки, и пока она рассматривается\\. Рассмотрение занимает от 2 минут до 24 часов\\.", inlineMarkups.verificationConfirmButtons)
});

bot.action("verification_apply_confirm", async ctx => {
    const user = await db.getUser(ctx.callbackQuery.from.id);
    user.setApplied(1);

    application.sendApplication(user);

    ctx.editMessageText("Заявка на верификацию отправлена ✅");
});

bot.action("delete_message", async ctx => {
    ctx.deleteMessage();
});