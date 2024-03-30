const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const GymSchema = new Schema({
    title: String,
    price: Number,
    image: String,
    description: String,
    location: String,
    coordinates: {
        lat: Number,
        lon: Number
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

//needed for when we delete the gym, all the attached reviews will also be deleted
GymSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Gym', GymSchema);