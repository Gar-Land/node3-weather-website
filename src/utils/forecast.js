const request = require("request");

const getUserWeather = (apiKey, lat, lon, callback) => {
    const apiRequest = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    request({url: apiRequest, json: true}, (error, response) => {
        if (error) {
            callback("Failed to connect to weather API endpoint", undefined);
        } else if (response.body.message) {
            callback(undefined, `${String(response.body.cod)} ${response.body.message}`);
        } else {
            const userWeather = response.body;
            const {name} = userWeather;
            const {country} = userWeather.sys;
            const {main, description} = userWeather.weather[0];
            const {temp, feels_like, humidity} = userWeather.main;
            callback(undefined, `Currently at ${name}, ${country}: The wheather looks ${main.toLowerCase()} with a ${description.toLowerCase()}. At a temperture of ${temp}°C with a sensation of ${feels_like}°C due to a humidity of ${humidity}.`);
        }
    });
}

module.exports = getUserWeather;