const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const User = require('../models/user');
const passport = require('passport');
const users = require('../controllers/users');

router.get('/register', users.registrationForm);

router.post('/register', catchAsync(users.registration))

router.get('/login', users.loginForm);

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout', users.logout);

module.exports = router;