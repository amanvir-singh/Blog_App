const ab = require("./init");
const {db, init} = require("./init");

const mockPosts = [
    {
      title: "First Post",
      content: "Hi, This is my first post",
      img: "https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      user_id: 4
    },
    {
      title: "Second Post",
      content: "Hi, This is my second post by other user",
      img: "https://images.pexels.com/photos/7008010/pexels-photo-7008010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      user_id: 7
    },
    {
      title: "Tips to improve health",
      content: "Follow the given steps to improve health",
      img: "https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      user_id: 3
    },
    {
      title: "Travel Diaries",
      content: "Exploring the beautiful landscapes of New Zealand",
      img: "https://images.pexels.com/photos/4230630/pexels-photo-4230630.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      user_id: 2
    },
    {
      title: "Cooking Adventures",
      content: "Trying out a new recipe for a delicious pasta dish",
      img: "https://images.pexels.com/photos/7008010/pexels-photo-7008010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      user_id: 5
    },
    {
      title: "Book Review",
      content: "My thoughts on the latest bestselling novel",
      img: "https://images.pexels.com/photos/6157049/pexels-photo-6157049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      user_id: 1
    }
  ];
async function disableForeignKey(){
    //Disabling Foreign Key for testing
    await init();
    const disable_foreign = ab.db.prepare("PRAGMA foreign_keys = OFF;");
    await disable_foreign.run();
};

async function addToDB(table, fields, records) {
    await disableForeignKey();
    const raw = `INSERT INTO ${table}(${fields.join(', ')}) VALUES (${fields.map((v) => `@${v}`).join(', ')})`;
    const stmnt = ab.db.prepare(raw);
    for (const record of records) {
        await stmnt.run(record);
    };
};

// addToDB(
//     'posts', 
//     ['title', 'content', 'img', 'user_id'], 
//     mockPosts
//     );

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
    const stmnt = db.prepare('SELECT posts.id, posts.title, posts.content, posts.created_at, posts.img, posts.user_id, users.username FROM posts JOIN users ON posts.user_id = users.id WHERE posts.id = ?');
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

async function updateImg(img, id){
    const stmnt = db.prepare(`UPDATE posts SET img = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
    let info;
    try {
        info = await stmnt.run(img, id);
    } catch (err) {
        console.error('[data.posts.updateImg] Unable to update img', err.message);
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
    getPostByUser,
    updateImg
}
