const Post = require('../models/Post');

exports.getIndex = (req, res, next) => {
    Post.find({}).sort({ created_on: 'descending' }).populate('author').then(post => {
        res.render('feed/index', {
            Title: 'Blog',
            msg: req.flash('successlogin'),
            isauth: req.session.isLoggedin,
            post: post,
            usrimg: ''
        });
    });
};


exports.getCreatePost = (req, res, next) => {
    res.render('feed/create', {
        Title: 'Create',
        isauth: req.session.isLoggedin,
    });
};

exports.postCreatePost = (req, res, next) => {
    const newPost = new Post({
        title: req.body.title,
        content: req.body.content,
        author: req.session.user._id,
    });
    newPost.save().then(() => {
        res.redirect('/');
    }).catch(err => {
        console.log(err);
    });
};


exports.getUpdate = (req, res, next) => {
    Post.findById(req.params.pid).then(post => {
        res.render('feed/update', {
            Title: 'update post',
            isauth: req.session.isLoggedin,
            post: post,
        });
    }).catch(err => {
        console.log(err);
    });
};

exports.postUpdate = (req, res, next) => {
    Post.findOne({ _id: req.body.pid }).then(post => {
        post.title = req.body.title;
        post.content = req.body.content;
        post.save();
        req.flash('profileerr', 'post updated !');
        res.redirect('/auth/profile');
    }).catch(err => {
        console.log(err);
    });
};


exports.getDelete = (req, res, next) => {
    Post.findByIdAndDelete(req.params.pid).then(dontKonw => {
        req.flash('profileerr', 'post Deleted !');
        res.redirect('/auth/profile');
    }).catch(err => {
        console.log(err);
    });
};

exports.getDetails = (req, res, next) => {
    const pid = req.params.pid;
    Post.findById(pid).populate('author').then(post => {
        res.render('feed/details', {
            Title: post.title,
            post: post,
            isauth: req.session.isLoggedin,
            user: req.session.user,
            msg: req.flash('details'),
        });
    }).catch(err => {
        console.log(err);
    });
};

exports.postLike = (req, res, next) => {
    const userid = req.session.user._id.toString();
    const pid = req.params.pid;
    Post.findById(pid).then(post => {
        const doeslike = post.likes.includes(userid) || post.dislikes.includes(userid);
        if (!doeslike) {
            post.likes.push(userid);
            post.save();
        } else {
            res.redirect(`/detail/${pid}`);
        }
    }).then(result => {
        res.redirect(`/detail/${pid}`);
    }).catch(err => {
        // console.log(err);
    });
};

exports.postDislike = (req, res, next) => {
    const userid = req.session.user._id.toString();
    const pid = req.params.pid;
    Post.findById(pid).then(post => {
        const doeslike = post.likes.includes(userid) || post.dislikes.includes(userid);
        if (!doeslike) {
            post.dislikes.push(userid);
            post.save();
        } else {
            res.redirect(`/detail/${pid}`);
        }
    }).then(result => {
        res.redirect(`/detail/${pid}`);
    }).catch(err => {
        console.log(err);
    });
};

exports.postComment = (req, res, next) => {
    const pid = req.params.pid;
    const Comment={
        username:req.session.user.name,
        data:req.body.comment
    };
    Post.findById(pid).then(post => {
        post.comment.push(Comment);
        post.save().then(result=>{
            req.flash('details','comment added !');
            res.redirect(`/detail/${pid}`);
        }).catch(err=>{
            console.log(err);
        });
    }).catch(err => {
        console.error(err);
    });
};