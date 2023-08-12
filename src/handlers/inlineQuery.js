import { bot } from "../bot.js";
import * as search from "../search/searchBeats.js";
import * as inlineMarkups from "../markups/inlineMarkups.js";
import { Database } from "../database/database.js";
import * as application from "../services/application.js";
import * as utils from "../services/utils.js";

const db = new Database();

// /^page/ типо когда колбек начинается на page это regex хдхдхдх
bot.action(/^page/, async ctx => {
    let zalupa, page, type;

    [zalupa, page, type] = ctx.callbackQuery.data.split("_");
    search.getBeat(ctx, ctx.callbackQuery.from.id, Number(page), type);
});



bot.action("profile_set_nick", async ctx => {
    ctx.scene.enter("SET_NICK_SCENE");
});

bot.action("profile_set_media_link", async ctx => {
    ctx.scene.enter("SET_MEDIA_LINK_SCENE");
});


bot.action(/^delete_beat/, async ctx => {
    const user = await db.getUser(ctx.callbackQuery.from.id);
    const beat_id = ctx.callbackQuery.data.split("_").slice(-1)[0];
    const beat = await db.getBeat(beat_id);

    if (beat === false) return;
    if (!(beat.author_id === ctx.callbackQuery.from.id.toString()) && !user.isAdmin) return;

    const inlineButtons = await inlineMarkups.deleteBeatButtons(beat_id);
    ctx.replyWithMarkdownV2("*Вы действительно хотите удалить этот бит?*", inlineButtons);
});

bot.action(/^confirm_delete_beat_/, async ctx => {
    const user = await db.getUser(ctx.callbackQuery.from.id);
    const beat_id = ctx.callbackQuery.data.split("_").slice(-1)[0];
    const beat = await db.getBeat(beat_id);

    if (!(beat.author_id === ctx.callbackQuery.from.id.toString()) && !user.isAdmin) return;

    const beat_filepath = `./beats/b${beat_id}.m4a`;
    beat.deleteBeat(beat_filepath);
    utils.deleteBeat(beat_filepath);

    ctx.deleteMessage();
    ctx.replyWithMarkdownV2(`*Бит "${beat.title}" удален*`, inlineMarkups.deleteMessageButton);
});


bot.action(/^refresh_/, async ctx => {
    let beat_page, search_type;
    [beat_page, search_type] = ctx.callbackQuery.data.split("_").slice(-2);
    beat_page = Number(beat_page);
    
    search.updateBeatMessage(ctx, ctx.callbackQuery.from.id, beat_page, search_type);
    ctx.answerCbQuery();
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


bot.action(/^like_toggle_/, async ctx => {
    let beat_page, search_type;
    [beat_page, search_type] = ctx.callbackQuery.data.split("_").slice(-2);
    beat_page = Number(beat_page);

    const user = await db.getUser(ctx.callbackQuery.from.id);
    const beats = await db.getBeats(search_type, user);
    const beat = beats[beat_page];

    await user.toggleLike(beat);

    if(beat_page + 1 === beats.length && search_type === "myLiked") beat_page--;

    if(beats.length === 1) {
        ctx.deleteMessage();
        ctx.reply("Вы не лайкнули ни одного бита", inlineMarkups.deleteMessageButton);
        return;
    }

    search.updateBeatMessage(ctx, ctx.callbackQuery.from.id, beat_page, search_type);
    ctx.answerCbQuery();
});


bot.action("delete_message", async ctx => {
    ctx.deleteMessage();
});