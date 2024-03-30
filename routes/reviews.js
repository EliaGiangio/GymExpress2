const express = require('express');
const router = express.Router({ mergeParams: true }); //merge params used here so we can access the params of gyms
const { reviewSchema } = require('../schemas.js');
const catchAsync = require('../utilities/catchAsync');
const Gym = require('../models/gym');
const Review = require('../models/review');
const ExpressError = require('../utilities/ExpressError');
const { isLoggedIn } = require('../middleware.js');
const reviews = require('../controllers/reviews')




const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else next();
}

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', catchAsync(reviews.deleteReview))

module.exports = router;