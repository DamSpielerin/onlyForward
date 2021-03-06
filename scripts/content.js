$(document).ready(function() {
    // script.src = "https://apis.google.com/js/client.js?onload=init";
    // (document.head||document.documentElement).appendChild(script);
    // google.load("visualization", "1", {packages:["corechart"]});
	var jsonOpenWeather = {};
	var jsonDarkSky = {};
	getWeather("Kherson");
    $("#show").on("click",function() {
        var town = $(".town").val();
        getWeather(town);
    });
//    google.setOnLoadCallback(drawChart);
  });
google.load("visualization", "1", {packages:["corechart"]});
function drawChart() {
	console.log(jsonDarkSky);
    var data = new google.visualization.DataTable();
    var dateArr = new Array();
    var j=0;
    data.addColumn('date', 'Date');
    data.addColumn('number', 'Day');
    data.addColumn('number', 'Night');
    for (var i=1;i<6;i++){
    	var mainDate = new Date();
    	mainDate.setTime(jsonDarkSky.daily.data[i].temperatureHighTime*1000);
    	dateArr.push([mainDate, fromFtoC(jsonDarkSky.daily.data[i].temperatureHigh), fromFtoC(jsonDarkSky.daily.data[i].temperatureLow)]);
    }
    data.addRows(dateArr);
    var customFormatter = google.visualization.NumberFormat(

    );
    // Set chart options
    var options = {
        title: 'Next 5 day temperature',
        width: "100%",
        height: "100%",
        hAxis: {
            format: 'd/M'
        },
        chartArea:{
            width: "85%"
        },
        legend: 'none',
        colors: ['#ad4543','#3e43fe']
    };
    customFormatter.format(data, 2);

    var chart = new google.visualization.ColumnChart(document.getElementById('grafic'));
    chart.draw(data, options);

}

function getWeather(city) {
	getWeatherFromOpenWeather(city);
}

function getWeatherFromOpenWeather(city) {
	var answer='';
	var APPIDS = [
		"92af67689082c67a491224c1bdb7c8dd",
		"062fe4d6ff0b08524e3dd810ac380fe0",
		"d9a80193c1bfda281c186a043c01a7c4",
		"d1db680b0332fb588732e7340a1e3adf",
		"2b742ea345c886bbeac94ff9dfebe739",
		"f0b0dd5a828feb33a240fd9dc2cb85f8",
		"9e7d8ee4dd7dd036d8304a93bb1a8b61",
		"fabb51d1360a316653b5465a15f2eefd",
		"ab1fe445feda67e59fdfce9abb6c653f",
		"5fec7a468fc537d0d19ea4e979c177f0",
		"9c3e925755888724981571b56ef8a87f",
		"ed5ace2097103d5a9573c39ccfb9e38d",
		"73d8081eb0aad8eec8e5adaf220ef393"
	];
	$.getJSON("http://api.openweathermap.org/data/2.5/forecast",
			{
			q: city,
			units: "metric",
			APPID: APPIDS[Math.floor(Math.random() * 13)]
		}).success (function( json  ) {
		if(json.city){
			console.log(json);
			$( ".city" ).find('label').html( "<strong>" + json.city.name + "</strong>" );
			$(".answer").html(json.list[0].weather[0].main);
			getWeatherFromDarkSky(json.city.coord.lat,json.city.coord.lon)
			jsonOpenWeather = json;
		}else{
			$( ".answer" ).html( json);
		}
	}).fail(function(jqxhr, textStatus, error ) {
		var err = textStatus + ", " + error;
		console.log("Request Failed: " + err);
		answer =  err;
	});
	return answer;
}

function getWeatherFromDarkSky(lat,lon){
	var answer='';

	$.getJSON(" https://api.darksky.net/forecast/b0f091637a0802c5d88a73936b3df132/"+lat+","+lon,
		{
			exclude: "minutely,hourly"
		}).success (function( json  ) {
		jsonDarkSky = json;
		console.log(json.daily.icon);
		$(".answer").append(" "+json.daily.icon);
		showWeather();
		drawChart();
	}).fail(function(jqxhr, textStatus, error ) {
		var err = textStatus + ", " + error;
		console.log("Request Failed: " + err);
		answer =  err;
	});

	return answer;
}
function showWeather() {
	var statusOpenWeather = jsonOpenWeather.list[0].weather[0].main.toLowerCase();
	var statusDarkSky = jsonDarkSky.daily.icon
	var temperatureOpenWeather = Math.round(jsonOpenWeather.list[0].main.temp);
	var temperatureDarkSky = fromFtoC(jsonDarkSky.currently.temperature);
	var averageTemperature = Math.round((temperatureOpenWeather + temperatureDarkSky) / 2);
	if(statusOpenWeather == statusDarkSky){
		$(".center_all").hide();
		$(".center").show();
		setIconByStatus(statusDarkSky,$("#img0"));
	}else{
		$(".center").hide();
		$(".center_all").show();
		setIconByStatus(statusOpenWeather,$("#img1"));
		setIconByStatus(statusDarkSky,$("#img2"));
	}
	console.log(temperatureOpenWeather);
	console.log(jsonDarkSky);
	$(".temp0").find("span").text((averageTemperature>0 ? "+" : "" ) + averageTemperature);
	$(".temp1").find("span").text((temperatureOpenWeather>0 ? "+" : "" ) + temperatureOpenWeather);
	$(".temp2").find("span").text((temperatureDarkSky>0 ? "+" : "") + temperatureDarkSky);
	// setTemperature();

}
function setIconByStatus(status,img) {
	$.getJSON('icons.json', function(data) {
		$.each(data, function(key, val) {
			if(key==status){
				img.attr("src", "images/icons/"+val+".png")
				img.attr("title", key)
			}
		});
	});;
}

function fromFtoC(f){
	return  Math.round((f - 32) / 1.8);
}