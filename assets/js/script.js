var weatherData
//default city for initial page.
var defaultCity = 'philadelphia';
var cityName;
var appId='18696e9d388303c0bae7863310154545';
var requestGeo;
var lat, lon;
var weatherRequest;
var savedHistory;

// main api call function 
async function getWeather(city){   
    
    // url for geocoding api call. 
    requestGeo = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${appId}`;
    var geoCorrd;
    // fetch city coordiantion  
    fetch(requestGeo)

    .then (function (response){

        if (response.ok) {

            geoCorrd = response.json();

            geoCorrd.then(function (data){
                //get lat and lon when fetch return success 
                cityName = data[0].name;
          
                lat = data[0].lat;
            
                lon = data[0].lon;
                //url for one call api, getting all weather conditions.
                weatherRequest = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${appId}`;      
            
            
                fetch (weatherRequest)
            
                .then (function (respon){
            
                    if (respon.ok) {
            
                        weatherData=respon.json();
                            
                        weatherData.then( function(data){
                            //use data to display weather condtion. 
                            displayWeather(data);
                            return cityName;
            
                        })
            
                    } else {
                        //display error alert.
                        alert('Error' + respon.statusText);
                    }
            
                });                

            })

        } else {

            alert('Error: '+ response.statusText);
        }
            
    })

}
// search bar function; search city weather and save city into history
function searchBtn(){
    
    var city = $('#search').val();

    getWeather(city);

    addHistory(city);

}

// history search function
function searchHistory(){

    var city = $(this).text() ;
    getWeather(city);
}

// add searched history. Add event listener too.
function addHistory(city){

    var allSearch = $('#history > button');
    var historyEl = $('<button>').addClass('list-group-item list-group-item-action border')
    historyEl.attr('type', 'button');

    // if city already saved, abort; otherwise add new save history to history element.
    for (var i=0; i<allSearch.length; i++){

        if($(allSearch[i]).text()===city){

            return;
        }
    }
    
    historyEl.text(city);
    $('#history').append(historyEl);
    $('#history > button').on('click', searchHistory);

    // save new search into local storage
    if (savedHistory === null){
        savedHistory= [city];
    }else {

        for (var j=0; i<savedHistory.length; j++){

            if(city ===savedHistory[i]){
                return;
            }
        }

        savedHistory.push(city);
    }

    localStorage.setItem('SavedSearch', JSON.stringify(savedHistory));

}

// convert UTCtime into MM/DD/YYYY format
function getDate(UTCtime, timeZone){

    var dateStr;
    
    var curTime = new Date((UTCtime+timeZone)*1000);

    dateStr = (curTime.getMonth()+1)+'/'+curTime.getDate()+'/'+curTime.getFullYear();

    return dateStr;

}

function displayWeather(weather){
    //use fetched data to construct current weather section;
    var curDayCard = $('#currentday');
    var currentData = weather.current;

    curDayCard.empty();

    var divEl = $('<div>').addClass('row');
    var titleEl = $('<h2>').addClass('card-title');

    titleEl.text(cityName+' ('+ getDate(currentData.sunrise, weather.timezone_offset)+')');
    var iconEl = $('<img>').attr('src',"https://openweathermap.org/img/wn/"+currentData.weather[0].icon+".png");
    iconEl.attr('alt', currentData.weather[0].description);
    var tempEl = $('<p>').text("Temperature: "+currentData.temp+"°F");
    var HumidEl = $('<p>').text("Humidity: "+currentData.humidity+"%");
    var windEl = $('<p>').text("Wind Speed: "+currentData.wind_speed+" MPH");
    var uvSpan = $('<span>').text(currentData.uvi).addClass('badge');
    var uvEl = $('<p>').text("UV index: ").append(uvSpan);

    divEl.append(titleEl);
    divEl.append(iconEl);

    curDayCard.append(divEl);
    curDayCard.append(tempEl);
    curDayCard.append(HumidEl);
    curDayCard.append(windEl);
    curDayCard.append(uvEl);


    var uv = parseInt(currentData.uvi);
    // assign differnt color background to UV index;
    if (uv<=2){
        uvSpan.addClass("uvGreen");
    } else if (uv>=3 && uv <=5 ){
        uvSpan.addClass("uvYellow");
    } else if (uv>=6 && uv<=7){
        uvSpan.addClass("uvOrange");
    } else if (uv>=8 && uv<=10){
        uvSpan.addClass("uvRed");
    } else if (uv>=11){
        uvSpan.addClass("uvViolet");
    }

    // construct 5 display card for 5 day forcast
    var forecastCard = $('#5day');

    var dailyData = weather.daily;

    forecastCard.empty();

    for(var i=1; i<6; i++){

        var cardEl = $('<div>').addClass("card-body badge badge-primary daily");

        var dateEl = $('<h3>').text(getDate(dailyData[i].sunrise, weather.timezone_offset));
        iconEl = $('<img>').attr('src',"https://openweathermap.org/img/wn/"+dailyData[i].weather[0].icon+".png");
        iconEl.attr('alt', dailyData[i].weather[0].description);
        tempEl = $('<p>').text("Temp: "+dailyData[i].temp.day+"°F");
        HumidEl = $('<p>').text("Humidity: "+dailyData[i].humidity+"%");


        cardEl.append(dateEl);
        cardEl.append(iconEl);
        cardEl.append(tempEl);
        cardEl.append(HumidEl);

        forecastCard.append(cardEl);

    }
}
// load saved search from local storage.
function loadHistory() {

    savedHistory = JSON.parse(localStorage.getItem('SavedSearch'));

    if (savedHistory === null){

        return;

    }else {
        
        for(var i =0; i < savedHistory.length; i++){

            addHistory(savedHistory[i]);

        }
    }
}

// initial page
getWeather(defaultCity);
loadHistory();

// add event listener for search button.
$('#searchBtn').on('click', searchBtn);
$('#history > button').on('click', searchHistory);
