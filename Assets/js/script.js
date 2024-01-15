//HTML ELEMNETS
SearchButtonEL  = $('Search-btn');
SeachDataEL = $('search-text');

//GLOBAL: VARIABLES
storageKey = "wk6-WeatherDashboard";
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
    if(data === undefined)
    {
        var data = [];
    }
    data.push(val);
    localStorage.setItem(storageKey,json.stringify(oldData));
}

//clear local storage

//get location lat and long

//API Get Location weather

//render page
function renderPage()
{

}

//init 
//load previous searches to page