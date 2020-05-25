var weatherCol = $("#w-c");
var searchHistory = $("#s-history");
var storedSearches = [];
var searchBaaar = $("#search-b");
var searchButton = $("#search-btn");
var currentWeather;
var forecastUrl;
var APIKey = "2a5960fb4077d97d69d0a99893e7ecbb";


var tempStoredSearches = localStorage.getItem("storedSearches");
if (tempStoredSearches != null)
    storedSearches = tempStoredSearches.split(",");

   
var currentday = new Date();
var currentDate = currentday.getFullYear() + '-' + (currentday.getMonth() + 1) + '-' + currentday.getDate();
function populateCurrentWeather() {
    $.ajax({
        url: currentWeather,
        method: "GET"
    }).then(function (response) {
      
        var currentWeatherObj = {
            location: response.name,
            date: currentDate,
            weatherIcon: response.weather[0].icon,
            temperature: Math.round(response.main.temp),
            humidity: response.main.humidity,
            wind: response.wind.speed,
            uvIndex: 0,
            uvIntensity: ""
        };
       
        
        
        
        currentWeatherObj.date = formatDates(currentWeatherObj.date);
      
        
        
        
        
        
        
        
        var latitude = response.coord.lat;
        var longitude = response.coord.lon;
        var currentUvUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=" + APIKey;
        $.ajax({
            url: currentUvUrl,
            method: "GET"
        }).then(function (response2) {
            currentWeatherObj.uvIndex = response2.value;
           
           
          
           
           
           
           
            if (currentWeatherObj.uvIndex >= 8)
                currentWeatherObj.uvIntensity = "high";
            else if (currentWeatherObj.uvIndex < 3)
                currentWeatherObj.uvIntensity = "low";
            else
                currentWeatherObj.uvIntensity = "medium";
            
            
            
            
            var currentWeatherCard = $('<div class="card"><div class="card-body"><h5 class="card-title">' + currentWeatherObj.location + ' (' + currentWeatherObj.date + ') ' +
                '<span class="badge badge-primary"><img id="weather-icon" src="http://openweathermap.org/img/wn/' + currentWeatherObj.weatherIcon + '@2x.png"></span></h5>' +
                '<p class="card-text">Temperature: ' + currentWeatherObj.temperature + ' °F</p>' +
                '<p class="card-text">Humidity: ' + currentWeatherObj.humidity + '%</p>' +
                '<p class="card-text">Wind Speed: ' + currentWeatherObj.wind + ' MPH</p>' +
                '<p class="card-text">UV Index: <span class="badge badge-secondary ' + currentWeatherObj.uvIntensity + '">' + currentWeatherObj.uvIndex + '</span>')
            $("#w-c").append(currentWeatherCard);
        });
        renderStoredSearches();
    });
}
function populateWeatherForecast() {
    var fiveDayForecastArray = [];
  
   
   
    $.ajax({
        url: forecastUrl,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var temporaryForecastObj;
        
       
       
       
        for (var i = 4; i < response.list.length; i += 8) {
            temporaryForecastObj = {
                date: response.list[i].dt_txt.split(" ")[0],
                weatherIcon: response.list[i].weather[0].icon,
                temperature: Math.round(response.list[i].main.temp),
                humidity: response.list[i].main.humidity
            };
            fiveDayForecastArray.push(temporaryForecastObj);
        }
        
        
        
        for (var i = 0; i < fiveDayForecastArray.length; i++) {
            fiveDayForecastArray[i].date = formatDates(fiveDayForecastArray[i].date);
        }
        
       
       
       
        var forecastHeader = $('<h5>5-Day Forecast:</h5>');
        $("#forecast-h").append(forecastHeader);
        for (var i = 0; i < fiveDayForecastArray.length; i++) {
            var forecastCard = $('<div class="col-lg-2 col-sm-3 mb-1"><span class="badge badge-primary"><h5>' + fiveDayForecastArray[i].date + '</h5>' +
                '<p><img class="w-100" src="http://openweathermap.org/img/wn/' + fiveDayForecastArray[i].weatherIcon + '@2x.png"></p>' +
                '<p>Temp: ' + fiveDayForecastArray[i].temperature + '°F</p>' +
                '<p>Humidity: ' + fiveDayForecastArray[i].humidity + '%</p>' +
                '<span></div>');
            $("#forecast-row").append(forecastCard);
        }
    });
}
function renderStoredSearches() {
    $("#s-history").empty();
    
   
   
   
   
   
   
    if ($("#search-b").val() != "") {
        if (storedSearches.indexOf($("#search-b").val()) != -1) {
            storedSearches.splice(storedSearches.indexOf($("#search-b").val()), 1)
        }
        storedSearches.unshift($("#search-b").val());
    }
   
    
    
    localStorage.setItem("storedSearches", storedSearches);
    
   
   
   
    for (var i = 0; i < storedSearches.length; i++) {
        var newListItem = $('<li class="list-group-item">' + storedSearches[i] + '</li>');
        $("#s-history").append(newListItem);
    }
    
   
   
   
    $("li").on("click", function () {
        $("#search-b").val($(event.target).text());
        searchButton.click();
    });
}



function formatDates(data) {
    var dateArray = data.split("-");
    var formattedDate = dateArray[1] + "/" + dateArray[2] + "/" + dateArray[0];
    return formattedDate
}
searchButton.on("click", function () {
    currentWeather = "https://api.openweathermap.org/data/2.5/weather?q=" + searchBaaar.val() + "&units=imperial&appid=" + APIKey;
    forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchBaaar.val() + "&units=imperial&appid=" + APIKey;
    $("#w-c").empty();
    $("#forecast-h").empty();
    $("#forecast-row").empty();
    populateCurrentWeather();
    populateWeatherForecast();
});




$("#search-b").keypress(function () {
    if (event.keyCode == 13)
        searchButton.click();
});
renderStoredSearches();



