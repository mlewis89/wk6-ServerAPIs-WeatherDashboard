//HTML ELEMNETS
SearchInputEL = $('#searchInput'); //search form element
SearchDataEL = $('#search-text');    //search value
PastCitiesEL = $('#PreviousSearchContainer'); //elment to store past searches
TodayFocastEL = $('#todayForcast'); //elemnt to stor today's forcast
FiveDayFocastEL = $('#FiveDayForcast'); //element to store 5 day forcast

//GLOBAL: VARIABLES
storageKey = "wk6-WeatherDashboard"; //storage key name to use in local storage

APIkey = "206a083510fdb299f5bde1e92a72e4f7"; //weather api key

//Event handler for search form submit
SearchInputEL.on('submit', function (event) {
    event.preventDefault(); //prevent clearing the search bar
    var SearchText = SearchDataEL.val(); //get search value
    updateLocalStorage(SearchText); //save search to local storage
    renderPage(); //update data on page
});

//event handler for when a previous search is selected
PastCitiesEL.on('click', function (event) {
    updateLocalStorage(event.target.textContent);  //record selection in local storage
    renderPage(); //update page data
});

//save last search to local storage
function updateLocalStorage(newVal) {
    var data = JSON.parse(localStorage.getItem(storageKey)) //get exisiting local storage
    newVal = newVal.toUpperCase(); //make  text uppercase
    if (data === undefined || data === null) { //if data is empty define array and push new value
        var data = [];
        data.push(newVal);
    }
    else if (data.includes(newVal)) { //if already exists move it to end of list
        var indexof = data.indexOf(newVal);
        data.push(data.splice(indexof, 1)[0]);
    } else {
        data.push(newVal); //otherwise just add the search to the end of the list
    }
    localStorage.setItem(storageKey, JSON.stringify(data)); //send updated data back to local storage
}

//get location lat and long - openweatrher map direct geocoding
function getWeatherData_FromCityName(city) {
    var apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + APIkey;
    //var geocode = apiGet(url);
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    getWeatherData_FromLatLong(data[0].lat, data[0].lon); //get weather forcast
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
                    displayWeather(data); //display weather datat on page
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to openmweathermap.org-forcast');
        });
}

//process weather data into usable form
function getDailyWeather(weatherData, numDays) {
    if (numDays === undefined) { //if num days is undefined set default
        var numDays = 5;
    }
    var dayArr = []; //used to return an array of daily weather values
    var dataIndex = parseInt(0); //used to tracxk position in original weather data
    for (var i = 0; i <= numDays; i++) {
        var day = {}; //used to store a daily data
        var notEndofDay = true;

        day.date = dayjs.unix(weatherData.list[dataIndex].dt); //store the date of active day
        do {
            var iconStr = weatherData.list[dataIndex].weather[0].icon.slice(0, -1) //remove day night charator on icon - pulling back to number
            if (day.description) { //if descript already existsin day obj
                if (parseInt(day.description) < parseInt(iconStr)) { //use icon number to build priority for display
                    day.description = iconStr;
                }
            } else {
                day.description = iconStr;
            }
            if (day.temp_min) { //if temp_min already exists in day obj
                day.temp_min = Math.min(day.temp_min, weatherData.list[dataIndex].main.temp_min); 
            }
            else {
                day.temp_min = weatherData.list[dataIndex].main.temp_min;
            }
            if (day.temp_max) { //if temp_max already exists in day obj
                day.temp_max = Math.max(day.temp_max, weatherData.list[dataIndex].main.temp_max);
            }
            else {
                day.temp_max = weatherData.list[dataIndex].main.temp_max;
            }
            if (day.wind) { //if wind already exists in day obj
                day.wind = Math.max(day.wind, weatherData.list[dataIndex].wind.speed);
            }
            else {
                day.wind = weatherData.list[dataIndex].wind.speed;
            }
            if (day.humidity) { //if humidity already exists in day obj
                day.humidity = Math.max(day.humidity, weatherData.list[dataIndex].main.humidity);
            }
            else {
                day.humidity = weatherData.list[dataIndex].main.humidity;
            }
            if (dataIndex + 1 < weatherData.list.length) { //test for end of data
                notEndofDay = day.date.format('D') == dayjs.unix(weatherData.list[dataIndex + 1].dt).format('D'); //create booleen - true if next data point is a different day
            } else {
                notEndofDay = false;
            }

            dataIndex++;
        } while (notEndofDay)
        dayArr.push(day); //push day obj to DayArr
    }
    return dayArr;

}

//display weather forcast data
function displayWeather(weatherData) {
    var dailyWeather = getDailyWeather(weatherData); //process raw weather data to daily forcast

    //empty html sections of exisiting data.
    TodayFocastEL.empty();
    FiveDayFocastEL.empty();

    //build today's forcast block
    TodayFocastEL.append($('<h2></h2>').text(weatherData.city.name + ' (' + dailyWeather[0].date.format('DD/MM/YYYY') + ')'));
    var imagesBlock = $('<div></div>').attr('class', 'weather-icon-container')
    imagesBlock.append($('<img></img>').attr('src', 'https://openweathermap.org/img/wn/' + dailyWeather[0].description + 'd.png'));
    TodayFocastEL.append(imagesBlock);

    TodayFocastEL.append($('<p></p>').text('Temp: ' + weatherData.list[0].main.temp + ' (min: ' + dailyWeather[0].temp_min + '°C, max: ' + dailyWeather[0].temp_max + '°C )'));
    TodayFocastEL.append($('<p></p>').text('Wind: ' + dailyWeather[0].wind + ' m/sec'));
    TodayFocastEL.append($('<p></p>').text('Humidity: ' + dailyWeather[0].humidity + ' %'));


    //build 5day forcasts block
    for (var i = 1; i < dailyWeather.length; i++) {
        var weatherEL = $('<div></div>');
        weatherEL.attr('class', 'col-sm-5 col-lg-2  fiveday-itme');
        weatherEL.append($('<h5></h5>').text(dailyWeather[i].date.format('DD/MM/YYYY')));
        var imagesBlock = $('<div></div>').attr('class', 'weather-icon-container')
        imagesBlock.append($('<img></img>').attr('src', 'https://openweathermap.org/img/wn/' + dailyWeather[i].description + 'd.png'));
        weatherEL.append(imagesBlock);
        weatherEL.append($('<p></p>').text('Temp: min: ' + dailyWeather[i].temp_min + '°C, max: ' + dailyWeather[i].temp_max + '°C'));
        weatherEL.append($('<p></p>').text('Wind: ' + dailyWeather[i].wind + ' m/sec'));
        weatherEL.append($('<p></p>').text('Humidity: ' + dailyWeather[i].humidity + ' %'));
        FiveDayFocastEL.append(weatherEL);
    }
}

//render page with all data
function renderPage() {
    //empty previous search values from html
    PastCitiesEL.empty();
    //read values from local storage
    var cities = JSON.parse(localStorage.getItem(storageKey));
    if (cities !== null && cities !== undefined) { //check for empty data
        //build previous search html elements
        for (var i = 0; i < cities.length; i++) {
            var li = $('<button></button>').text(cities[i])
            li.attr('class', 'btn btn-secondary');
            PastCitiesEL.prepend(li);
        }
        //search weather data
        getWeatherData_FromCityName(cities[cities.length - 1]);
    }
}

//init 
//load previous searches and weather data to page
renderPage();
