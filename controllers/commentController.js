const { db } = require("../db");

const getComments = (req, res) => {
  try {
    const sql = "SELECT * FROM comments";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        };
        res.status(200).json(rows);
    });
} catch (error) {
    console.error("Error in getComments:", error);
    console.error("Res object:", res);
}
  };

const getComment = (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM comments WHERE id = ?";
  
    db.get(sql, [id], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      if (!row) {
        res.status(404).json({ error: `Comment with id ${id} not found` });
        return;
      }
  
      res.status(200).json(row);
    });
  };

const deleteComment = (req, res) => {
    const commentId = req.params.id;
  
    const sql = "DELETE FROM comments WHERE id = ?";
  
    db.run(sql, [commentId], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      if (this.changes === 0) {
        res.status(404).json({ error: `Comment with id ${commentId} not found` });
        return;
      }
  
      res.status(204).send();
    });
  };

const createComment = (req, res) => {
    const { content, user_id, post_id } = req.body;
  
    if (!content || !user_id || !post_id) {
      res.status(400).json({ error: "Content, user_id, and post_id are required" });
      return;
    }
  
    const sql = `INSERT INTO comments (content, user_id, post_id) VALUES (?, ?, ?)`;
    const values = [content, user_id, post_id];
  
    db.run(sql, values, function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      res.status(201).json({ id: this.lastID, content, user_id, post_id });
    });
  };


const updateComment = (req, res) => {
    const commentId = req.params.id;
    const { content } = req.body;
  
    if (!content) {
      res.status(400).json({ error: "Content is required to update" });
      return;
    }
  
    const sql = `UPDATE comments SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    const values = [content, commentId];
  
    db.run(sql, values, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      if (this.changes === 0) {
        res.status(404).json({ error: `Comment with id ${commentId} not found` });
        return;
      }
  
      res.status(200).json({ message: "Comment updated successfully", content });
    });
  };
  
  module.exports={
    getComments,
    getComment,
    createComment,
    deleteComment,
    updateComment
  }
  

