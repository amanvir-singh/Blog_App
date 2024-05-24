const { db } = require("../db");

const getPosts = (req, res) => {
  const sql = "SELECT * FROM posts";

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.status(200).json(rows);
  });
};


const getPost = (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM posts WHERE id = ?";
  
    db.get(sql, [id], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      if (!row) {
        res.status(404).json({ error: `Post with id ${id} not found` });
        return;
      }
  
      res.status(200).json(row);
    });
  };
  

  const createPost = (req, res) => {
    const { title, content, img, user_id } = req.body;
  
    if (!title || !content || !user_id) {
      res.status(400).json({ error: "Title, content, and user_id are required" });
      return;
    }
  
    const sql = `INSERT INTO posts (title, content, img, user_id) VALUES (?, ?, ?, ?)`;
    const values = [title, content, img, user_id];
  
    db.run(sql, values, function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      res.status(201).json({ id: this.lastID, title, content, img, user_id });
    });
  };

  const deletePost = (req, res) => {
    const postId = req.params.id;
  
    const sql = "DELETE FROM posts WHERE id = ?";
  
    db.run(sql, [postId], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      if (this.changes === 0) {
        res.status(404).json({ error: `Post with id ${postId} not found` });
        return;
      }
  
      res.status(204).send();
    });
  };


  const updatePost = (req, res) => {
    const postId = req.params.id;
    const { title, content, img } = req.body;
  
    if (!title && !content && !img) {
      res.status(400).json({ error: "At least one field is required to update" });
      return;
    }
  
    const updateFields = [];
    const values = [];
  
    if (title) {
      updateFields.push("title = ?");
      values.push(title);
    }
  
    if (content) {
      updateFields.push("content = ?");
      values.push(content);
    }
  
    if (img) {
      updateFields.push("img = ?");
      values.push(img);
    }
  
    const sql = `UPDATE posts SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    values.push(postId);
  
    db.run(sql, values, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      if (this.changes === 0) {
        res.status(404).json({ error: `Post with id ${postId} not found` });
        return;
      }
  
      res.status(200).json({ message: "Post updated successfully", content, title });
    });
  };

  module.exports={
    getPosts,
    getPost,
    createPost,
    deletePost,
    updatePost
  }
  