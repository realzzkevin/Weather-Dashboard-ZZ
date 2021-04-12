var weatherData
var defaultCity = 'philadelphia';
var cityName;
var appId='18696e9d388303c0bae7863310154545';
var requestGeo;
var lat, lon;
var weatherRequest;

async function getWeather(city){   
    
    requestGeo = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${appId}`;
    var geoCorrd;

    fetch(requestGeo)

    .then (function (response){

        if (response.ok) {

            geoCorrd = response.json();

            console.log(response);
            
            geoCorrd.then(function (data){

                console.log(data[0]);

                cityName = data[0].name;

                console.log(cityName);
            
                lat = data[0].lat;
            
                lon = data[0].lon;
            
                console.log('lat = '+lat);
                console.log('lon = '+lon);
            
                weatherRequest = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${appId}`;      
            
            
                fetch (weatherRequest)
            
                .then (function (respon){
            
                    if (respon.ok) {
            
                        weatherData=respon.json();
                            
                        weatherData.then( function(data){

                            console.log(data);

                            getDate(data.current.dt, data.timezone_offset);

                            displayWeather(data);
                            return cityName;
            
                        })
            
                    } else {

                        alert('Error' + respon.statusText);
                    }
            
                });                

            })

        } else {

            alert('Error: '+ response.statusText);
        }
            
    })

}

function searchBtn(){
    
    var city = $('#search').val();

    console.log(city);

    getWeather(city);

    addHistory(city);

    //getWeather(city);
    //addHistory(cityName);
    //addHistory(getWeather(city));
}


function searchHistory(){

   var city = $(this).text() ;

    console.log('history city'+$(event.target).text());

    getWeather(city);
}

function addHistory(city){

    var allSearch = $('#history > button');
    var historyEl = $('<button>').addClass('list-group-item list-group-item-action')
    historyEl.attr('type', 'button');

    console.log(allSearch.length);

    for (var i=0; i<allSearch.length; i++){
        console.log('all searchs'+ $(allSearch[i]).text());

        if($(allSearch[i]).text()===city){

            return;
        }
    }
    
    historyEl.text(city);
    $('#history').append(historyEl);
    $('#history > button').on('click', searchHistory);

}

function getDate(UTCtime, timeZone){

    var dateStr;
    
    var curTime = new Date((UTCtime+timeZone)*1000);

    dateStr = (curTime.getMonth()+1)+'/'+curTime.getDate()+'/'+curTime.getFullYear();

    return dateStr;

}

function displayWeather(weather){

    var curDayCard = $('#currentday');
    var currentData = weather.current;
    console.log(currentData);

    curDayCard.empty();

    var divEl = $('<div>').addClass('row');
    var titleEl = $('<h2>').addClass('card-title');

    titleEl.text(cityName+' ('+ getDate(currentData.sunrise, weather.timezone_offset)+')');
    //console.log(currentData.weather.icon);
    var iconEl = $('<img>').attr('src',"http://openweathermap.org/img/wn/"+currentData.weather[0].icon+".png");
    iconEl.attr('alt', currentData.weather[0].description);
    var tempEl = $('<p>').text("Temperature: "+currentData.temp+"°F");
    var HumidEl = $('<p>').text("Humidity: "+currentData.humidity+"%");
    var windEl = $('<p>').text("Wind Speed: "+currentData.wind_speed+" MPH");
    var uvSpan = $('<span>').text(currentData.uvi).addClass('badge');
    var uvEl = $('<p>').text("UV index: ").append(uvSpan);

    //console.log(uvEl.html());

    divEl.append(titleEl);
    divEl.append(iconEl);

    curDayCard.append(divEl);
    curDayCard.append(tempEl);
    curDayCard.append(HumidEl);
    curDayCard.append(windEl);
    curDayCard.append(uvEl);


    var uv = parseInt(currentData.uvi);

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

    var forecastCard = $('#5day');

    var dailyData = weather.daily;

    forecastCard.empty();

    for(var i=1; i<6; i++){

        console.log(dailyData[i]);

        var cardEl = $('<div>').addClass("card-body badge badge-primary");

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

getWeather(defaultCity);

$('#searchBtn').on('click', searchBtn);
$('#history > button').on('click', searchHistory);
