import { Scenes } from 'telegraf';
import * as keyboardMarkups from "../markups/keyboardMarkups.js";
import * as processBeat from '../services/processBeat.js';
import { Database } from "../database/database.js";
import { getBeat } from '../search/searchBeats.js';
import * as utils from "../services/utils.js";

const db = new Database(); 

export const uploadBeatScene = new Scenes.WizardScene("UPLOAD_BEAT_SCENE", //што это за хуйня где мой fsm я куда попал
    async ctx => {
        const user = await db.getUser(ctx.message.from.id);
        if (!user.isVerified) { ctx.scene.leave(); return; };

        ctx.reply("Отправь бит в формате MP3. Размер файла не должен превышать 20MB", keyboardMarkups.cancelButton);
        ctx.wizard.next();
    },

    //скячивание бита)))
    async ctx => {
        const user = await db.getUser(ctx.message.from.id);
        const mainButtons = await keyboardMarkups.mainButtons(user);

        if(ctx.message.text === "Отменить ❌") {
            ctx.reply("Загрузка бита отменена", mainButtons);
            ctx.scene.leave();
            return;
        }

        if (!(ctx.message.audio && ctx.message.audio.mime_type === "audio/mpeg")) { ctx.reply("Пришли аудио в формате MP3"); return }; 
        if (ctx.message.audio.file_size >= 20971520) { ctx.reply("Размер файла не должен превышать 20MB"); return };

        ctx.wizard.state.file_id = ctx.message.audio.file_id;

        ctx.reply(`Отправь название своего бита`);
        ctx.wizard.next();
    },


    //получение названия бита
    async ctx => {
        const user = await db.getUser(ctx.message.from.id);
        const mainButtons = await keyboardMarkups.mainButtons(user);
        if (ctx.message.text === "Отменить ❌") {
            ctx.reply("Загрузка бита отменена", mainButtons);
            ctx.scene.leave();
            return;
        }

        const replymsg = await ctx.reply("Скачиваем бит");

        const file_link = await ctx.telegram.getFileLink(ctx.wizard.state.file_id);
        const beat_filepath = await processBeat.downloadBeat(file_link.href);

        ctx.telegram.editMessageText(replymsg.chat.id, replymsg.message_id, undefined, "Обработка...");
        const compressed_path = await processBeat.compressBeat(beat_filepath);

        ctx.wizard.state.title = ctx.message.text;
        const beat_id = await db.addBeat(ctx.wizard.state, ctx.message.from.id);
        processBeat.renameBeat(compressed_path, beat_id);

        ctx.telegram.deleteMessage(replymsg.chat.id, replymsg.message_id)

        await ctx.reply("Бит опубликован", mainButtons);
        getBeat(ctx, ctx.message.from.id, 0, "recent");
        ctx.scene.leave();
    }
);