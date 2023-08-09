import { Markup } from "telegraf";

export const mainButtons = Markup.keyboard([
    ["Искать биты 🔍", "Мой профиль 💼"],
    ["Случайный бит 🎲", "Лайкнутые ❤️"],
    ["Загрузить бит 🎵"]
]).resize()

export const cancelButton = Markup.keyboard(["Отменить ❌"]).resize()