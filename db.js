const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./Blog.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the database.');
    }
});


const createUsersTable = () => {
    const sql = `CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(45) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(45) NOT NULL,
        img VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP
    )`;
    db.serialize(()=>{
        db.run(sql, (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log('Table users Created or Already Exists.');
            }
        })
    });
}

const createPostsTable = () => {
    const sql = `CREATE TABLE IF NOT EXISTS posts(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(255) NOT NULL,
        content VARCHAR(1000) NOT NULL,
        img VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`;
    db.serialize(()=>{
        db.run(sql, (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log('Table posts Created or Already Exists.');
            }
        })
    });
}
const createCommentsTable = () => {
    const sql = `CREATE TABLE IF NOT EXISTS comments(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content VARCHAR(1000) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP,
        user_id INTEGER,
        post_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    )`;
    db.serialize(()=>{
        db.run(sql, (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log('Table comments Created or Already Exists.');
            }
        });
    })
    
}

const deleteTable = (table) => {
    const sql = `DROP TABLE IF EXISTS ${table}`;
    db.serialize(()=>{
        db.run(sql, [], (err) => {
            if (err) {
                console.error(err.message);
            } else {
                //console.log(`Table ${table} Deleted or Never Existed.`);
            }
        })
    });
}

module.exports = {
    db,
    createUsersTable,
    createPostsTable,
    createCommentsTable,
    deleteTable
};