const { db } = require("../db");


const getUsers = (req, res) => {
  try {
    const sql = "SELECT * FROM users";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        };
        res.status(200).json(rows);
    });
} catch (error) {
    console.error("Error in getUsers:", error);
    console.error("Res object:", res);
}
  };

  const getUser = (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM users WHERE id = ?";
  
    db.get(sql, [id], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      if (!row) {
        res.status(404).json({ error: `User with id ${id} not found` });
        return;
      }
  
      res.status(200).json(row);
    });
  };

  const createUser = (req, res) => {
    const { username, email, password, img } = req.body;
  
    if (!username || !email || !password) {
      res.status(400).json({ error: "Username, email, and password are required" });
      return;
    }
  
    const sql = `INSERT INTO users (username, email, password, img) VALUES (?, ?, ?, ?)`;
    const values = [username, email, password, img];
  
    db.run(sql, values, function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      res.status(201).json({ id: this.lastID, username, email, password, img });
    });
  };

  const deleteUser = (req, res) => {
    const userId = req.params.id;
  
    const sql = "DELETE FROM users WHERE id = ?";
  
    db.run(sql, [userId], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      if (this.changes === 0) {
        res.status(404).json({ error: `User with id ${userId} not found` });
        return;
      }
  
      res.status(204).send();
    });
  };
  

  const updateUser = (req, res) => {
    const userId = req.params.id;
    const { username, email, password, img } = req.body;
  
    if (!username && !email && !password && !img) {
      res.status(400).json({ error: "At least one field is required to update" });
      return;
    }
  
    const updateFields = [];
    const values = [];
  
    if (username) {
      updateFields.push("username = ?");
      values.push(username);
    }
  
    if (email) {
      updateFields.push("email = ?");
      values.push(email);
    }
  
    if (password) {
      updateFields.push("password = ?");
      values.push(password);
    }
  
    if (img) {
      updateFields.push("img = ?");
      values.push(img);
    }
  
    const sql = `UPDATE users SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    values.push(userId);
  
    db.run(sql, values, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      if (this.changes === 0) {
        res.status(404).json({ error: `User with id ${userId} not found` });
        return;
      }
  
      res.status(200).json({ username, email, password, img, message: "User updated successfully" });
    });
  };
  
  module.exports={
    getUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser
  };
  