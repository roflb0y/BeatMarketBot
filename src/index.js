import { bot } from "./bot.js";
import 'telegraf';
import * as log from "./services/logger.js";

process.on("unhandledRejection", (error) => console.log(error));
process.on("uncaughtException", (error) => console.log(error));

import "./commands/commands.js";
import "./handlers/message.js";
import "./handlers/inlineQuery.js";

setTimeout(async () => {
    bot.launch();

    const me = await bot.telegram.getMe();
    log.debug(`@${me.username} is running`);
}, 1000)


process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));