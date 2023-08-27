import { Markup } from "telegraf";

export async function pageButtons(user, page, type, beat, beats, lang) {
    return new Promise(async (resolve) => {
        let prev_button = "⏪";
        let prev_data = `page_${page - 1}_${type}`;
    
        let next_button = "⏩";
        let next_data = `page_${page + 1}_${type}`;
    
        if (page === 0) { prev_button = " "; prev_data = "none" };
        if (page + 1 === beats.length) { next_button = " "; next_data = "none" };

        const likeCount = await beat.getLikesCount();
        const isLiked = user.liked.includes(beat.beat_id.toString()) ? "❤" : "🖤";

        const markup = Markup.inlineKeyboard([
            [Markup.button.callback(lang.beat_buttons[0], `contact_${beat.author_id}_${beat.beat_id}`, (user.user_id === beat.author_id))],
            [Markup.button.callback(prev_button, prev_data),
            Markup.button.callback(`${page + 1}/${beats.length}`, "none"),
            Markup.button.callback(next_button, next_data),
            Markup.button.callback("🔁", `refresh_${page}_${type}`)],
            [Markup.button.callback(`${isLiked} ${likeCount}`, `like_toggle_${page}_${type}`)],
            [Markup.button.callback(lang.beat_buttons[1], `delete_beat_${beat.beat_id}`, !(user.user_id === beat.author_id || user.isAdmin))]
        ]);
    
        resolve(markup);
    });
};

export const deleteBeatButtons = (beat_id, lang) => Markup.inlineKeyboard([
    Markup.button.callback(lang.basic_messages.delete, `confirm_delete_beat_${beat_id}`),
    Markup.button.callback(lang.basic_messages.cancel, "delete_message")
]);

export const profileButtons = (user, lang) => Markup.inlineKeyboard([
    [Markup.button.callback(lang.profileButtons.change_nickname, "profile_set_nick", (user.isVerified || user.haveApplied)),
    Markup.button.callback(lang.profileButtons.change_social, "profile_set_media_link", (user.isVerified || user.haveApplied))],

    [Markup.button.callback(lang.profileButtons.change_prices, "profile_set_prices")], 
    [Markup.button.callback(lang.profileButtons.apply_verification, "verification_apply", (user.isVerified || user.haveApplied))]
]);

export const verificationConfirmButtons = lang => Markup.inlineKeyboard([
    Markup.button.callback(lang.basic_messages.submit, "verification_apply_confirm"),
    Markup.button.callback(lang.basic_messages.cancel, "delete_message")
]);

export const contactConfirmButtons = (author_id, beat_id, lang) => Markup.inlineKeyboard([
    Markup.button.callback(lang.basic_messages.send_request, `confirm_contact_${author_id}_${beat_id}`),
    Markup.button.callback(lang.basic_messages.cancel, "delete_message")
]);

export const applicationCheckButtons = (user_id) => Markup.inlineKeyboard([
    Markup.button.callback("Одобрить", `application_apply_${user_id}`),
    Markup.button.callback("Отклонить", `application_deny_${user_id}`)
]);

export const denyVerificationReasons = (user_id) => Markup.inlineKeyboard([
    [Markup.button.callback("Некорректно введеные данные", `denyreasons_0_${user_id}`)],
    [Markup.button.callback("Невозможно связаться", `denyreasons_1_${user_id}`)],
    [Markup.button.callback("Нет ответа за 24 часа", `denyreasons_2_${user_id}`)]
]);


export const allowContactButtons = (user_id, lang) => Markup.inlineKeyboard([
    Markup.button.callback(lang.basic_messages.accept, `allow_contact_${user_id}`),
    Markup.button.callback(lang.basic_messages.deny, `deny_contact_${user_id}`)
]);

export async function changeLangButtons(user, globalConsts) {
    return new Promise((resolve) => {
        let buttons = []
        globalConsts.lang_name.forEach(item => { buttons.push([Markup.button.callback(item[1], `set_language_${item[0]}`)]) });

        resolve(Markup.inlineKeyboard(buttons));
    })
}

export const deleteMessageButton = lang => Markup.inlineKeyboard([Markup.button.callback(lang.basic_messages.delete_message, "delete_message")]);