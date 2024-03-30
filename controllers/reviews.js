const { reviewSchema } = require('../schemas.js');
const catchAsync = require('../utilities/catchAsync');
const Gym = require('../models/gym');
const Review = require('../models/review');
const ExpressError = require('../utilities/ExpressError');
const { isLoggedIn } = require('../middleware.js');


module.exports.createReview = async (req, res) => {
    const gym = await Gym.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    gym.reviews.push(review);
    await review.save();
    await gym.save();
    req.flash('success', 'Your review has been published')
    res.redirect(`/gyms/${gym._id}`);

};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    const gym = await Gym.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Your review has been deleted')
    res.redirect(`/gyms/${gym._id}`);
};