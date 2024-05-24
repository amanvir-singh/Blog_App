const express = require('express');
const bodyParser = require('body-parser');
const usersRoutes = require('./routers/users');
const commentsRoutes = require('./routers/comments');
const postsRoutes = require('./routers/posts');
const postByUser = require('./routers/postByUser');

const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/",usersRoutes)
app.use("/",commentsRoutes)
app.use("/",postsRoutes)
app.use("/",postByUser)

//app.use(express.json)

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        msg: 'Internal Server Error',
    });
};
app.use(errorHandler);


module.exports = app;
