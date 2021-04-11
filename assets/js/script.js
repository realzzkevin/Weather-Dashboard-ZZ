var weatherData
var defaultCity = 'philadelphia';
var appId='18696e9d388303c0bae7863310154545';
var requestGeo;
var lat, lon;
var weatherRequest;

function getWeather(city){   
    
    requestGeo = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${appId}`;
    var geoCorrd;

    fetch(requestGeo)

    .then (function (response){

        if (response.ok) {

            geoCorrd = response.json();
            console.log(response);
            
            geoCorrd.then(function (data){

                console.log(data[0]);
            
                lat = data[0].lat;
            
                lon = data[0].lon;
            
                console.log('lat = '+lat);
                console.log('lon = '+lon);
            
                weatherRequest = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${appId}`;      
            
            
                fetch (weatherRequest)
            
                .then (function (respon){
            
                    if (respon.ok) {
            
                        weatherData=respon.json();
                            
                        weatherData.then( function(data){

                            console.log(data);
                            displayWeather(data);

            
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
}

function searchHistory(){

    var city;

    getWeather(city);
}

function addHistory(city){

    var 

}

function displayWeather(weather){



}














getWeather(defaultCity);

$('#searchBtn').on('click', searchBtn);
$('#history > button').on('click', searchHistory);