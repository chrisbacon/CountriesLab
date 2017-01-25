var MapWrapper = function (container, coords, zoom) {
  this.googleMap = new google.maps.Map(container, {
    center: coords,
    zoom: zoom
  });

  this.markers = [];
};

MapWrapper.prototype = {
  addMarker: function(coords){
    this.clearMarkers();
    var infowindow = new google.maps.InfoWindow({
    });
    var marker = new google.maps.Marker({
      position: coords,
      draggable: true,
      map: this.googleMap
    });
    marker.addListener('click', function() {
      infowindow.open(this.googleMap, marker);
    });

    this.markers.push(marker);
  },
  addClickEvent: function(){
    google.maps.event.addListener(this.googleMap, "click", function(event){
      console.log(event);
      var latitude = event.latLng.lat();
      var longitude = event.latLng.lng();
      var newCords = {lat: latitude, lng: longitude}
      this.addMarker(newCords)
    }.bind(this))
  },
  setCenter: function(coords){
    this.googleMap.setCenter(coords)
  },

  clearMarkers: function() {
    for (var marker of this.markers) {
      marker.setMap(null);
    };
    this.markers = [];
  }
}