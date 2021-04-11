var weatherData
var cityName = 'philadelphia';
var appId='18696e9d388303c0bae7863310154545';
var requestGeo;
var lat, lon;
var weatherRequest;

function getWeather(city){   
    
    requestGeo = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${appId}`;
    var geoCorrd;

    fetch(requestGeo)

    .then (function (response){

        geoCorrd = response.json();
        return geoCorrd;      
            
    })

    .then (function (data) {

        console.log(data[0]);

        lat = data[0].lat;

        lon = data[0].lon;

        console.log('lat = '+lat);
        console.log('lon = '+lon);

        weatherRequest = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${appId}`;



        fetch (weatherRequest)
            .then (function (respon){

                weatherData = respon.json();

                return weatherData;
            })

            .then (function (data){

                console.log(data);

                console.log(data.current);


                for(var i=0; i<5; i++){

                    console.log(data.daily[i]);
                    console.log('/n');
                }

            })

    });

}

function searchbtn(){

    getWeather(cityName);

    addHistory(cityName);
}

function searchHistory(){

    getWeather();
}

function addHistory(city){
    
}

function displayWeather(){

}

















$('#searchBtn').on('click', searchBtn);
$('#history > button').on('click', searchHistory);