const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const usersRoutes = require('./routers/users');
const commentsRoutes = require('./routers/comments');
const postsRoutes = require('./routers/posts');
const authRoutes = require('./routers/auth');
const db = require('./controllers/init');
var cors = require('cors');


const app = express();
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
async function initializeDB () {
    await db.init();
};
initializeDB();

app.use("/api/users",usersRoutes);
app.use("/api/comments",commentsRoutes);
app.use("/api/posts",postsRoutes);
app.use("/api/auth",authRoutes);



module.exports = app;