const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Post = require('../models/Post');

exports.getSignin = (req, res, next) => {
    res.render('auth/login', {
        Title: 'Login',
        msg: req.flash('loginerr'),
        usr: '',
        isauth: req.session.isLoggedin,
    });
};
exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        Title: 'Signup',
        msg: '',
        usr: '',
        isauth: req.session.isLoggedin,
    });
};
exports.postSignup = (req, res, next) => {
    const errors = [];
    const usr = req.body;

    if (usr.name.length <= 3) {
        errors.push('name must be greater than 3 charaters');
    }
    if (usr.password.length <= 6) {
        errors.push('password must be greater than 6 charaters');
    }
    if (usr.password !== usr.password2) {
        errors.push('password did not matches');
    }

    if (errors.length === 0) {
        User.findOne({ email: usr.email }).then((user) => {
            if (user) {
                errors.push('Email already taken!');
                res.render('auth/signup', {
                    Title: 'Signup',
                    msg: errors,
                    usr: usr,
                    isauth: req.session.isLoggedin
                });
            }
            else {
                bcrypt.genSalt(13).then(salt => {
                    bcrypt.hash(usr.password, salt).then(hash => {
                        const newUser = new User({
                            name: usr.name,
                            email: usr.email,
                            password: hash,
                            imageUrl: 'images/default.jpg'
                        });
                        newUser.save();
                        req.flash('loginerr', 'account created ! you may login !');
                        res.redirect('/auth/login');
                    }).catch((err) => {
                        console.log(err);
                    });
                }).catch((err) => {
                    console.log(err);
                });
            }
        });
    } else {
        res.render('auth/signup', {
            Title: 'Signup',
            msg: errors,
            usr: usr,
            isauth: req.session.isLoggedin
        });
    }
};




exports.postSignin = (req, res, next) => {
    const password = req.body.password;
    if (password) {
        User.findOne({ email: req.body.email }).then(user => {
            if (!user) {
                req.flash('loginerr', 'Invalid Email or Password!');
                res.redirect('/auth/login');
            }
            bcrypt.compare(password, user.password).then(domatch => {
                if (domatch) {
                    req.session.user = user;
                    req.session.isLoggedin = true;
                    req.session.save(err => {
                        if (err) { console.log(err); }
                        req.flash('successlogin', 'Login Successfully!');
                        res.redirect('/');
                    });
                } else {
                    req.flash('loginError', 'Invalid Email or Password!');
                    res.redirect('/auth/login');
                }
            }).catch(err => {
                console.log(err);
            });

        }).catch(err => {
            console.log(err);
        });
    } else {
        req.flash('loginError', 'Invalid Email or Password!');
        res.redirect('/auth/login');
    }
};

exports.getlogout = (req, res, next) => {
    req.session.destroy();
    res.redirect('/auth/login');
    next();
};


exports.getProfile = (req, res, next) => {
    Post.find({ author: req.session.user }).sort({ created_on: 'descending' }).then(posts => {
        res.render('auth/profile', {
            Title: 'Profile',
            isauth: req.session.isLoggedin,
            usr: req.session.user,
            post: posts,
            msg: req.flash('profileerr'),
        });
    }).catch(err => {
        console.log(err);
    });
};


exports.postChangeMail = (req, res, next) => {
    User.findOne({ email: req.body.oldemail }).then(user => {
        User.findOne({ email: req.body.email }).then(doesExists => {
            console.log(doesExists);
            if (!doesExists) {
                user.email = req.body.email;
                user.save();
                req.session.destroy();
                res.redirect('/auth/login');

            } else {

                req.flash('profileerr', 'email is already taken!');
                res.redirect('/auth/profile');
            }
        }).catch(err => {
            console.log(err);
        });
    }).catch(err => {
        console.log(err);
    });
};


exports.postImage = (req, res, next) => {
    User.findById(req.session.user._id).then(usr => {
        usr.imageUrl = req.file.path;
        req.session.user.imageUrl = req.file.path;
        usr.save();
        req.flash('profileerr', 'Image uploaded successfully !');
        res.redirect('/auth/profile');
    }).catch(err => {

    });
};