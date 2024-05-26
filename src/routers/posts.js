const router = require('express').Router();
const {
    createPost,
    getPostById,
    getAllPosts,
    deletePost,
    updateTitle,
    updateContent,
    getPostByUser
} = require('../data/posts')

router.get('/posts/all', async (req, res) => {
    const posts = await getAllPosts();
    res.json({posts});
  });

router.get('/posts/id/:id', async (req, res) => {
    const id = req.params.id;
    if (id !== undefined) {
        const post = await getPostById(id);
        if(post) {
            res.json(post);
        } else {
            res.status(404).json({message: 'post not found'});
        }
    } else {
        res.status(400).json({message: 'missing post id'});
    }
  });

  router.post('/posts/create', async (req, res) => {
    const title = req.body?.title;
    const content = req.body?.content;
    const user_id = req.body?.user_id;
    const img = req.body?.img;
  
    if(title && content && user_id) {
        const newPost = await createPost(title, content, img, user_id);
        if(newPost) {
            res.json({ message: 'Post created', post: newPost });
        } else {
            res.status(400).json({ message: 'Invalid data.'});
        };
    } else {
        res.status(400).json({ message: 'missing post data' });
    }
  });

  router.delete("/posts/delete/:id", async(req,res)=>{
    const id = req.params.id;
    if (id !== undefined) {
      const post = await deletePost(id);
      if(post) {
          res.json(post);
      } else {
          res.status(404).json({message: 'post does not exist'});
      }
  } else {
      res.status(400).json({message: 'No id provided.'});
  }
  });


  router.put("/posts/updateTitle/:id", async(req,res)=>{
    const title = req.body?.title;
    const id = req.params.id;
    if (title && id){
      const updatedTitle = await updateTitle(title,id);
      if(updatedTitle) {
        res.json({ message: 'Title Updated', post: updatedTitle });
    } else {
        res.status(400).json({ message: 'Invalid data.'});
    }
    }else{
      res.status(400).json({ message: 'missing post data' });
    }
  });

  router.put("/posts/updateContent/:id", async(req,res)=>{
    const content = req.body?.content;
    const id = req.params.id;
    if (content && id){
      const updatedContent = await updateContent(content,id);
      if(updatedContent) {
        res.json({ message: 'Content Updated', post: updatedContent });
    } else {
        res.status(400).json({ message: 'Invalid data.'});
    }
    }else{
      res.status(400).json({ message: 'missing post data' });
    }
  });

  router.get("/posts/user/:username", async(req,res)=>{
    const username = req.params.username;
    if (username !== undefined) {
        const posts = await getPostByUser(username);
        if(posts) {
            res.json(posts);
        } else {
            res.status(404).json({message: 'posts not found'});
        }
    } else {
        res.status(400).json({message: 'missing username'});
    }
});
  

module.exports= router;