const { db } = require("./init");

async function createUser(username, email, password, img){
    const stmnt = db.prepare('INSERT INTO users (username, email, password, img) VALUES (?, ?, ?, ?)');
    let info;
    try {
        info = await stmnt.run(username, email, password, img);
    } catch (err) {
        console.error('[data.users.createUser] Unable to create user', err.message);
        return undefined;
    }
    return info;
}

async function getUserById(id){
    const stmnt = db.prepare('SELECT * FROM users WHERE id = ?');
    const info = await stmnt.get(id);
    return info;
}

async function getAllUsers(){
    const stmnt = db.prepare('SELECT * FROM users');
    const info = await stmnt.all();
    return info;
}

async function deleteUser(id){
    const stmnt = db.prepare('DELETE FROM users WHERE id = ?');
    const info = await stmnt.run(id);
    return info;
}

async function updateUsername(username, id){
    const stmnt = db.prepare(`UPDATE users SET username = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
    let info;
    try {
        info = await stmnt.run(username, id);
    } catch (err) {
        console.error('[data.users.updateUsername] Unable to update username', err.message);
        return undefined;
    }
    return info;
}

async function updateEmail(email, id){
    const stmnt = db.prepare(`UPDATE users SET email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
    let info;
    try {
        info = await stmnt.run(email, id);
    } catch (err) {
        console.error('[data.users.updateEmail] Unable to update user email', err.message);
        return undefined;
    }
    return info;
}

async function updatePassword(password, id){
    const stmnt = db.prepare(`UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
    let info;
    try {
        info = await stmnt.run(password, id);
    } catch (err) {
        console.error('[data.users.updatePassword] Unable to update user password', err.message);
        return undefined;
    }
    return info;
}
module.exports ={
    createUser,
    getUserById,
    getAllUsers,
    deleteUser,
    updateUsername,
    updateEmail,
    updatePassword
}
