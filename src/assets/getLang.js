import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getLang(locale) {
    const files = fs.readdirSync(__dirname + "/lang");
    if (files.includes(`${locale}.json`)) {
        return JSON.parse(fs.readFileSync(__dirname + `/lang/${locale}.json`, "utf-8"));
    }
    return JSON.parse(fs.readFileSync(__dirname + `/lang/ru.json`, "utf-8").toJSON());
}

export function getGlobalConsts() {
    let result = {"recent_beats":[], "my_profile":[], "random_beat":[], "fav_beats":[], "upload_beat":[], "cancel":[], "lang_name":[]}

    const langsPath = __dirname + "\\lang";
    const langs = fs.readdirSync(langsPath);

    langs.forEach((file) => {
        const langPath = langsPath + "\\" + file;
        const langName = file.slice(0, -5);
        const parsedLang = JSON.parse(fs.readFileSync(langPath, "utf-8"));

        result.recent_beats.push(parsedLang.mainButtons.recent_beats);
        result.my_profile.push(parsedLang.mainButtons.my_profile);
        result.random_beat.push(parsedLang.mainButtons.random_beat);
        result.fav_beats.push(parsedLang.mainButtons.fav_beats);
        result.upload_beat.push(parsedLang.mainButtons.upload_beat);
        result.cancel.push(parsedLang.basic_messages.cancel);
        result.lang_name.push([langName, parsedLang.language]);

        console.log("Found language", file);
    });
    return result;
}