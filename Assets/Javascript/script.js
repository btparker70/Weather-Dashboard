
var cityName = '';


$('#searchBtn').click(function() {
    var cityName = $('#searchInput').val();
    localStorage.setItem('city', cityName);
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=c2a92e28123db3bc43faafb0a9eb3c40";

    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        console.log(response);
        
        $('#cityNameDisplay').append(cityName);
        $('#tempDisplay').append(response.main.temp);
        $('#humidityDisplay').append(response.main.humidity);
        $('#windSpeedDisplay').append(response.wind.speed);
        $('#uvIndexDisplay').append(response.);

      })

})

// var queryURL = 'api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=c2a92e28123db3bc43faafb0a9eb3c40';


