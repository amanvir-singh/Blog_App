const express = require('express');
const {postByUser} = require("../../controllers/postByUserController");

const router = express.Router();


router.get("/postByUser/:username", postByUser);


module.exports= router;