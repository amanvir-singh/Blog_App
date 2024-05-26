const { db } = require("./init");

async function createPost(title, content, img, user_id){
    const stmnt = db.prepare('INSERT INTO posts (title, content, img, user_id) VALUES (?, ?, ?, ?)');
    let info;
    try {
        info = await stmnt.run(title, content, img, user_id);
    } catch (err) {
        console.error('[data.posts.createPost] Unable to create post', err.message);
        return undefined;
    }
    return info;
}

async function getPostById(id){
    const stmnt = db.prepare('SELECT * FROM posts WHERE id = ?');
    const info = await stmnt.get(id);
    return info;
}

async function getAllPosts(){
    const stmnt = db.prepare('SELECT * FROM posts');
    const info = await stmnt.all();
    return info;
}

async function deletePost(id){
    const stmnt = db.prepare('DELETE FROM posts WHERE id = ?');
    const info = await stmnt.run(id);
    return info;
}

async function updateTitle(title, id){
    const stmnt = db.prepare(`UPDATE posts SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
    let info;
    try {
        info = await stmnt.run(title, id);
    } catch (err) {
        console.error('[data.posts.updateTitle] Unable to update title', err.message);
        return undefined;
    }
    return info;
}

async function updateContent(content, id){
    const stmnt = db.prepare(`UPDATE posts SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
    let info;
    try {
        info = await stmnt.run(content, id);
    } catch (err) {
        console.error('[data.posts.updateContent] Unable to update content', err.message);
        return undefined;
    }
    return info;
}

async function getPostByUser(username){
    const stmnt1 = db.prepare('SELECT id FROM users WHERE username = ?');
    const user_id = (await stmnt1.get(username)).id
    const stmnt = db.prepare('SELECT * FROM posts WHERE user_id = ?');
    const info = await stmnt.all(user_id);
    return info;
};

module.exports ={
    createPost,
    getPostById,
    getAllPosts,
    deletePost,
    updateTitle,
    updateContent,
    getPostByUser
}
