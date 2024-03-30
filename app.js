if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const ExpressError = require('./utilities/ExpressError');
const Gym = require('./models/gym');
const Review = require('./models/review');
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local')
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');


const MAP_KEY = process.env.MAP_KEY;
module.exports = {
    MAP_KEY: process.env.MAP_KEY
}

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/gymExpress';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});

store.on("error", function (e) {
    console.log('STORE ERROR', e)
});


const sessionConfig = {
    store,
    secret: "This is a secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
app.use(mongoSanitize()); //used to avoid injections into the mongo db with instances of $

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//we have access to these in every single template/view
app.use((req, res, next) => {
    res.locals.currentUser = req.user; //req.user is provvided by passport
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


const gymRoutes = require('./routes/gyms');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
main().catch(err => console.log(err));

app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate)
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use('/', userRoutes);
app.use('/gyms', gymRoutes);
app.use('/gyms/:id/reviews', reviewRoutes);

async function main() {
    await mongoose.connect(dbUrl);
    console.log("Database connected!");
};

app.get('/', (req, res) => {
    res.render('home');
});


app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no, something went wrong!';
    res.status(statusCode).render('error', { err });

});

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`SERVER RUNNING - Port:${port}`);
});