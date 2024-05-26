const router = require('express').Router();
const {
    createComment,
    getCommentById,
    getAllComments,
    deleteComment,
    updateContent,
    getCommentByUser,
    getCommentByPostId
} = require('../data/comments')

router.get('/comments/all', async (req, res) => {
    const comments = await getAllComments();
    res.json({comments});
  });

router.get('/comments/id/:id', async (req, res) => {
    const id = req.params.id;
    if (id !== undefined) {
        const comment = await getCommentById(id);
        if(comment) {
            res.json(comment);
        } else {
            res.status(404).json({message: 'comment not found'});
        };
    } else {
        res.status(400).json({message: 'missing comment id'});
    }
  });

  router.post('/comments/create', async (req, res) => {
    const content = req.body?.content;
    const user_id = req.body?.user_id;
    const post_id = req.body?.post_id;
  
    if(content && user_id && post_id) {
        const newComment = await createComment(content, user_id, post_id);
        if(newComment) {
            res.json({ message: 'Comment created', comment: newComment });
        } else {
            res.status(400).json({ message: 'Invalid data.'});
        };
    } else {
        res.status(400).json({ message: 'missing comment data' });
    }
  });

  router.delete("/comments/delete/:id", async(req,res)=>{
    const id = req.params.id;
    if (id !== undefined) {
      const comment = await deleteComment(id);
      if(comment) {
          res.json(comment);
      } else {
          res.status(404).json({message: 'comment does not exist'});
      }
  } else {
      res.status(400).json({message: 'No id provided.'});
  }
  });


  router.put("/comments/updateContent/:id", async(req,res)=>{
    const content = req.body?.content;
    const id = req.params.id;
    if (content && id){
      const updatedContent = await updateContent(content,id);
      if(updatedContent) {
        res.json({ message: 'Content Updated', comment: updatedContent });
    } else {
        res.status(400).json({ message: 'Invalid data.'});
    }
    }else{
      res.status(400).json({ message: 'missing comment data' });
    }
  });

  router.get("/comments/user/:username", async(req,res)=>{
    const username = req.params.username;
    if (username !== undefined) {
        const comments = await getCommentByUser(username);
        if(comments) {
            res.json(comments);
        } else {
            res.status(404).json({message: 'comments not found'});
        }
    } else {
        res.status(400).json({message: 'missing username'});
    }
});

router.get("/comments/post/:id", async(req,res)=>{
    const id = req.params.id;
    if (id !== undefined) {
        const comments = await getCommentByPostId(id);
        if(comments) {
            res.json(comments);
        } else {
            res.status(404).json({message: 'comments not found'});
        }
    } else {
        res.status(400).json({message: 'missing username'});
    }
});
  

module.exports= router;
