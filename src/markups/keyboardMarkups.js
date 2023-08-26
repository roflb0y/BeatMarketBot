import { Markup } from "telegraf";

export const mainButtons = (user, lang) => Markup.keyboard([
    [Markup.button.text(lang.mainButtons.recent_beats), Markup.button.text(lang.mainButtons.my_profile)],
    [Markup.button.text(lang.mainButtons.random_beat), Markup.button.text(lang.mainButtons.fav_beats)],
    [Markup.button.text(lang.mainButtons.change_lang)],
    [Markup.button.text(lang.mainButtons.upload_beat, !user.isVerified)]
]).resize()

export const cancelButton = Markup.keyboard(["Отменить ❌"]).resize()