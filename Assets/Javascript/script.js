// Assets
var cityName = '';
var lat = 0;
var lon = 0;

// Search results local storage
var savedCities = JSON.parse(localStorage.getItem("cities")) || [];

// SEARCH AREA //
// Search result list on-clicks
$('#searchList').on('click', '.list-group-item', function () {
  clearListActive();
  $(this).toggleClass('active');
  dataRender($(this).text());
})

// Colorize search result list item
function colorListActive() {
  clearListActive();
  $('#' + ($('#searchInput').val())).toggleClass('active');
}

// Decolorize search result list item
function clearListActive() {
  $('.list-group-item').each(function () {
    $(this).removeClass('active');
  })
}

// Clear all button
$('#clearBtn').on('click', function () {
  $('#searchList').empty();
  localStorage.clear();
  location.reload();
  $('#clearBtn').css('display', 'none')
})

// SEARCH LIST AND LOCAL STORAGE //
// When search button clicked
$('#searchBtn').click(function () {
  // Clear list color first
  clearListActive();

  // Check if there's duplicate searches
  var found = false;

  // If user searches for a previously searched city
  for (i = 0; i < savedCities.length; i++) {              // For all saved city searches
    if (savedCities[i].city == $('#searchInput').val()) { // If one matches the current search
      var cityName = $('#searchInput').val();
      dataRender(cityName);                               // Display data for that search
      found = true;
      $(`#${cityName}`).toggleClass('active');            // Colorize existing list item
      $('#searchInput').val('');                          // Empty the search field
      break;
    }
  }

  // If user searches a new city
  if ($('#searchInput').val() !== '' && (found == false)) {
    // Add new city to local storage
    var cityName = $('#searchInput').val();
    var newCity = {
      city: cityName
    }
    savedCities.push(newCity);
    $('#searchInput').val('');
    localStorage.setItem('cities', JSON.stringify(savedCities));

    // Create new list item
    var newSearchItem = $('<li/>').attr('class', 'list-group-item active span').attr('id', cityName);
    newSearchItem.text(cityName);
    $('#searchList').prepend(newSearchItem);

    // Display clear all button
    if ($('#clearBtn').css('display') == ('none')) {
      $('#clearBtn').css('display', 'block')
    }

    // Display weather data
    dataRender(cityName);
  }
})

// Save search list persists on page refresh
function renderSavedCities() {
  for (i = 0; i < savedCities.length; i++) {
    var cityName = savedCities[i].city;
    var newSearchItem = $('<li/>').attr('class', 'list-group-item').attr('id', cityName);
    newSearchItem.text(cityName);
    $('#searchList').prepend(newSearchItem);
    $('#clearBtn').css('display', 'block')
  }
}
renderSavedCities();

// WEATHER API CALLS AND PAGE DISPLAY //
// Displays weather data on page
function dataRender(cityName) {
  var apiKey = 'c2a92e28123db3bc43faafb0a9eb3c40';
  var cityURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;
  
  // API call for search by city name
  $.ajax({
    url: cityURL,
    method: "GET",
    error: function () {
      alert("Sorry, we couldn't find the city you were looking for. Please check the spelling and try again.");
    }
  }).then(function (response) {

    // Collect latitute and longitude data for searched city
    var lat = response.coord['lat'];
    var lon = response.coord['lon'];
    var oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly&appid=' + apiKey;

    // API call using on lat/lon
    $.ajax({
      url: oneCallUrl,
      method: "GET"
    }).then(function (response) {

      // CURRENT CITY WEATHER DISPLAY //
      $('#currentWeatherBlock').css('display', 'block');
      
      // Icon
      var iconCode = response.current.weather[0].icon;
      var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
      var imgDiv = $('<img>').attr('src', iconUrl).attr('alt', 'forecast weather icon');

      // Data
      $('#cityNameDisplay').text('City: ' + cityName).append(imgDiv);
      $('#tempDisplay').text('Temperature: ' + ((Math.floor((response.current.temp) - 273.15) * 1.80 + 32)).toFixed(1) + 'F');
      $('#humidityDisplay').text('Humidity: ' + response.current.humidity + '%');
      $('#windSpeedDisplay').text('Wind Speed: ' + Math.floor(response.current.wind_speed * 1.151) + 'mph');
      $('#uvIndexDisplay').text('UV Index: ');
      $('#currentWeatherDisplay').css('display', 'block');

      // Mouseover effect for uv index colors
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

      // FORECAST DISPLAY //
      for (i = 0; i < 5; i++) {
        // Day of the week and the date
        var dayOfWeek = moment().day();
        $('#day' + i + '').text((moment().day(dayOfWeek + 1 + i).format('dddd')) + ' ' + (moment().add(i + 1, 'days').format('MM/DD/YYYY')));
        $('#day' + i + '').append('<br>');

        // Icon
        var iconCode = response.daily[i].weather[0].icon;
        var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
        var imgDiv = $('<img>').attr('src', iconUrl);
        $('#day' + i + '').append('<img src=' + iconUrl + ' />');
        
        // Temperature and humidity
        $('#day' + i + '').append('<p>' + 'Temperature: ' + ((Math.floor((response.daily[i].temp.day) - 273.15) * 1.80 + 32)).toFixed(1) + 'F' + '</p>')
        $('#day' + i + '').append('<p>' + 'Humidity: ' + response.daily[i].humidity + '%' + '</p>');
      }
      $('#forecastTab').css('display', 'block');

      // MAPS DISPLAY //
      // Convert lat/lon coords to zoom-level tiles
      function lon2tile(lon, zoom) { return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom))); }
      function lat2tile(lat, zoom) { return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))); }
      var zoom = 3;
      var lonTile = lon2tile(lon, zoom);
      var latTile = lat2tile(lat, zoom);

      // Temperature, percipitation and wind maps
      mapMaker('temp_new', 'temperatureMap', 'A map displaying regional temperatures');
      mapMaker('precipitation_new', 'percipitationMap', 'A map displaying regional percipitation');
      mapMaker('wind_new', 'windMap', 'A map displaying regional winds');

      // Map rendering
      function mapMaker(layer, divID, altText) {
        var url = 'https://tile.openweathermap.org/map/' + layer + '/' + zoom + '/' + lonTile + '/' + latTile + '.png?appid=' + apiKey;
        var mapImg = $('<img>').attr('src', url).attr('alt', altText);
        $('#' + divID).empty();
        $('.mapDiv').css('display', 'block');
        $('#' + divID).append(mapImg);
      }
    })
  })
}