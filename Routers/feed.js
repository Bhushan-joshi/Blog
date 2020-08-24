const express = require('express');
const feedController = require('../controller/feedController');
const isAuth= require('../util/isAuth');
const Router = express.Router();

Router.get('/',feedController.getIndex);

Router.get('/create', isAuth,feedController.getCreatePost);
Router.post('/create',isAuth, feedController.postCreatePost);

Router.get('/update/:pid',isAuth, feedController.getUpdate);
Router.post('/update',isAuth, feedController.postUpdate);

Router.get('/detail/:pid',feedController.getDetails);

Router.get('/delete/:pid',isAuth, feedController.getDelete);

Router.post('/like/:pid',isAuth,feedController.postLike); 
Router.post('/dislike/:pid',isAuth,feedController.postDislike);
Router.post('/comment/:pid',isAuth,feedController.postComment); 


module.exports = Router;