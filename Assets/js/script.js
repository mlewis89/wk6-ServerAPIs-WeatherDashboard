//HTML ELEMNETS
SearchButtonEL = $('#Search-btn');
SeachDataEL = $('#search-text');
PastCitiesEL = $('#PreviousSearchContainer');
TodayFocastEL = $('#todayForcast');
FiveDayFocastEL = $('#FiveDayForcast');

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

PastCitiesEL.on('click', function (event) {
    updateLocalStorage(event.target.textContent);
    renderPage();

});

//save search to local storage
function updateLocalStorage(newVal) {
    var data = JSON.parse(localStorage.getItem(storageKey))
    newVal = newVal.toUpperCase();
    var temp = data.includes(newVal);
    if (data === undefined || data === null) {
        var data = [];
        data.push(newVal);
    }
    //else if (data.[data.length - 1].toLowerCase() != newVal.toUpperCase()) {
    else if (data.includes(newVal)) { //if already exists move it to end of list
        var indexof = data.indexOf(newVal);
        data.push(data.splice(indexof, 1)[0]);       
    } else {
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
    for (var i = 0; i <= numDays; i++) {
        var day = {};
        var notEndofDay = true;

        day.date = dayjs.unix(weatherData.list[dataIndex].dt);
        day.description = [];
        do {
            var iconStr = weatherData.list[dataIndex].weather[0].icon.slice(0, -1) //remove day night charator on icon
            if (day.description[day.description.length - 1] != iconStr) {
                day.description.push(iconStr);
            }
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
            if (dataIndex + 1 < weatherData.list.length) { //test for end of data
                notEndofDay = day.date.format('D') == dayjs.unix(weatherData.list[dataIndex + 1].dt).format('D');
            } else {
                notEndofDay = false;
            }

            dataIndex++;
        } while (notEndofDay)
        dayArr.push(day);
    }
    return dayArr;

}

function displayWeather(weatherData) {
    console.log(weatherData);
    var dailyWeather = getDailyWeather(weatherData);

    TodayFocastEL.empty();
    FiveDayFocastEL.empty();

    //today's forcast
    TodayFocastEL.append($('<h2></h2>').text(weatherData.city.name + ' (' + dailyWeather[0].date.format('DD/MM/YYYY') + ')'));
    var imagesBlock = $('<div></div>').attr('class', 'weather-icon-container')
    for (var j = 0; j < dailyWeather[0].description.length; j++) {
        imagesBlock.append($('<img></img>').attr('src', 'https://openweathermap.org/img/wn/' + dailyWeather[0].description[j] + 'd.png'));
    }
    TodayFocastEL.append(imagesBlock);

    TodayFocastEL.append($('<p></p>').text('Temp: ' + weatherData.list[0].main.temp + ' (min: ' + dailyWeather[0].temp_min + '°C, max: ' + dailyWeather[0].temp_max + '°C )'));
    TodayFocastEL.append($('<p></p>').text('Wind: ' + dailyWeather[0].wind + ' m/sec'));
    TodayFocastEL.append($('<p></p>').text('Humidity: ' + dailyWeather[0].humidity + ' %'));


    //5day forcasts
    for (var i = 1; i < dailyWeather.length; i++) {
        var weatherEL = $('<div></div>');
        weatherEL.attr('class', 'col fiveday-itme');
        weatherEL.append($('<h3></h3>').text(dailyWeather[i].date.format('DD/MM/YYYY')));
        //weatherEL.append($('<img></img>').attr('src','https://openweathermap.org/img/wn/' + '10d' + '@2x.png'));
        var imagesBlock = $('<div></div>').attr('class', 'weather-icon-container')
        for (var j = 0; j < dailyWeather[i].description.length; j++) {
            imagesBlock.append($('<img></img>').attr('src', 'https://openweathermap.org/img/wn/' + dailyWeather[i].description[j] + 'd.png'));
        }
        weatherEL.append(imagesBlock);
        weatherEL.append($('<p></p>').text('Temp: min: ' + dailyWeather[i].temp_min + '°C, max: ' + dailyWeather[i].temp_max + '°C'));
        weatherEL.append($('<p></p>').text('Wind: ' + dailyWeather[i].wind + ' m/sec'));
        weatherEL.append($('<p></p>').text('Humidity: ' + dailyWeather[i].humidity + ' %'));
        FiveDayFocastEL.append(weatherEL);
    }
}

//render page
function renderPage() {
    PastCitiesEL.empty();
    var cities = JSON.parse(localStorage.getItem(storageKey));
    if (cities !== null || cities !== undefined) {
        for (var i = 0; i < cities.length; i++) {
            var li = $('<button></button>').text(cities[i])
            li.attr('class', 'btn btn-secondary');
            PastCitiesEL.prepend(li);
        }
        getWeatherData_FromCityName(cities[cities.length - 1]);
    }
}

//init 
//load previous searches to page
renderPage();
