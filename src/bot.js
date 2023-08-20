import { Telegraf, session, Scenes } from "telegraf";

import { uploadBeatScene } from "./scenes/uploadBeat.js";
import { setNickScene } from "./scenes/setNickname.js";
import { setMediaLinkScene } from "./scenes/setMediaLink.js";
import { setPricesScene } from "./scenes/setPrices.js";

import * as config from "./config.js";

export const bot = new Telegraf(config.BOT_KEY);
bot.use(session())

const stage = new Scenes.Stage([uploadBeatScene, setNickScene, setMediaLinkScene, setPricesScene]);
bot.use(stage.middleware());