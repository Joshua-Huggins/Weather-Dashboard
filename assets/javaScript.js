// variables needed from html
const cityInputE1 = document.querySelector(".city-input");
const SearchBtn = document.querySelector(".search-btn");
const currentWeather = document.querySelector(".current-weather")
const weatherCards = document.querySelector(".weather-cards");
const ApiKey = "70a4af09920edce5e3b0c7aabf7674b1" // Api key for openweathermap

// this will create the weather cards for the forecast.
// comeback to see if we can make code nicer. I dont like the way it looks like this.
// collapsed the code looking at it is pain.
const creatWeatherCards = (cityName, weatherItem, index) => {
    if(index === 0) { // Gets all the info for the main weather card
        return `<div class="more-details">
                <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                <h4>Temperature:${(weatherItem.main.temp -273.15).toFixed(2)}C</h4>
                <h4>Wind:${weatherItem.wind.speed}M/S</h4>
                <h4>Humidity:${weatherItem.main.humidity}%</h4>
                <h4>Min/Max Temp:${(weatherItem.main.temp_min -273.15).toFixed(2)}C/${(weatherItem.main.temp_max -273.15).toFixed(2)}C</h4>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h4>Current Conditions: ${weatherItem.weather[0].description}</h4>
                </div>`;
    } else { // creates the 5 day forcast 
        return` <li class="card">
                    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h4>Temp: ${(weatherItem.main.temp -273.15).toFixed(2)}C</h4>
                    <h4>Wind: ${weatherItem.wind.speed}M/S</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                    <h4>Min/Max Temp:  ${(weatherItem.main.temp_min -273.15).toFixed(2)}C/${(weatherItem.main.temp_max -273.15).toFixed(2)}C</h4>
                </li>`;
    }
}

const WeatherDetails = (cityName, lat, lon) => {
    const ForecastApiURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${ApiKey}`;

    //fetch request to call on the api for forcast using the lon and lat done using
    // the data from the geocode api to get city coords
    fetch(ForecastApiURL).then(res => res.json()).then(data => {
        console.log(data);// test to see what data the forecast is giving back
        // used to get only one forecast per day
        const uniqueForecastDays = [];
        const fiveDayForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });
        // Clear blank/test/previous data
        cityInputE1.value = "";
        weatherCards.innerHTML = "";
        currentWeather.innerHTML = "" 

        console.log(fiveDayForecast);// Test to see that we get unique days get what forecast
        // Adds the 5 weather cards after the test ones, will remove the test/blank/previous cards later
        fiveDayForecast.forEach((weatherItem, index) => {
            if(index === 0) {
                currentWeather.insertAdjacentHTML("beforeend", creatWeatherCards(cityName, weatherItem, index));
            } else {
                weatherCards.insertAdjacentHTML("beforeend", creatWeatherCards(cityName, weatherItem, index));
            }
        });

    }).catch(() => {
        alert("An error has occured getting the forecast");
    });
}

// Gets user input for city and will remove extra spaces, will return if input is empty
const CityCord = () => {
    const cityName = cityInputE1.value.trim();
    if(!cityName) return; 

    console.log(cityName); // test to see user input is being used as value

    // We need this in order to get the Coords for the actual forecast
    const GeoCodeApiURL =`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${ApiKey}`;

    // Will get all data from the api above, we just need name, latitude, and longitude
    fetch(GeoCodeApiURL).then(res => res.json()).then(data => {
        console.log(data); // test to see what info we are getting back
        const { name, lat, lon } = data[0];
        WeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occurred while fetching the coordinates.");
    });
} 

// when search button is clicked run function CityCord to get user input.
SearchBtn.addEventListener("click", CityCord);