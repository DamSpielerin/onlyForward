$(document).ready(
	function () {
		var json = getWeatherFromOpenWeather ('Moscow');
		if(json){
			$( ".day_icon" ).html( "Weather at <strong>" + json.city.name + "</strong>" );
		}else{
			$( ".day_icon" ).html( "Server not responded" );

		}

	}

);

function getWeatherFromOpenWeather (city) {
	var answer='';
	var APPIDS = [
		"92af67689082c67a491224c1bdb7c8dd",
		"062fe4d6ff0b08524e3dd810ac380fe0",
		"d9a80193c1bfda281c186a043c01a7c4",
		"d1db680b0332fb588732e7340a1e3adf",
		"2b742ea345c886bbeac94ff9dfebe739",
		"9e7d8ee4dd7dd036d8304a93bb1a8b61",
		"fabb51d1360a316653b5465a15f2eefd",
		"ab1fe445feda67e59fdfce9abb6c653f",
		"5fec7a468fc537d0d19ea4e979c177f0",
		"9c3e925755888724981571b56ef8a87f",
		"73d8081eb0aad8eec8e5adaf220ef393"
	];
	$.getJSON("http://api.openweathermap.org/data/2.5/forecast",
		{
			id: 524901,
			APPID: APPIDS[Math.floor(Math.random() * 11)]
		}).done (function( json ) {
		answer = json;
	}).fail(function(jqxhr, textStatus, error ) {
		var err = textStatus + ", " + error;
		answer = "Request Failed: " + err;
	});
	return answer;
}