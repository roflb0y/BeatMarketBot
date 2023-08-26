import { v4 as uuidv4 } from 'uuid';
import fs from "fs";
import moment from 'moment/moment.js';

export function getTempFilename() {
    return uuidv4();
}

export function deleteBeat(filepath) {
    fs.unlinkSync(filepath);
}

export function timeSince(date, lang) {
    // thanks Sky Sanders from stackoverflow
    let seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + " " + numDeclination(Math.floor(interval), lang.declensions.years);
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " " + numDeclination(Math.floor(interval), lang.declensions.months);
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " " + numDeclination(Math.floor(interval), lang.declensions.days);
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " " + numDeclination(Math.floor(interval), lang.declensions.hours);
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " " + numDeclination(Math.floor(interval), lang.declensions.minutes);
    }
    return Math.floor(seconds) + " " + numDeclination(Math.floor(interval), lang.declensions.seconds);
}

// склонение числительных или типа того ну типо минут минуты минуту
function numDeclination(num, declensions) {
    let n = Math.abs(num);
    n %= 100;
    if (n >= 5 && n <= 20) {
      return declensions[2];
    }
    n %= 10;
    if (n === 1) {
      return declensions[0];
    }
    if (n >= 2 && n <= 4) {
      return declensions[1];
    }
    return declensions[2];
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

export function getTimeSince(date, lang) {
  return parseUploadDate(date) + " \\| " + timeSince(date, lang) + lang.basic_messages.ago;
}

export function parseUploadDate(date) {
    return moment(date).format('DD.MM.YYYY').replace(/\./g, "\\.");
}

export function prepareString(str) {
  if(str) return str.toString().replace(/\_/g, '\\_')
    .replace(/\*/g, '\\*')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\~/g, '\\~')
    .replace(/\`/g, '\\`')
    .replace(/\>/g, '\\>')
    .replace(/\#/g, '\\#')
    .replace(/\+/g, '\\+')
    .replace(/\-/g, '\\-')
    .replace(/\=/g, '\\=')
    .replace(/\|/g, '\\|')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/\./g, '\\.')
    .replace(/\!/g, '\\!')
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

function formatString(string, params) {
  return string.replace(/{(\d+)}/g, (match, index) => {
    return typeof params[index] !== 'undefined' ? params[index] : match;
  });
}