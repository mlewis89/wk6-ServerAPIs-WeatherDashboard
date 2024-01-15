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
            alert('Unable to connect to openmweathermap.org');
        });
}

//API Get Location weather
function getWeatherData_FromLatLong(lat, long) {
    var apiUrl = 'api.openweathermap.org/data/2.5/forecast/daily?lat=' + lat + '&lon=' + long + '&cnt=6&appid=' + APIkey

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
            alert('Unable to connect to openmweathermap.org');
        });
}

function displayWeather(weatherData) {
    console.log(weatherData);
    //today's forcast
    TodayFocastEL.append($('<h2></h2>').text(weatherData.city.name + ' (' + dayjs.unix(weatherData.list[0].dt).format('DD/MM/YYYY') + ')'));
    TodayFocastEL.append($('<p></p>').text('Temp: ' + weatherData.list[0].main.temp' (min: '+weatherData.list.main.temp_min+',max: '+weatherData.list.main.temp_max+' )'));
    TodayFocastEL.append($('<p></p>').text('Wind: ' + weatherData.list[0].wind.speed' km/h'));
    TodayFocastEL.append($('<p></p>').text('Humidity: ' + weatherData.list[0].main.humidty));
    

   //5day forcasts
    for(var i = 0;i<=5;i++)
    {
        var weatherEL = $('<div></div>');
        weatherEL.append($('<h3></h3>').text(dayjs.unix(weatherData.list[0].dt).format('DD/MM/YYYY')));
        weatherEL.append($('<p></p>').text('Temp: ' + weatherData.list[0].main.temp' (min: '+weatherData.list.main.temp_min+',max: '+weatherData.list.main.temp_max+' )'));
        weatherEL.append($('<p></p>').text('Wind: ' + weatherData.list[0].wind.speed' km/h'));
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
