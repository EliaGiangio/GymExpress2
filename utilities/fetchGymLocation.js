const { MAP_KEY } = require('../app.js');

async function fetchGymLocation(gym) {
    try {
        const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${gym.location}&apiKey=${MAP_KEY}`);
        const result = await response.json();
        // Get the first feature from the response
        const feature = result.features[0];
        if (feature) {
            const lon = feature.properties.lon;
            const lat = feature.properties.lat;
            return { lat, lon };
        }
    } catch (error) {
        console.error('Error fetching gym location:', error);
    }
}

module.exports = fetchGymLocation;