import { v4 as uuidv4 } from 'uuid';
import fs from "fs";
import moment from 'moment/moment.js';

export function getTempFilename() {
    return uuidv4();
}

export function deleteBeat(filepath) {
    fs.unlinkSync(filepath);
}

export function timeSince(date) {
    // thanks Sky Sanders from stackoverflow
    let seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + " " + numDeclination(Math.floor(interval), "год", "года", "лет");
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " " + numDeclination(Math.floor(interval), "месяц", "месяца", "месяцев");
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " " + numDeclination(Math.floor(interval), "день", "дня", "дней");
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " " + numDeclination(Math.floor(interval), "час", "часа", "часов");
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " " + numDeclination(Math.floor(interval), "минуту", "минуты", "минут");
    }
    return Math.floor(seconds) + " " + numDeclination(Math.floor(interval), "секунду", "секунды", "секунд");
}

// склоние числительных или типа того ну типо минут минуты минуту
function numDeclination(num, one, two, five) {
    let n = Math.abs(num);
    n %= 100;
    if (n >= 5 && n <= 20) {
      return five;
    }
    n %= 10;
    if (n === 1) {
      return one;
    }
    if (n >= 2 && n <= 4) {
      return two;
    }
    return five;
}

export function parseLikes(data) {
  const parsedData = data.split("|");
  parsedData.pop();

  return parsedData;
}

export function dumpLikes(data) {
  let splitter = data.length != 0 ? "|" : "";
  return data.join("|") + splitter;
}

export function getTimeSince(date) {
  return parseUploadDate(date) + " \\| " + timeSince(date) + " назад";
}

export function parseUploadDate(date) {
    return moment(date).format('DD.MM.YYYY').replace(/\./g, "\\.");
}

export function prepareString(str) {
  if(str) return str.toString().replace(/\./g, "\\.")
  else return "null";
}

export const isValidUrl = urlString => {
  var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
  '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
  return !!urlPattern.test(urlString);
}