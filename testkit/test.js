var appId='18696e9d388303c0bae7863310154545';
var city = 'Philadelphia'
var limit = 1;
//var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${appId}`;



//let request = `api.openweathermap.org/data/2.5/weather?q=London,uk&${appId}`;
//var requestGeo =`http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&limit=${limit}&appid={appId}`;

var requestGeo = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${appId}`

var lat, lon;

//var requestUv = `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${appId}`;
//var iconUrl = ``

var weatherRequest; // = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appin=${appId}`;

var weatherData;

function getGeo(){
    fetch(requestGeo)
    .then(function (response){

        if(response.ok){

            weatherData = response.json();
            weatherData.then(function(data){

                console.log(weatherData);
            });

        }else {
            alert('unable to connect');
        }
    });
}
/*
function getGeo(){

    fetch(requestGeo)

        .then (function (response){


            weatherData = response.json();
            return weatherData;
            
        })

        .then (function (data) {

            //weatherData = data;

            console.log(data[0]);

            lat = data[0].lat;

            lon = data[0].lon;

            console.log('lat = '+lat);
            console.log('lon = '+lon);

            weatherRequest = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${appId}`;



            fetch (weatherRequest)
                .then (function (respon){

                    return respon.json();
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

*/

getGeo();