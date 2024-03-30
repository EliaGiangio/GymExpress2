const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const gyms = require('../controllers/gyms')
const ExpressError = require('../utilities/ExpressError');
const { gymSchema } = require('../schemas.js');
const passport = require('passport');
const { isLoggedIn } = require('../middleware.js');



//following block we use joi to create a joi object which we'll use for validation before saving our actual gym schema
const validateGym = (req, res, next) => {
    const { error } = gymSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else next();
}

router.get('/', catchAsync(gyms.index));

router.get('/new', isLoggedIn, gyms.renderNewForm);

router.post('/', isLoggedIn, validateGym, catchAsync(gyms.create));

router.get('/:id', catchAsync(gyms.show));

router.get('/:id/edit', gyms.renderEditForm);

router.put('/:id', validateGym, catchAsync(gyms.update));

router.delete('/:id', catchAsync(gyms.delete));

module.exports = router;