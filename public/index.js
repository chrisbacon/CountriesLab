var countries;
var mainMap

var makeRequest = function (url, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', url);
  request.onload = callback;
  request.send();
  };

  var populateSubRegions = function(subregions){
    var select = document.querySelector('#subregions');
    subregions.forEach(function(subregion){
      var option = document.createElement('option');
      option.innerText = subregion;
      option.value = JSON.stringify(subregion);
      select.appendChild(option);
    })
  }

var populateRegions = function(regions){
  var select = document.querySelector('#regions');
  regions.forEach(function(region){
    var option = document.createElement('option');
    option.innerText = region;
    option.value = JSON.stringify(region);
    select.appendChild(option);
  })
}

var populateCountries = function(countries, filter){
  var select = document.querySelector('#countries');
  select.innerHTML = "";
  countries.forEach(function(country){
    if (country.region === filter || filter === "") {
      var option = document.createElement('option');
      option.innerText = country.name;
      option.value = JSON.stringify(country);
      select.appendChild(option);
    }
  })
}

var populateCountriesBySubRegions = function(countries, filter){
  var select = document.querySelector('#countries');
  select.innerHTML = "";
  countries.forEach(function(country){
    if (country.subregion === filter || filter === "") {
      var option = document.createElement('option');
      option.innerText = country.name;
      option.value = JSON.stringify(country);
      select.appendChild(option);
    }
  })
}

var requestCompleteCountries = function () {
  if (this.status != 200) return;
  var jsonString = this.responseText;
  countries = JSON.parse(jsonString);
  populateCountries(countries, "");

  var regions = []

  for (var country of countries) {
    if (!regions.includes(country.region)) {
      regions.push(country.region);
    }
  }
  populateRegions(regions);

  var subregions = []

  for (var country of countries) {
    if (!subregions.includes(country.subregion)) {
      subregions.push(country.subregion);
    }
  }
  populateSubRegions(subregions);
}

var initialiseSelects = function(){
    var url = 'https://restcountries.eu/rest/v1/all';
    makeRequest(url, requestCompleteCountries);
  }

var borderingCountries = function (country) {
  var newBorders = [];
  var borders = country.borders;
  borders.forEach(function(element){
    for (var country of countries){
      if (element === country.alpha3Code) {
        newBorders.push(country);
      }
    }
  });
  return newBorders;
}

var addNewLi = function(ul, text) {
  var li = document.createElement('li');
  li.innerText =(text);
  ul.appendChild(li);
}

var handleSelect = function() {
  var ul = document.querySelector('#data-list');
  ul.innerHTML = "";
  var country = JSON.parse(this.value);

  addNewLi(ul, "Country: " + country.name);
  addNewLi(ul, "Population: " + country.population);
  addNewLi(ul, "Capital: " + country.capital);

  var borders = borderingCountries(country);
  var borderUl = document.createElement('ul');

  var li = document.createElement('li');
  li.innerText = ("Borders: ");
  ul.appendChild(li);

  li.appendChild(borderUl);
  for (border of borders) {
    var li = document.createElement('li');
    li.innerText = ("Country: " + border.name);
    borderUl.appendChild(li);
  }
  var latitudLongitud = {lat: country.latlng[0],lng: country.latlng[1]}

  console.log(latitudLongitud)
  mainMap.addMarker(latitudLongitud);
  mainMap.setCenter(latitudLongitud);

  
  localStorage.setItem('lastCountry', this.value)
}

var filterByRegion = function () {
  var region = JSON.parse(this.value);

  populateCountries(countries, region)

}

var filterBySubRegion = function () {
  var subregion = JSON.parse(this.value);

  populateCountriesBySubRegions(countries, subregion)

}


var app = function () {

  initialiseSelects();

  var selectDropDown1 = document.querySelector('#countries');
  selectDropDown1.onchange = handleSelect;

  var selectDropDown2 = document.querySelector('#regions');
  selectDropDown2.onchange = filterByRegion;

  var selectDropDown3 = document.querySelector('#subregions');
  selectDropDown3.onchange = filterBySubRegion;

  var mapDiv = document.querySelector('#main-map')
  
  mainMap = new MapWrapper(mapDiv, {lat: 0, lng: 0}, 5);
}

window.onload = app;