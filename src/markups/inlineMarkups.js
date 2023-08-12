import { Markup } from "telegraf";
import * as utils from "../services/utils.js";

export async function pageButtons(user, page, type, beat, beats) {
    return new Promise((resolve) => {
        let prev_button = "⏪";
        let prev_data = `page_${page - 1}_${type}`;
    
        let next_button = "⏩";
        let next_data = `page_${page + 1}_${type}`;
    
        if (page === 0) { prev_button = " "; prev_data = "none" };
        if (page + 1 === beats.length) { next_button = " "; next_data = "none" };

        const isLiked = beat.liked_by.includes(user.user_id) ? "❤" : "🖤";
        const likeCount = utils.parseLikes(beat.liked_by).length

        const markup = Markup.inlineKeyboard([[
            Markup.button.callback(prev_button, prev_data),
            Markup.button.callback(`${page + 1}/${beats.length}`, "none"),
            Markup.button.callback(next_button, next_data),
            Markup.button.callback("🔁", `refresh_${page}_${type}`)],
            [Markup.button.callback(`${isLiked} ${likeCount}`, `like_toggle_${page}_${type}`)],
            [Markup.button.callback("Удалить бит", `delete_beat_${beat.beat_id}`, !(user.user_id === beat.author_id || user.isAdmin))]
        ]);
    
        resolve(markup);
    });
};

export async function deleteBeatButtons(beat_id) {
    return new Promise((resolve) => {
        const markup = Markup.inlineKeyboard([
            Markup.button.callback("Удалить", `confirm_delete_beat_${beat_id}`),
            Markup.button.callback("Отмена", "delete_message")
        ]);

        resolve(markup);
    })
};

export async function profileButtons(user) {
    return new Promise((resolve) => {
        const markup = Markup.inlineKeyboard([[
            Markup.button.callback("Изменить никнейм", "profile_set_nick", (user.isVerified || user.haveApplied)),
            Markup.button.callback("Изменить ссылку на соцсеть", "profile_set_media_link", (user.isVerified || user.haveApplied)),
        ], [
            Markup.button.callback("Подать заявку на верификацию", "verification_apply", (user.isVerified || user.haveApplied))
        ]]);

        resolve(markup);
    })
};

export const verificationConfirmButtons = Markup.inlineKeyboard([
    Markup.button.callback("Подать заявку", "verification_apply_confirm"),
    Markup.button.callback("Отмена", "delete_message")
]);

export async function applicationCheckButtons(user_id) {
    return new Promise((resolve) => {
        const markup = Markup.inlineKeyboard([
            Markup.button.callback("Одобрить", `application_apply_${user_id}`),
            Markup.button.callback("Отклонить", `application_deny_${user_id}`)
        ]);

        resolve(markup);
    });
}

export const deleteMessageButton = Markup.inlineKeyboard([Markup.button.callback("Удалить это сообщение ❌", "delete_message")]);