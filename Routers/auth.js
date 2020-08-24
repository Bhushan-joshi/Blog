const express=require('express');
const authController=require('../controller/authController');
const isAuth= require('../util/isAuth');
const Router =express.Router();

Router.get('/login',authController.getSignin);
Router.post('/login',authController.postSignin);

Router.get('/signup',authController.getSignup);
Router.post('/signup',authController.postSignup);

Router.get('/profile',isAuth,authController.getProfile);

Router.post('/profile/image',isAuth,authController.postImage);

Router.post('/profile/change-email',isAuth,authController.postChangeMail);

Router.get('/logout',authController.getlogout);


module.exports=Router;