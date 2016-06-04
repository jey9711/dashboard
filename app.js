'use strict';

// Declare app level module which depends on views, and components
angular.module('dashboard', [
	'ngRoute',
	'firebase',
	// 'geolocation',
	'dashboard.todo'
	]).

config(['$routeProvider', function($routeProvider) {
	$routeProvider.otherwise({redirectTo: '/todo'});
}])

.controller('MainCtrl',['$scope', '$filter', '$interval', 'weatherService', function($scope, $filter, $interval, weatherService){


	/*------------------------------------------
			GEO LOCATION
	------------------------------------------*/

	// NOTE1: DONT FORGET TO INJECT GEOLOCATION
	// NOTE2: MUST SWITCH FROM HTTP --> HTTPS

		/*
	geolocation.getLocation().then(function(data){
		$scope.lat = data.coords.latitude;
	  	$scope.long = data.coords.longitude;
	});

	console.log($scope.lat + ", " + $scope.long);
	*/


	/*------------------------------------------
			WEATHER WIDGET
	------------------------------------------*/

	weatherService.getWeather(43.4643,-80.5204).then(function(returnValues){
		$scope.weather = returnValues.data.main;
		console.log($scope.weather.temp);
		console.log(returnValues.data.weather[0].id);
		
		var weatherCond = returnValues.data.weather[0].id;

		
		if(weatherCond < 300){	//Thunderstorm
			$scope.weatherCondition = "Its storming like crazy!";
		}else if(weatherCond < 400){ 	//Drizzling
			$scope.weatherCondition = "You might want to bring your umbrella with you";
		}else if(weatherCond < 600){ 	//Rain
			$scope.weatherCondition = "Its as sad as your life outside, except that it will eventually stop";
		}else if(weatherCond < 700){ 	//Snow
			$scope.weatherCondition = "Snow Day! Or not.";
		}else if(weatherCond < 800){ 	//Atmosphere
			$scope.weatherCondition = "You know what they say when its misty outside. You're screwed.";
		}else if(weatherCond == 800){ 	//Clear
			$scope.weatherCondition = "Its as clear as your future. I mean mine.";
		}else if(weatherCond < 900){ 	//Cloudy
			$scope.weatherCondition = "It's pretty cloudy outside. Make sure you have your plates ready for the meatballs";
		}else if(weatherCond < 910){ 	//Dangerous
			$scope.weatherCondition = "I dont think you'll be around to read this when this happens. But if you do, God Bless You";
		}else{							//Additional
			$scope.weatherCondition = "Jerry didn't programme me to recognize outside's weather. You're on your own kid.";
		}


	})

	/*------------------------------------------
			REAL-TIME CLOCK FUNCTION
	------------------------------------------*/

	var dateFilter = $filter('date');

	function updateTime(){
		$scope.clock = dateFilter(new Date(), 'hh:mm a');
		var currentHour = dateFilter(new Date(), 'HH');

		if (currentHour < '12'){
			$scope.timeOfDay = 'Morning';
		}else if (currentHour < '17'){
			$scope.timeOfDay = 'Afternoon';
		}else if (currentHour < '21'){
			$scope.timeOfDay = 'Evening';
		}else{
			$scope.timeOfDay = 'Night';
		}
	}

	$interval(updateTime, 1000);
}])

/*------------------------------------------
			WEATHER SERVICE
------------------------------------------*/

.service('weatherService',['$http', function($http){
	return{
		getWeather: function(lat,lon){
			return $http.jsonp('http://api.openweathermap.org/data/2.5/weather?lat='+ lat +'&lon='+ lon +'&units=metric&callback=JSON_CALLBACK&APPID=f9dbd911bc01df1d9ce563b2ba4d3209')
		}
	}
}])

/*------------------------------------------
			TEMPERATURE FILTER
------------------------------------------*/

.filter('temp', function($filter) {
    return function(input, precision) {
        if (!precision) {
            precision = 1;
        }
        var numberFilter = $filter('number');
        return numberFilter(input, precision) + '\u00B0C';
    };
});
