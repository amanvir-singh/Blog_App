const router = require('express').Router();
const {
  createUser,
  getUserById,
  getAllUsers,
  deleteUser,
  updateUsername,
  updateEmail,
  updatePassword
} = require('../controllers/users')

router.get('/users/all', async (req, res) => {
  const users = await getAllUsers();
  res.json({users});
});

router.get('/users/id/:id', async (req, res) => {
  const id = req.params.id;
  if (id !== undefined) {
      const user = await getUserById(id);
      if(user) {
          res.json(user);
      } else {
          res.status(404).json({message: 'user not found'});
      }
  } else {
      res.status(400).json({message: 'missing user id'});
  }
});

router.post('/users/create', async (req, res) => {
  const username = req.body?.username;
  const email = req.body?.email;
  const password = req.body?.password;
  const img = req.body?.img;

  if(username && email && password) {
      const newUser = await createUser(username, email, password, img);
      if(newUser) {
          res.json({ message: 'User created', user: newUser });
      } else {
          res.status(400).json({ message: 'Invalid data.'});
      };
  } else {
      res.status(400).json({ message: 'missing user data' });
  }
});

router.delete("/users/delete/:id", async(req,res)=>{
  const id = req.params.id;
  if (id !== undefined) {
    const user = await deleteUser(id);
    if(user) {
        res.json(user);
    } else {
        res.status(404).json({message: 'user does not exist'});
    }
} else {
    res.status(400).json({message: 'No id provided.'});
}
});

router.put("/users/updateUsername/:id", async(req,res)=>{
  const username = req.body?.username;
  const id = req.params.id;

  if (username && id){
    const updatedUsername = await updateUsername(username,id);
    if(updatedUsername) {
      res.json({ message: 'Username Updated', user: updatedUsername });
  } else {
      res.status(400).json({ message: 'Invalid data.'});
  }
  }else{
    res.status(400).json({ message: 'missing user data' });
  }

});

router.put("/users/updateEmail/:id", async(req,res)=>{
  const email = req.body?.email;
  const id = req.params.id;

  if (email && id){
    const updatedEmail = await updateEmail(email,id);
    if(updatedEmail) {
      res.json({ message: 'Email Updated', user: updatedEmail });
  } else {
      res.status(400).json({ message: 'Invalid data.'});
  }
  }else{
    res.status(400).json({ message: 'missing user data' });
  }

});

router.put("/users/updatePassword/:id", async(req,res)=>{
  const password = req.body?.password;
  const id = req.params.id;

  if (password && id){
    const updatedPassword = await updatePassword(password,id);
    if(updatedPassword) {
      res.json({ message: 'Password Updated', user: updatedPassword });
  } else {
      res.status(400).json({ message: 'Invalid data.'});
  }
  }else{
    res.status(400).json({ message: 'missing user data' });
  }

});




module.exports= router;