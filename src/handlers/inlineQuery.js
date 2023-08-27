import { bot } from "../bot.js";
import * as search from "../search/searchBeats.js";
import * as inlineMarkups from "../markups/inlineMarkups.js";
import * as keyboardMarkups from "../markups/keyboardMarkups.js";
import { Database } from "../database/database.js";
import * as application from "../services/application.js";
import * as utils from "../services/utils.js";
import { getLang } from "../assets/getLang.js";

const db = new Database();

// /^page/ типо когда колбек начинается на page это regex хдхдхдх
bot.action(/^page/, async ctx => {
    let zalupa, page, type;

    [zalupa, page, type] = ctx.callbackQuery.data.split("_");
    search.getBeat(ctx, ctx.callbackQuery.from.id, Number(page), type);
});



bot.action("profile_set_nick", async ctx => {
    ctx.scene.enter("SET_NICK_SCENE");
    ctx.answerCbQuery();
});

bot.action("profile_set_media_link", async ctx => {
    ctx.scene.enter("SET_MEDIA_LINK_SCENE");
    ctx.answerCbQuery();
});

bot.action("profile_set_prices", async ctx => {
    ctx.scene.enter("SET_PRICES_SCENE");
    ctx.answerCbQuery();
});


bot.action(/^delete_beat/, async ctx => {
    const user = await db.getUser(ctx.callbackQuery.from.id);
    const lang = await getLang(user.locale);

    const beat_id = ctx.callbackQuery.data.split("_").slice(-1)[0];
    const beat = await db.getBeat(beat_id);

    if (beat === false) return;
    if (!(beat.author_id === ctx.callbackQuery.from.id.toString()) && !user.isAdmin) return;

    const inlineButtons = await inlineMarkups.deleteBeatButtons(beat_id, lang);
    ctx.replyWithMarkdownV2(lang.basic_messages.delete_beat_confirmation, inlineButtons);
});

bot.action(/^confirm_delete_beat_/, async ctx => {
    const user = await db.getUser(ctx.callbackQuery.from.id);
    const lang = getLang(user.locale);

    const beat_id = ctx.callbackQuery.data.split("_").slice(-1)[0];
    const beat = await db.getBeat(beat_id);

    if (!(beat.author_id === ctx.callbackQuery.from.id.toString()) && !user.isAdmin) return;

    const beat_filepath = `./beats/b${beat_id}.m4a`;
    beat.deleteBeat(beat_filepath);
    utils.deleteBeat(beat_filepath);

    ctx.deleteMessage();
    ctx.replyWithMarkdownV2(`${lang.beat_deleted} ${beat.title}`, inlineMarkups.deleteMessageButton(lang));
});

bot.action(/^contact_/, async ctx => {
    let author_id, beat_id;
    [author_id, beat_id] = ctx.callbackQuery.data.split("_").slice(-2);
    
    const user = await db.getUser(ctx.callbackQuery.from.id);
    const lang = await getLang(user.locale)
    const inlineButtons = inlineMarkups.contactConfirmButtons(author_id, beat_id, lang);

    ctx.reply("Вы уверены что хотите отправить битмейкеру запрос на переписку?", inlineButtons);
});

bot.action(/^confirm_contact_/, async ctx => {
    let author_id, beat_id;

    const user = await db.getUser(ctx.callbackQuery.from.id);
    const lang = await getLang(user.locale);

    [author_id, beat_id] = ctx.callbackQuery.data.split("_").slice(-2);
    const inlineButtons = inlineMarkups.allowContactButtons(ctx.callbackQuery.from.id, lang);

    const beat = await db.getBeat(beat_id);

    ctx.sendMessage(`Новый запрос на переписку от ${user.nickname}\n\nПользователь заинтересовался следующим битом:\n*${utils.prepareString(beat.title)}*`, { chat_id: author_id, parse_mode: "MarkdownV2", reply_markup: inlineButtons.reply_markup })
    .then(() => {
        ctx.editMessageText(`✅ *Запрос на переписку отправлен\\. Ожидайте ответа от битмейкера\\.*`, { parse_mode: "MarkdownV2" });
    })
    .catch(() => {
        ctx.editMessageText(`❌ *Не удалось отправить запрос на переписку так как бот был заблокирован битмейкером*`, { parse_mode: "MarkdownV2" });
    })
})

