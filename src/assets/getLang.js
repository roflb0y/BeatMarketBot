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

export function getAllMainButtons() {
    let result = {"recent_beats":[], "my_profile":[], "random_beat":[], "fav_beats":[], "upload_beat":[]}
    const langs = fs.readdirSync(__dirname + "/lang");
    langs.forEach((file) => {
        const parsed = JSON.parse(fs.readFileSync(path.resolve(file), "utf-8"));
        result.recent_beats.push(parsed["recent_beats"]);
        result.my_profile.push(parsed["my_profile"]);
        result.random_beat.push(parsed["random_beat"]);
        result.fav_beats.push(parsed["fav_beats"]);
        result.upload_beat.push(parsed["upload_beat"]);
    });
    console.log(result);
}