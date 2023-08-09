import { bot } from "./bot.js";
import 'telegraf';

process.on("unhandledRejection", (error) => console.log(error));
process.on("uncaughtException", (error) => console.log(error));

import "./commands/start.js";
import "./handlers/message.js";
import "./handlers/inlineQuery.js";

setTimeout(() => {
    bot.launch();
    console.log("Bot started");
}, 1000)

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));