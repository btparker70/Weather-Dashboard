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
    // Current city data display
    var iconCode = response.current.weather[0].icon;
    console.log(iconCode);
    var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
    var imgDiv = $('<img>').attr('src', iconUrl);
    $('#cityNameDisplay').text('City: ' + cityName).append(imgDiv);
    $('#tempDisplay').text('Temperature: ' + (Math.floor((response.current.temp) - 273.15) * 1.80 + 32) + 'F');
    $('#humidityDisplay').text('Humidity: ' + response.current.humidity + '%');
    $('#windSpeedDisplay').text('Wind Speed: ' + Math.floor(response.current.wind_speed * 1.151) + 'mph');
    $('#uvIndexDisplay').text('UV Index: ');
    var uvHoverText = '';
    var uvText = $('<p>' + response.current.uvi + '</p>').css('display', 'inline');
    if (response.current.uvi < 3) {
      uvText.css('background-color', 'green');
      $('#uvIndexDisplay').append(uvText);
      uvHoverText = 'Low';
    } else if (3 <= response.current.uvi < 6) {
      uvText.css('background-color', 'yellow');
      $('#uvIndexDisplay').append(uvText);
      uvHoverText = 'Moderate';
    } else if (6 <= response.current.uvi < 8) {
      uvText.css('background-color', 'orage');
      $('#uvIndexDisplay').append(uvText);
      uvHoverText = 'High';
    } else if (8 <= response.current.uvi < 11) {
      uvText.css('background-color', 'red');
      $('#uvIndexDisplay').append(uvText);
      uvHoverText = 'Very High';
    } else {
      uvText.css('background-color', 'violet');
      $('#uvIndexDisplay').append(uvText);
      uvHoverText = 'Extreme';
    }
    $('#uvIndexDisplay').hover(function() {
      $(this).css('cursor', 'pointer').attr('title', uvHoverText);
    }, function () {
      $(this).css('cursor', 'auto');
    })
    // Forecast display
    
    for (i = 0; i < 5; i++) {
      // var display = $('<div/>');
      // $('#day'+ i +'').append(display);
      $('#day'+ i +'').text(moment().add(i + 1, 'days').format('MM/DD/YYYY'));
      $('#day'+ i +'').append('<br>');
      var iconCode = response.daily[i].weather[0].icon;
      var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
      var imgDiv = $('<img>').attr('src', iconUrl);
      $('#day'+ i +'').append('<img src=' + iconUrl +' />');
      $('#day'+ i +'').append( '<p>' + 'Temperature: ' + (Math.floor((response.daily[i].temp.day) - 273.15) * 1.80 + 32) + 'F' + '</p>')
      $('#day'+ i +'').append( '<p>' + 'Humidity: ' + response.daily[i].humidity + '%' + '</p>')
    }

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
