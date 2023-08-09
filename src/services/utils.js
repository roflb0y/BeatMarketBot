import { v4 as uuidv4 } from 'uuid';
import fs from "fs";

export function getTempFilename() {
    return uuidv4();
}

export function deleteBeat(filepath) {
    fs.unlinkSync(filepath);
}