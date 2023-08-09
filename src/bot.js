import { Telegraf, session, Scenes } from "telegraf";
import { uploadBeatScene } from "./scenes/uploadBeat.js";

import * as config from "./config.js";

export const bot = new Telegraf(config.BOT_KEY);
bot.use(session())

const stage = new Scenes.Stage([uploadBeatScene]);
bot.use(stage.middleware());