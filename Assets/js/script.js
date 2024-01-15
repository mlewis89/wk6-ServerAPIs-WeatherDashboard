//HTML ELEMNETS
SearchButtonEL  = $('#Search-btn');
SeachDataEL = $('#search-text');

//GLOBAL: VARIABLES
storageKey = "wk6-WeatherDashboard";

APIkey = "206a083510fdb299f5bde1e92a72e4f7";
var currentWeather = {};

//Event handler for search
SearchButtonEL.on('click',function()
{
    var SearchText = SeachDataEL.val();
    updateLocalStorage(SearchText);
    getWeatherData_FromCityName(SearchText);
    renderPage();
});

//save search to local storage
function updateLocalStorage(newVal)
{
    var data = JSON.parse(localStorage.getItem(storageKey))
    if(data === undefined || data === null)
    {
        var data = [];
    }
    data.push(newVal);
    localStorage.setItem(storageKey,JSON.stringify(data));
}

//clear local storage

//get location lat and long - openweatrher map direct geocoding
function getWeatherData_FromCityName(city)
{   
    var apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q='+city+'&limit=1&appid='+APIkey;
    //var geocode = apiGet(url);
    fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
            console.log(data);
          getWeatherData_FromLatLong(data[0].lat,data[0].lon,city);
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
function getWeatherData_FromLatLong(lat,long)
{
    var apiUrl = 'http://api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='+long+'&appid='+APIkey
    
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
    
function displayWeather(weatherData)
{
    console.log(data);
    console.log(str);

}

function apiGet(apiUrl)
{
    fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          return data;
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to GitHub');
    });
}



function API_GET()
{}

//render page
function renderPage()
{

}

//init 
//load previous searches to page