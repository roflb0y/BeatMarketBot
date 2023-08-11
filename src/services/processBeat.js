import request from "request";
import fs from "fs";
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import { getTempFilename } from "./utils.js";

export function downloadBeat(url) {
    return new Promise((resolve, reject) => {
        const tempFilename = getTempFilename()
        request.get(url)
            .pipe(fs.createWriteStream(`./beats/${tempFilename}.mp3`))
            .on("finish", function() { 
                resolve(`./beats/${tempFilename}.mp3`);
            })
            .on("error", error => reject(new Error(error)))
    })
}

export function compressBeat(filepath) {
    return new Promise((resolve, reject) => {
        ffmpeg()
            .input(path.resolve(filepath))
            .audioCodec("aac")
            .audioBitrate("256k")
            .save(`./beats/b${path.parse(filepath).name}.m4a`)
    
            .on("error", function(err, stdout, stderr) {
                console.log('error: ' + err.message);
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                reject();
            })
    
            .on("end", () => {
                fs.unlinkSync(filepath);
                resolve(`./beats/b${path.parse(filepath).name}.m4a`);
            })
    })
}

export function renameBeat(tempName, beatId) {
    const parsedPath = path.parse(tempName)
    const newName = `${parsedPath.dir}/b${beatId.toString()}${parsedPath.ext}`

    fs.renameSync(tempName, newName);
}