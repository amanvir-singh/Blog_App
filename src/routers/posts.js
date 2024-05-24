const express = require('express');
const { getPosts, createPost, getPost, deletePost, updatePost } = require("../../controllers/postController");

const router = express.Router();


router.get("/posts", getPosts);
router.get("/posts/:id", getPost);
router.delete("/posts/:id", deletePost);
router.post("/posts", createPost);
router.put("/posts/:id", updatePost);

module.exports= router;