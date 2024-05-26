const db = require('../data/init');

async function initializeDB () {
    await db.init();
};
async function getRecordFromDB(table, field, value) {
    const raw = `SELECT * FROM ${table} WHERE ${field}=?`;
    const stmnt = db.db.prepare(raw);
    const data = await stmnt.get(value);
    return data;
};

async function disableForeignKey(){
    //Disabling Foreign Key for testing
    const disable_foreign = db.db.prepare("PRAGMA foreign_keys = OFF;");
    await disable_foreign.run();
};

async function addToDB(table, fields, records) {
    const raw = `INSERT INTO ${table}(${fields.join(', ')}) VALUES (${fields.map((v) => `@${v}`).join(', ')})`;
    const stmnt = db.db.prepare(raw);
    for (const record of records) {
        await stmnt.run(record);
    };
};

module.exports={
    initializeDB,
    addToDB,
    getRecordFromDB,
    disableForeignKey
}