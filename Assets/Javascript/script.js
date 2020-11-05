// Saved cities from searches
var savedCities = JSON.parse(localStorage.getItem("cities")) || [];

var cityName = '';
var lat = 0;
var lon = 0;


// When list items are clicked
$('#searchList').on('click', '.list-group-item', function () {
  clearListActive();
  $(this).toggleClass('active');
  dataRender($(this).text());
})

// Color item
function colorListActive() {
  clearListActive();
  $('#' + ($('#searchInput').val())).toggleClass('active');
}

// Clear list active color
function clearListActive() {
  $('.list-group-item').each(function () {
    $(this).removeClass('active');
  })
}

// When search button clicked
$('#searchBtn').click(function () {
  // Clear list color first
  clearListActive();

  // Check if there's duplicate searches
  var found = false;

  for (i = 0; i < savedCities.length; i++) {              // For all saved cities
    if (savedCities[i].city == $('#searchInput').val()) { // if one matches the search
      var cityName = $('#searchInput').val();
      dataRender(cityName);                               // Display data for that search
      found = true;
      $(`#${cityName}`).toggleClass('active');            // Change list item to active
      $('#searchInput').val('');                          // Empty the search box
      break;                                              // end the function
    }
  }

  // make new object for city search
  if ($('#searchInput').val() !== '' && (found == false)) {
    var cityName = $('#searchInput').val();

    var newCity = {
      city: cityName
    }
    savedCities.push(newCity);

    $('#searchInput').val('');
    // Add new city to saved cities array
    localStorage.setItem('cities', JSON.stringify(savedCities));


    // Create new list item
    var newSearchItem = $('<li/>').attr('class', 'list-group-item active').attr('id', cityName);
    newSearchItem.text(cityName);
    $('#searchList').prepend(newSearchItem);

    dataRender(cityName);

  }

})

// Save searches persist on refresh
function renderSavedCities() {
  for (i = 0; i < savedCities.length; i++) {
    var cityName = savedCities[i].city;
    var newSearchItem = $('<li/>').attr('class', 'list-group-item').attr('id', cityName);
    newSearchItem.text(cityName);
    $('#searchList').prepend(newSearchItem);
  }
}
renderSavedCities()


// Displays weather data on page
function dataRender(cityName) {
  var apiKey = 'c2a92e28123db3bc43faafb0a9eb3c40';
  var cityURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;

  $.ajax({
    url: cityURL,
    method: "GET",
    error: function () {
      alert('Not a city...');
    }
  }).then(function (response) {

    var lat = response.coord['lat'];
    var lon = response.coord['lon'];
    var oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly&appid=' + apiKey;
    console.log(response);

    $.ajax({
      url: oneCallUrl,
      method: "GET"
    }).then(function (response) {
      // Current city data display
      var iconCode = response.current.weather[0].icon;
      var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
      var imgDiv = $('<img>').attr('src', iconUrl);
      $('#cityNameDisplay').text('City: ' + cityName).append(imgDiv);
      $('#tempDisplay').text('Temperature: ' + ((Math.floor((response.current.temp) - 273.15) * 1.80 + 32)).toFixed(1) + 'F');
      $('#humidityDisplay').text('Humidity: ' + response.current.humidity + '%');
      $('#windSpeedDisplay').text('Wind Speed: ' + Math.floor(response.current.wind_speed * 1.151) + 'mph');
      $('#uvIndexDisplay').text('UV Index: ');
      $('#currentWeatherDisplay').css('display', 'block');
      // Mouse over effect for uv index colors
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
      $('#uvIndexDisplay').hover(function () {
        $(this).css('cursor', 'pointer').attr('title', uvHoverText);
      }, function () {
        $(this).css('cursor', 'auto');
      })
      // Forecast display
      for (i = 0; i < 5; i++) {
        // Day of the week and the date

        var dayOfWeek = moment().day();
        $('#day' + i + '').text((moment().day(dayOfWeek + 1 + i).format('dddd')) + ' ' + (moment().add(i + 1, 'days').format('MM/DD/YYYY')));
        $('#day' + i + '').append('<br>');
        var iconCode = response.daily[i].weather[0].icon;
        var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
        var imgDiv = $('<img>').attr('src', iconUrl);
        $('#day' + i + '').append('<img src=' + iconUrl + ' />');
        $('#day' + i + '').append('<p>' + 'Temperature: ' + ((Math.floor((response.daily[i].temp.day) - 273.15) * 1.80 + 32)).toFixed(1) + 'F' + '</p>')
        $('#day' + i + '').append('<p>' + 'Humidity: ' + response.daily[i].humidity + '%' + '</p>');
      }
      $('#forecastTab').css('display', 'block');

      // Map Stuff
      function lon2tile(lon, zoom) { return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom))); }
      function lat2tile(lat, zoom) { return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))); }
      var zoom = 3;
      var lonTile = lon2tile(lon, zoom);
      var latTile = lat2tile(lat, zoom);
      // var temperatureMapUrl = 'https://tile.openweathermap.org/map/temp_new/' + zoom + '/' + lonTile + '/' + latTile + '.png?appid=' + apiKey;
      // var mapDiv = $('<img>').attr('src', temperatureMapUrl);
      // $('#temperatureMap').empty();

      // $('#temperatureMap').append(mapDiv);

      // Temperature Map
      mapMaker('temp_new', 'temperatureMap');

      // Percipitation Map
      mapMaker('precipitation_new', 'percipitationMap');

            // Percipitation Map
            mapMaker('wind_new', 'windMap');

      function mapMaker(layer, divID) {
        var url = 'https://tile.openweathermap.org/map/' + layer + '/' + zoom + '/' + lonTile + '/' + latTile + '.png?appid=' + apiKey;
        var mapImg = $('<img>').attr('src', url);
        $('#' + divID).empty();
        $('#' + divID).append(mapImg);
      }
    })
  })

}


