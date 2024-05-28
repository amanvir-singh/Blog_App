const { db } = require("./init");
const {createUser} = require('./users')
const jwt = require('jsonwebtoken');
async function register (req,res){
    //Check User
    const stmnt = db.prepare('SELECT * FROM users WHERE email = ? OR username = ?');
    const info = await stmnt.get(req.body.email, req.body.username);
    if (info){
        return res.status(409).json("User Exists")
    }
    //Adding the user
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const img = req.body.img;

    if(username && email && password) {
      const newUser = await createUser(username, email, password, img);
        if(newUser) { 
            return res.status(200).json({ message: 'User created'});
        } else {
          return res.status(400).json({ message: 'Invalid data.'});
        };
        } else {
            return res.status(400).json({ message: 'missing user data' });
        };
}

async function login (req,res){
    //Check User
    const stmnt = db.prepare('SELECT * FROM users WHERE username = ?');
    const info = await stmnt.all(req.body.username);
    if (!info || info.length===0){
        return res.status(404).json("User does not exist")
    }

    //Check Password
    if (req.body.password === info[0].password){
       const token = jwt.sign({id:info[0].id}, 'mykey')
       const {password, ...other} = info[0];
       res.cookie("access token",token).status(200).json(other);
    }else{
        return res.status(400).json("Username or password incorrect")
    }
}

async function logout (req,res){
    res.clearCookie("access token",{
        sameSite:"none"
      }).status(200).json("User logged out.")    
};

module.exports={
    register,
    login,
    logout
}