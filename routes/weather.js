/*
 * GET weather page.
 */

exports.view = function(req, res){
    var activity = req.params.activity;
    var mapLink = '/map/' + activity;
    var weatherLink = "/weather/" + activity;
    var reviewLink = '/review/' + activity;
    var beachJson = require("../public/json/beaches.json");
    var beaches = beachJson['beaches'];
    var weatherKey = process.env.WUKEY;
    var request = require("request");
    var tideData = null;
    var weatherData = null;
    var tideTimesFirst = [];
    var tideTimesSecond = [];

    var weatherUrl = "http://api.wunderground.com/api/" + weatherKey + "/hourly10day/q/" + beaches['blacks']['latitude'] + "," + beaches['blacks']['longitude'] +".json";
    var tideUrl = "http://api.wunderground.com/api/" + weatherKey + "/tide/q/CA/San_Diego.json";

    request({
        url: tideUrl,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            successCallBack(body);
        } else {
            console.log("error");
            console.log(error);
        }
    });


    var successCallBack = function(body){
        tideData = body['tide'];
        if (tideData != null){
            // get the first 48 hours of tide information
            tideData = tideData['tideSummary'].slice(0,16);

            // get the hash for first day
            for(var i=0; i<8; i++){
                tideTimesFirst[i] = tideData[i];
            }

            // get the hash for second day
            for(var j=8; j<16; j++){
                tideTimesSecond[j-8] = tideData[j];
            }
        } else {
            console.log("can't get tide data");
        }

        getWeatherData();
    };

    var getWeatherData = function(){
        request({
            url: weatherUrl,
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                weatherData = body['hourly_forecast'];
                if(weatherData != null){
                    weatherData = weatherData.slice(0, 48);
                    renderWeatherPage();
                } else {
                    console.log("can't get weather data");
                }

            } else {
                console.log("error");
                console.log(error);
            }
        });
    };

    var renderWeatherPage = function(){
        res.render('weather', {
            'activity': activity,
            'mapLink': mapLink,
            'weatherLink': weatherLink,
            'reviewLink': reviewLink,
            'beaches': beaches,
            'weatherData': weatherData,
            'tideData': tideData,
            'tideTimesFirst': tideTimesFirst,
            'tideTimesSecond': tideTimesSecond,
            'isWeather': true
        });
    }

};