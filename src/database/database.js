import mysql from "mysql2";
import * as config from "../config.js";
import * as utils from "../services/utils.js";

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

    addUser(ctx) {
        return new Promise((resolve) => {
            this.getUser(ctx.message.from.id)
            .then((user) => resolve())
            .catch((err) => {
                this.db.query(`INSERT INTO users(user_id, nickname, liked, user_locale) VALUES ("${ctx.message.from.id.toString()}", "${ctx.message.from.first_name}", "", "${ctx.from.language_code}")`, (err, res, fields) => { 
                    console.log(`Inserted new user ${ctx.message.from.id.toString()} | ${new Date().toString()}`)
                    resolve() 
                });
                
                return;
            })
        })
    };

    getUser(user_id) {
        return new Promise((resolve, reject) => {
            this.db.query(`SELECT * FROM users WHERE user_id = "${user_id.toString()}"`, (err, res, fields) => {
                if (err) { console.log(err); return; } 
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

    async getBeats(type, user) {
        switch (type) {
            case "recent":
                return new Promise((resolve, reject) => {
                    this.db.query("SELECT * FROM beats ORDER BY beat_id DESC", (err, res, fields) => resolve(res.map(beat => new Beat(beat))));
                });
            case "myLiked":
                return new Promise((resolve, reject) => {
                    this.db.query(`SELECT liked FROM users WHERE user_id = "${user.user_id}"`, (err, res, fields) => {
                        let beatsList = utils.parseLikes(res[0].liked);
                        beatsList = beatsList.join(", ");

                        this.db.query(`SELECT * FROM beats WHERE beat_id IN(${beatsList})`, (err, res, fields) => resolve(res.map(beat => new Beat(beat))))
                    }
                )});
        }
        
    };

    getBeat(beat_id) {
        return new Promise((resolve, reject) => {
            this.db.query(`SELECT * FROM beats WHERE beat_id = ${beat_id}`, (err, res, fields) => { 
                if (res.length === 0) { resolve(false); return }
                resolve(new Beat(res[0]))
            });
        });
    };

    getBeatsByUserCount(user) {
        return new Promise((resolve, reject) => {
            this.db.query(`SELECT COUNT(*) FROM beats WHERE author_id = "${user.user_id}"`, (err, res, fields) => {
                resolve(res[0]["COUNT(*)"]);
            });
        });
    };

    getRandomBeat() {
        return new Promise((resolve, reject) => {
            // 3000 iq sql запрос
            this.db.query("SELECT COUNT(*) FROM beats", (err, res, fields) => resolve( Math.floor(Math.random() * res[0]["COUNT(*)"]) ));
        });
    };

    getAdmins() {
        return new Promise((resolve, reject) => {
            this.db.query(`SELECT * FROM users WHERE admin = '1'`, (err, res, fields) => {
                resolve(res.map(user => new User(user)));
            });
        });
    };
}

export class User {
    constructor(user) {
        this.id = user.id;
        this.user_id = user.user_id;
        this.nickname = user.nickname;
        this.media_link = user.media_link;
        this.prices = user.prices;
        this.join_date = user.join_date;
        this.liked = utils.parseLikes(user.liked);
        this.locale = user.user_locale;
        this.isVerified = (user.verified == true);
        this.haveApplied = (user.applied == true);
        this.isAdmin = (user.admin == true);
    }

    setNickname(nickname) {
        db.query(`UPDATE users SET nickname = "${nickname}" WHERE user_id = "${this.user_id}"`);
        this.nickname = nickname;
    };

    setMediaLink(link) {
        db.query(`UPDATE users SET media_link = "${link}" WHERE user_id = "${this.user_id}"`);
        this.media_link = link;
    };

    setPrices(prices) {
        db.query(`UPDATE users SET prices = "${prices}" WHERE user_id = "${this.user_id}"`);
        this.prices = prices;
    };

    setApplied(status) {
        db.query(`UPDATE users SET applied = '${status}' WHERE user_id = "${this.user_id}"`);
        if(status === 1) console.log(`User ${this.user_id} has applied for verification | ${new Date().toString()}`);
        this.haveApplied = (status == true);
    };

    setVerified(status) {
        db.query(`UPDATE users SET verified = '${status}' WHERE user_id = "${this.user_id}"`);
        this.isVerified = (status == true);
    };

    setLocale(locale) {
        db.query(`UPDATE users SET user_locale = '${locale}' WHERE user_id = "${this.user_id}"`);
        this.locale = locale;
    }

    toggleLike(beat) {
        if(!this.liked.includes(beat.beat_id.toString())) this.liked.unshift(beat.beat_id)
        else
        { 
            let index = this.liked.indexOf(beat.beat_id.toString());
            this.liked.splice(index, 1); 
        }

        const dumpedBeats = utils.dumpLikes(this.liked);
        db.query(`UPDATE users SET liked = "${dumpedBeats}" WHERE user_id = ${this.user_id}`);
    }
}

export class Beat {
    constructor(beat) {
        this.beat_id = beat.beat_id;
        this.author_id = beat.author_id;
        this.upload_date = beat.upload_date;
        this.title = beat.title;
        this.tags = beat.tags;
        this.telegram_id = beat.telegram_id;
    };

    insertTelegramId(id) {
        db.query(`UPDATE beats SET telegram_id = "${id}" WHERE beat_id = ${this.beat_id}`);
        this.telegram_id = id;
    };

    deleteBeat() {
        db.query(`DELETE FROM beats WHERE beat_id = ${this.beat_id}`);
        console.log(`Beat ${this.beat_id} deleted | ${new Date().toString()}`);
    };

    async getLikesCount() {
        return new Promise((resolve) => {
            db.query(`SELECT COUNT(*) FROM users WHERE liked LIKE \'%${this.beat_id}%\'`, (err, res, fields) => { resolve(res[0]["COUNT(*)"]) })
        })
    }
}