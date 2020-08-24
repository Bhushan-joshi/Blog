const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash=require('connect-flash');
const session=require('express-session');
const mongosession=require('connect-mongodb-session')(session);
const multer  =require('multer');

const feedRoute = require('./Routers/feed');
const authRoute = require('./Routers/auth');

const app = express();
const MONGOURL='mongodb://localhost:27017/Blog';

const store = new mongosession({
    uri: MONGOURL,
    conllection: 'session'
});

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'images');
    },
    filename:(req,file,cb)=>{
        cb(null, Date.now()+'-'+file.originalname);
    }
    });

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(session({
    secret: "this is most secret thing",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

app.use(multer({storage:storage}).single('image'));

app.use(flash());

app.use(feedRoute);
app.use('/auth', authRoute);


mongoose.connect(MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true }).then(
    app.listen(3000,()=>{
        console.log('server started');
    })
).catch((err)=>{
    console.log(err);
});
