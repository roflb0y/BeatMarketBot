import chalk from "chalk";
import * as utils from "../services/utils.js";

export const debug = (msg) => {
    console.log(chalk.magentaBright(`[${utils.getLogDate()}] DEBUG: ${msg}`))
}

export const info = (msg) => {
    console.log(chalk.greenBright.italic(`[${utils.getLogDate()}] INFO: ${msg}`))
}

export const error = (msg) => {
    console.log(chalk.redBright(`[${utils.getLogDate()}] ERROR: ${msg}`))
}