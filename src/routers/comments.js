const express = require('express');
const { getComments, createComment, getComment, deleteComment, updateComment } = require("../../controllers/commentController");

const router = express.Router();


router.get("/comments", getComments);
router.get("/comments/:id", getComment);
router.delete("/comments/:id", deleteComment);
router.post("/comments", createComment);
router.put("/comments/:id", updateComment);

module.exports= router;