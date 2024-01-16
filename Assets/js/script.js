//HTML ELEMNETS
SearchButtonEL = $('#Search-btn');
SeachDataEL = $('#search-text');
PastCitiesEL = $('#PreviousSearchContainer');
TodayFocastEL = $('#todayForcast');
FiveDayFocastEL = $('#5DayForcast');

//GLOBAL: VARIABLES
storageKey = "wk6-WeatherDashboard";

APIkey = "206a083510fdb299f5bde1e92a72e4f7";
var currentWeather = {};

//Event handler for search
SearchButtonEL.on('click', function () {
    var SearchText = SeachDataEL.val();
    updateLocalStorage(SearchText);
    renderPage();
});

//save search to local storage
function updateLocalStorage(newVal) {
    var data = JSON.parse(localStorage.getItem(storageKey))
    if (data === undefined || data === null) {
        var data = [];
        data.push(newVal);
    }
    else if (data[data.length - 1].toLowerCase() != newVal.toLowerCase()) {
        data.push(newVal);
    }
    localStorage.setItem(storageKey, JSON.stringify(data));
}

//clear local storage

//get location lat and long - openweatrher map direct geocoding
function getWeatherData_FromCityName(city) {
    var apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + APIkey;
    //var geocode = apiGet(url);
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    getWeatherData_FromLatLong(data[0].lat, data[0].lon);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to openmweathermap.org-geocode');
        });
}

//API Get Location weather
function getWeatherData_FromLatLong(lat, long) {
    var apiUrl = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + long + '&units=metric&appid=' + APIkey;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayWeather(data);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to openmweathermap.org-forcast');
        });
}

function getDailyWeather(weatherData, numDays) {
    if (numDays === undefined) {
        var numDays = 5;
    }
    var dayArr = [];
    var dataIndex = parseInt(0);
    for (var i = 0; i < numDays; i++) {
        var day = {};
        var notEndofDay = true;

        day.date = dayjs.unix(weatherData.list[dataIndex].dt);
        day.description = [];
        do {
            day.description.push(weatherData.list[dataIndex].weather[0]);
            if (day.temp_min) {
                day.temp_min = Math.min(day.temp_min, weatherData.list[dataIndex].main.temp_min);
            }
            else {
                day.temp_min = weatherData.list[dataIndex].main.temp_min;
            }
            if (day.temp_max) {
                day.temp_max = Math.max(day.temp_max, weatherData.list[dataIndex].main.temp_max);
            }
            else {
                day.temp_max = weatherData.list[dataIndex].main.temp_max;
            }
            if (day.wind) {
                day.wind = Math.max(day.wind, weatherData.list[dataIndex].wind.speed);
            }
            else {
                day.wind = weatherData.list[dataIndex].wind.speed;
            }
            if (day.humidity) {
                day.humidity = Math.max(day.humidity, weatherData.list[dataIndex].main.humidity);
            }
            else {
                day.humidity = weatherData.list[dataIndex].main.humidity;
            }

            notEndofDay = day.date.format('D') == dayjs.unix(weatherData.list[dataIndex + 1].dt).format('D');

            dataIndex++;
        } while (notEndofDay)
        dayArr.push(day);
    }
    return dayArr;

}

function displayWeather(weatherData) {
    console.log(weatherData);
    var dailyWeather = getDailyWeather(weatherData);

    //today's forcast
    TodayFocastEL.append($('<h2></h2>').text(weatherData.city.name + ' (' + dayjs.unix(weatherData.list[0].dt).format('DD/MM/YYYY') + ')'));
    TodayFocastEL.append($('<p></p>').text('Temp: ' + weatherData.list[0].main.temp + ' (min: ' + weatherData.list.main.temp_min + ', max: ' + weatherData.list.main.temp_max + ' )'));
    TodayFocastEL.append($('<p></p>').text('Wind: ' + weatherData.list[0].wind.speed + ' m/sec'));
    TodayFocastEL.append($('<p></p>').text('Humidity: ' + weatherData.list[0].main.humidty));


    //5day forcasts
    for (var i = 0; i <= 5; i++) {
        var weatherEL = $('<div></div>');
        weatherEL.append($('<h3></h3>').text(dayjs.unix(weatherData.list[0].dt).format('DD/MM/YYYY')));
        weatherEL.append($('<p></p>').text('Temp: ' + weatherData.list[0].main.temp + ' (min: ' + weatherData.list.main.temp_min + ',max: ' + weatherData.list.main.temp_max + ' )'));
        weatherEL.append($('<p></p>').text('Wind: ' + weatherData.list[0].wind.speed + ' m/sec'));
        weatherEL.append($('<p></p>').text('Humidity: ' + weatherData.list[0].main.humidty));
        FiveDayFocastEL.append(weatherEL);
    }
}

//render page
function renderPage() {
    PastCitiesEL.innerHTML = '';
    var cities = JSON.parse(localStorage.getItem(storageKey));
    if (cities !== null || cities !== undefined) {
        for (var i = 0; i < cities.length; i++) {
            var li = $('<li></li>').text(cities[i])
            PastCitiesEL.append(li);
        }
        getWeatherData_FromCityName(cities[cities.length - 1]);
    }
}

//init 
//load previous searches to page
renderPage();
