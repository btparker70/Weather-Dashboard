var cities = [];

var cityName = '';
var lat = 0;
var lon = 0;

$('#searchBtn').click(function () {
  var cityName = $('#searchInput').val();
  localStorage.setItem('city', cityName);
  var apiKey = 'c2a92e28123db3bc43faafb0a9eb3c40';
  var cityURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;
  var fiveDayForecastUrl = 'api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=' + apiKey;

  $.ajax({
    url: cityURL,
    method: "GET"
  }).then(function (response) {

    var lat = response.coord['lat'];
    var lon = response.coord['lon'];
    var oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly&appid=' + apiKey;

  $.ajax({
    url: oneCallUrl,
    method: "GET"
  }).then(function (response) {
    console.log(response);
    $('#cityNameDisplay').text('City: ' + cityName);
    $('#tempDisplay').text('Temperature: ' + response.current.temp);
    $('#humidityDisplay').text('Humidity: ' + response.current.humidity);
    $('#windSpeedDisplay').text('Wind Speed: ' + response.current.wind_speed);
    $('#uvIndexDisplay').text('UV Index: ' + response.current.uvi);
  })

  })
})
  // $.ajax({
  //   url: cityURL,
  //   method: "GET"
  // }).then(function (response) {
  //   $('#cityNameDisplay').text('City: ' + cityName);
  //   $('#tempDisplay').text('Temperature: ' + response.main.temp);
  //   $('#humidityDisplay').text('Humidity: ' + response.main.humidity);
  //   $('#windSpeedDisplay').text('Wind Speed: ' + response.wind.speed);
  //   console.log(lat);
  //   var lat = localStorage.setItem('lat', response.coord['lat']);
  //   console.log(lat);
  //   lon += response.coord['lon'];

  // })
  // var uvUrl = 'http://api.openweathermap.org/data/2.5/uvi?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey;
  // console.log(uvUrl);
  // // UV index
  // $.ajax({
  //   url: uvUrl,
  //   method: "GET"
  // }).then(function (response) {
  //   console.log(response);
  //   $('#uvIndexDisplay').text('UV Index: ' + response.value);
  // })

  // 5-day forecast
  // $.ajax({
  //   url: fiveDayForecastUrl,
  //   method: "GET"
  // }).then(function (response) {
  //   console.log(response);
    // $('#uvIndexDisplay').text('UV Index: ' + response.value);
  // })


// var queryURL = 'api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=c2a92e28123db3bc43faafb0a9eb3c40';
