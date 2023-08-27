import { Scenes } from 'telegraf';
import { globalLangConsts } from '../bot.js';
import * as keyboardMarkups from "../markups/keyboardMarkups.js";
import * as processBeat from '../services/processBeat.js';
import { Database } from "../database/database.js";
import { getBeat } from '../search/searchBeats.js';
import { getLang } from '../assets/getLang.js';
import * as utils from "../services/utils.js";

const db = new Database(); 

export const uploadBeatScene = new Scenes.WizardScene("UPLOAD_BEAT_SCENE", //што это за хуйня где мой fsm я куда попал
    async ctx => {
        const user = await db.getUser(ctx.message.from.id);
        const lang = await getLang(user.locale);
        if (!user.isVerified) { ctx.scene.leave(); return; };

        ctx.reply(lang.beat_upload.send_beat, keyboardMarkups.cancelButton(lang));
        ctx.wizard.next();
    },

    //получение битп
    async ctx => {
        if(ctx.callbackQuery) return;
        
        const user = await db.getUser(ctx.message.from.id);
        const lang = getLang(user.locale);
        const mainButtons = await keyboardMarkups.mainButtons(user, lang);

        if(globalLangConsts.cancel.includes(ctx.message.text)) {
            ctx.reply(lang.beat_upload.cancelled, mainButtons);
            ctx.scene.leave();
            return;
        }

        if (!(ctx.message.audio && ctx.message.audio.mime_type === "audio/mpeg")) { ctx.reply(lang.beat_upload.resend_format); return }; 
        if (ctx.message.audio.file_size >= 20971520) { ctx.reply(lang.beat_upload.resend_size); return };

        ctx.wizard.state.file_id = ctx.message.audio.file_id;

        ctx.reply(lang.beat_upload.send_title);
        ctx.wizard.next();
    },


    //получение названия бита и обракртбка
    async ctx => {
        if(ctx.callbackQuery) return;

        const user = await db.getUser(ctx.message.from.id);
        const lang = getLang(user.locale);
        const mainButtons = await keyboardMarkups.mainButtons(user, lang);

        if(globalLangConsts.cancel.includes(ctx.message.text)) {
            ctx.reply(lang.beat_upload.cancelled, mainButtons);
            ctx.scene.leave();
            return;
        }

        const replymsg = await ctx.reply(lang.beat_upload.downloading);

        const file_link = await ctx.telegram.getFileLink(ctx.wizard.state.file_id);
        const beat_filepath = await processBeat.downloadBeat(file_link.href);

        ctx.telegram.editMessageText(replymsg.chat.id, replymsg.message_id, undefined, lang.beat_upload.processing);
        const compressed_path = await processBeat.compressBeat(beat_filepath);

        ctx.wizard.state.title = ctx.message.text;
        const beat_id = await db.addBeat(ctx.wizard.state, ctx.message.from.id);
        processBeat.renameBeat(compressed_path, beat_id);

        ctx.telegram.deleteMessage(replymsg.chat.id, replymsg.message_id)

        await ctx.reply(lang.beat_upload.uploaded, mainButtons);
        getBeat(ctx, ctx.message.from.id, 0, "recent");
        ctx.scene.leave();
    }
);