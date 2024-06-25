const request = require("request");

const getUserCoordinates = (apiKey, {city, state, country}, callback) => {
    const apiRequest = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&limit=1&appid=${apiKey}`;
    //const userLatAndLon = []

    request({url: apiRequest, json: true}, (error, response) => {
        if (error) {
            callback("Failed to connect to geocoding API endpoint", undefined);
        } else if (response.body.message) {
            callback(undefined, `${String(response.body.cod)} ${response.body.message}`);
        } else {
            callback(undefined, response.body[0]);
        }
    });
};

module.exports = getUserCoordinates;