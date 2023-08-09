import sqlite3 from "sqlite3";
import mysql from "mysql2";
import * as config from "../config.js";

const db = mysql.createConnection({
    host: config.MYSQL_HOST,
    user: config.MYSQL_USER,
    database: config.MYSQL_DB,
    password: config.MYSQL_PASSWORD
});

db.connect((err) => {
    if (err) {
        console.log("Connection to db failed");
        console.log(err)
    }
    else console.log("Connected to db")
})

process.on("unhandledRejection", (error) => console.log(error));
process.on("uncaughtException", (error) => console.log(error));

export class Database {
    db = db;

    addUser(user_id) {
        this.getUser(user_id).catch((err) => {
            this.db.query(`INSERT INTO users(user_id) VALUES ("${user_id.toString()}")`)
            console.log(`Inserted new user ${user_id.toString()} | ${new Date().toString()}`)
        })
    };

    getUser(user_id) {
        return new Promise((resolve, reject) => {
            this.db.execute(`SELECT * FROM users WHERE user_id = "${user_id.toString()}"`, (err, res, fields) => {
                if (res.length === 0) reject(`User ${user_id} is not in db`);
                else resolve(new User(res[0]));
            })
        })
    };

    addBeat(data, author_id) {
        return new Promise((resolve, reject) => {
            this.db.query(`INSERT INTO beats(author_id, title, tags) VALUES ("${author_id}", "${data.title}", "")`, (err, res, fields) => {
                console.log(`Uploaded new beat | Id: ${res.insertId} | ${new Date().toString()}`);
                resolve(res.insertId);
            });
        });
    };

    getBeats(type) {
        switch (type) {
            case "recent":
                return new Promise((resolve, reject) => {
                    this.db.query("SELECT * FROM beats ORDER BY beat_id DESC", (err, res, fields) => resolve(res.map(beat => new Beat(beat))));
                });
        }
        
    }
}

export class User {
    constructor(user) {
        this.id = user.id;
        this.user_id = user.user_id;
        this.join_date = user.join_date;
    }
}

export class Beat {
    db = db;

    constructor(beat) {
        this.beat_id = beat.beat_id;
        this.author_id = beat.author_id;
        this.upload_date = beat.upload_date;
        this.title = beat.title;
        this.tags = beat.tags;
        this.telegram_id = beat.telegram_id;
    }

    insertTelegramId(id) {
        this.db.query(`UPDATE beats SET telegram_id = "${id}" WHERE beat_id = ${this.beat_id}`);
    }
}