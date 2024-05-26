const { db } = require("./init");

async function createComment(content, user_id, post_id){
    const stmnt = db.prepare('INSERT INTO comments (content, user_id, post_id) VALUES (?, ?, ?)');
    let info;
    try {
        info = await stmnt.run(content, user_id, post_id);
    } catch (err) {
        console.error('[data.comments.createComment] Unable to create comment', err.message);
        return undefined;
    }
    return info;
};

async function getCommentById(id){
    const stmnt = db.prepare('SELECT * FROM comments WHERE id = ?');
    const info = await stmnt.get(id);
    return info;
};

async function getAllComments(){
    const stmnt = db.prepare('SELECT * FROM comments');
    const info = await stmnt.all();
    return info;
};

async function deleteComment(id){
    const stmnt = db.prepare('DELETE FROM comments WHERE id = ?');
    const info = await stmnt.run(id);
    return info;
};

async function updateContent(content, id){
    const stmnt = db.prepare(`UPDATE comments SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
    let info;
    try {
        info = await stmnt.run(content, id);
    } catch (err) {
        console.error('[data.comments.updateContent] Unable to update content', err.message);
        return undefined;
    }
    return info;
};

async function getCommentByUser(username){
    const stmnt1 = db.prepare('SELECT id FROM users WHERE username = ?');
    const user_id = (await stmnt1.get(username)).id
    const stmnt = db.prepare('SELECT * FROM comments WHERE user_id = ?');
    const info = await stmnt.all(user_id);
    return info;
};

async function getCommentByPostId(id){
    const stmnt = db.prepare('SELECT * FROM comments WHERE post_id = ?');
    const info = await stmnt.all(id);
    return info;
};

module.exports ={
    createComment,
    getCommentById,
    getAllComments,
    deleteComment,
    updateContent,
    getCommentByUser,
    getCommentByPostId
};
