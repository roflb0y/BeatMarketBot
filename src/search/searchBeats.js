import { Database } from "../database/database.js";
import * as inlineMarkups from "../markups/inlineMarkups.js";
import { Markup, Input } from "telegraf";
import fs from "fs";

const db = new Database();

export async function getBeat(ctx, page, type) {
    const beats = await db.getBeats(type);
    const beat = beats[page];
    const beat_path = `./beats/b${beat.beat_id}.m4a`;

    const inlineButtons = await inlineMarkups.pageButtons(page, type, beats);

    //есле типо страницк перелистнули а не через команду поиск начали чтобы сообщение замениолсь а не новое отправилось
    if (ctx.callbackQuery) {
        const f = await Input.fromLocalFile(beat_path, beat.title)
        ctx.editMessageMedia({ media: f, type: "audio" }, inlineButtons);
    }
    else { 
        //const f = await Input.fromLocalFile(beat_path, beat.title)
        ctx.replyWithAudio({ source: beat_path, filename: beat.title }, inlineButtons);
    }
}