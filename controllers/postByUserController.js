const { db } = require("../db");

const postByUser = (req, res) => {
    const username = req.params.username;
    let user_id=0;
    const sql1 = "SELECT id FROM users WHERE username = ?";
    db.get(sql1, [username], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      if (!row) {
        res.status(404).json({ error: `No user with username: ${username} found ` });
        return;
      }
    
    user_id =row.id;
    console.log(`ID->>>>>${user_id}`);
    });
    
    const sql2 = "SELECT * FROM posts WHERE user_id = ?";
    db.all(sql2, [user_id], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      if (!row) {
        res.status(404).json({ error: `Post with user_id ${user_id} not found` });
        return;
      }
  
      res.status(200).json(row);
      console.log("Rows->>>",row);
    });

  };


module.exports = {postByUser}