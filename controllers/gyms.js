const Gym = require('../models/gym');
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const fetchGymLocation = require('../utilities/fetchGymLocation');
const { gymSchema } = require('../schemas.js');
const passport = require('passport');
const { isLoggedIn } = require('../middleware.js');




module.exports.index = async (req, res) => {
    const gyms = await Gym.find({});
    res.render('gym/index', { gyms });
};

module.exports.renderNewForm = async (req, res) => {
    res.render('gym/new')
};

module.exports.create = async (req, res, next) => {
    const gym = new Gym(req.body.gym);
    gym.author = req.user._id;
    const { lat, lon } = await fetchGymLocation(gym)
    gym.coordinates.lat = lat;
    gym.coordinates.lon = lon;
    await gym.save();
    req.flash('success', 'Your home gym is now in the system!');
    res.redirect(`/gyms/${gym._id}`)
};

module.exports.show = async (req, res) => {
    const gym = await Gym.findById(req.params.id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');
    if (!gym) {
        req.flash('error', 'Cannot find what you are looking for')
        res.redirect('/gyms')
    };
    res.render('gym/show', { gym });
};

module.exports.renderEditForm = async (req, res) => {
    const gym = await Gym.findById(req.params.id)
    if (!gym) {
        req.flash('error', 'Cannot find what you are looking for')
        res.redirect('/gyms')
    };
    res.render('gym/edit', { gym });
};

module.exports.update = async (req, res) => {
    const { id } = req.params;
    const gym = await Gym.findByIdAndUpdate(id, { ...req.body.gym }, { new: true });
    req.flash('success', 'The info has been succesfully updated');
    res.redirect(`/gyms/${gym._id}`);
};


module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await Gym.findByIdAndDelete(id);
    res.redirect('/gyms');
};