bot.action(/^allow_contact_/, async ctx => {
    const user_id = ctx.callbackQuery.data.split("_").slice(-1)[0];
    const user = await db.getUser(user_id);
    const lang = await getLang(user.locale);

    if (ctx.callbackQuery.from.username === undefined) {
        ctx.reply("Укажите юзернейм в своем аккаунте Телеграма чтобы пользователь смог с вами связаться.", inlineMarkups.deleteMessageButton(lang));
        return;
    }
    
    const author = await db.getUser(ctx.callbackQuery.from.id);

    ctx.editMessageText(`Вы приняли запрос на переписку. Ваш аккаунт отправлен пользователю ${user.nickname}. Скоро он должен с вами связаться.`, ctx.chat.id, ctx.callbackQuery.message.id)
    ctx.sendMessage(`✅ *Битмейкер ${author.nickname} принял запрос на переписку\\.*\n\n@${ctx.callbackQuery.from.username}\n\nОтправьте ему приветственное сообщение и перешлите сообщение с интересующим вас битом`, { chat_id: user_id, parse_mode: "MarkdownV2" })
});

bot.action(/^deny_contact_/, async ctx => {
    const user_id = ctx.callbackQuery.data.split("_").slice(-1)[0];
    const user = await db.getUser(user_id);
    const author = await db.getUser(ctx.callbackQuery.from.id);

    ctx.editMessageText(`Вы отклонили запрос на переписку с ${user.nickname}.`, ctx.chat.id, ctx.callbackQuery.message.id);
    ctx.sendMessage(`❌ *Битмейкер ${author.nickname} отклонил ваш запрос на переписку\\.*`, { chat_id: user_id, parse_mode: "MarkdownV2" });
})


bot.action(/^refresh_/, async ctx => {
    let beat_page, search_type;
    [beat_page, search_type] = ctx.callbackQuery.data.split("_").slice(-2);
    beat_page = Number(beat_page);
    
    search.updateBeatMessage(ctx, ctx.callbackQuery.from.id, beat_page, search_type);
    ctx.answerCbQuery();
});


bot.action("verification_apply", async ctx => {
    const user = await db.getUser(ctx.callbackQuery.from.id);
    const lang = await getLang(user.locale);
    
    if (user.media_link === null) { ctx.replyWithMarkdownV2("*Укажите ссылку на свою соцсеть чтобы подать заявку*", { reply_markup: inlineMarkups.deleteMessageButton(lang).reply_markup }); return }

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
    const lang = await getLang(user.locale);

    const beats = await db.getBeats(search_type, user);
    const beat = beats[beat_page];

    await user.toggleLike(beat);

    if(beat_page + 1 === beats.length && search_type === "myLiked") beat_page--;

    if(beats.length === 1) {
        ctx.deleteMessage();
        ctx.reply(lang.no_fav_beats, inlineMarkups.deleteMessageButton(lang));
        return;
    }

    search.updateBeatMessage(ctx, ctx.callbackQuery.from.id, beat_page, search_type);
    ctx.answerCbQuery();
});

bot.action(/^set_language_/, async ctx => {
    const newLocale = ctx.callbackQuery.data.split("_").slice(-1)[0];
    const user = await db.getUser(ctx.callbackQuery.from.id);

    await user.setLocale(newLocale);

    const lang = await getLang(newLocale);
    const mainButtons = keyboardMarkups.mainButtons(user, lang);

    ctx.deleteMessage();
    ctx.reply(lang.languageset, mainButtons);
})


bot.action("delete_message", async ctx => {
    ctx.deleteMessage();
});