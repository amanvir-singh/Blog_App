require('dotenv').config();
const fs = require('fs');
//const db = require('better-sqlite3')(process.env.DB_SOURCE, {});
const db = require('better-sqlite3')("Blog.db", {});

async function init() {
    const script = fs.readFileSync('./scripts/init.sql', 'utf-8');
    await db.exec(script)
    console.log("Tables Created");
};

module.exports = {
    db,
    init
};
