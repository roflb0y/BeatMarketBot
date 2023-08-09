import { Markup } from "telegraf";

export async function mainButtons(user) {
    return new Promise((resolve) => {
        const mainButtons = Markup.keyboard([
            [Markup.button.text("Искать биты 🔍"), Markup.button.text("Мой профиль 💼")],
            [Markup.button.text("Случайный бит 🎲"), Markup.button.text("Лайкнутые ❤️")],
            [Markup.button.text("Загрузить бит 🎵", !user.isVerified)]
        ]).resize()
        
        resolve(mainButtons);
    });
};

export const cancelButton = Markup.keyboard(["Отменить ❌"]).resize()