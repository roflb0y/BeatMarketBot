import { Markup } from "telegraf";

export async function pageButtons(page, type, beats) {
    return new Promise((resolve) => {
        let prev_button = "⏪";
        let prev_data = `page_${page - 1}_${type}`;
    
        let next_button = "⏩";
        let next_data = `page_${page + 1}_${type}`;
    
        if (page === 0) { prev_button = " "; prev_data = "none" };
        if (page + 1 === beats.length) { next_button = " "; next_data = "none" };

        const markup = Markup.inlineKeyboard([
            Markup.button.callback(prev_button, prev_data),
            Markup.button.callback(`${page + 1}/${beats.length}`, "none"),
            Markup.button.callback(next_button, next_data)
        ]);
    
        resolve(markup);
    });
}

export async function profileButtons(user) {
    return new Promise((resolve) => {
        const markup = Markup.inlineKeyboard([[
            Markup.button.callback("Изменить никнейм", "profile_set_nick", user.isVerified),
            Markup.button.callback("Изменить ссылку на соцсеть", "profile_set_media_link", user.isVerified),
        ], [
            Markup.button.callback("Подать заявку на верификацию", "verification_apply", user.isVerified)
        ]]);

        resolve(markup);
    })
}