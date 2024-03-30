const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const User = require('../models/user');
const passport = require('passport');

module.exports.registrationForm = (req, res) => {
    res.render('users/register');
};
module.exports.registration = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'FINALLY! YOU MADE IT');
            res.redirect('/gyms');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    };
};
module.exports.loginForm = (req, res) => {
    res.render('users/login');
};

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back');
    res.redirect('/gyms');
};
module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/gyms');
    });
};


