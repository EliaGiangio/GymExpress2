const mongoose = require('mongoose');
const Gym = require('../models/gym');
const cities = require('./cities')
const { adjectives, nouns } = require('./seedNames')
const fetchGymLocation = require('../utilities/fetchGymLocation');
main().catch(err => console.log(err));


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/gymExpress');
    console.log("Database connected!");
}

const sample = (array) => array[Math.floor(Math.random() * 20)];

const seedDB = async () => {
    await Gym.deleteMany();
    for (let i = 0; i < 6; i++) {
        const randomizer = Math.floor(Math.random() * cities.length);
        const price = Math.floor(Math.random() * 20);
        const g = new Gym({
            title: `${sample(adjectives)}  ${sample(nouns)}`,
            author: '66044af0dbfabe121d5f73a7',
            location: `${cities[randomizer].name}, ${cities[randomizer].region}`,
            image: 'https://classpass-res.cloudinary.com/image/upload/f_auto/q_auto/x48ab371193xxthostaz.jpg',
            description: 'Elevate Your Home Workouts: Achieve Fitness Goals with Convenience and Comfort.',
            price
        })
        const { lat, lon } = await fetchGymLocation(g)
        g.coordinates.lat = lat;
        g.coordinates.lon = lon;
        await g.save();
    }
}

seedDB();