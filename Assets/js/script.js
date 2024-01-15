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
    currentWeather = getWeatherData(SearchText);
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
function geocodelocation(str)
{   
    var url = 
    var geocode = apiGet(ulr);
    var obj = {
        lat: "",
        long: "",
    };

    return obj;
}

function apiGet(url)
{
    fetch(url).then(function (response){
        if(response.ok){
            response.json().then(function (data){
                return data;
            });
        }else{
            return ('Error: ' + response.statusText);
        }
    })
}

//API Get Location weather
function getWeatherData(search)
{
    return;
}

function API_GET()
{}

//render page
function renderPage()
{

}

//init 
//load previous searches to page