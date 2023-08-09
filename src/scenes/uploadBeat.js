import { Scenes } from 'telegraf';
import * as keyboardMarkups from "../markups/keyboardMarkups.js";
import * as processBeat from '../services/processBeat.js';
import { Database } from "../database/database.js";
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

        ctx.telegram.getFileLink(ctx.message.audio.file_id)
        .then((url) => { 
            processBeat.downloadBeat(url.href)
            .then(beat_filepath => {
                processBeat.compressBeat(beat_filepath).then((compressed_path) => {
                    ctx.wizard.state.filepath = compressed_path;
                });
            })
            .catch(error => {
                console.log(error)
                ctx.reply(`произошла ошыпка`, mainButtons);
                ctx.scene.leave();
            });
        });

        ctx.reply(`Отправь название своего бита`);
        ctx.wizard.next();
    },


    //получение названия бита
    async ctx => {
        if (ctx.wizard.state.filepath === undefined) { ctx.reply("Не так быстро"); return }

        const user = await db.getUser(ctx.message.from.id);
        const mainButtons = await keyboardMarkups.mainButtons(user);
        console.log(mainButtons)
        if (ctx.message.text === "Отменить ❌") {
            utils.deleteBeat(ctx.wizard.state.filepath);
            ctx.reply("Загрузка бита отменена", mainButtons);
            ctx.scene.leave();
            return;
        }

        ctx.wizard.state.title = ctx.message.text;
        db.addBeat(ctx.wizard.state, ctx.message.from.id).then(beat_id => processBeat.renameBeat(ctx.wizard.state.filepath, beat_id));

        ctx.reply(`Бит опубликован`, mainButtons);
        ctx.scene.leave();
    }
);