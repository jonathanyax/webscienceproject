

    /*
		var setBounds= new google.maps.LatLngBounds(
        new google.maps.LatLng(40.922, -74.175), 
        new google.maps.LatLng(40.462, -73.763));
      map.fitBounds(setBounds);
    */
    



//$(document).ready(function() {
  function init() {

    var markers = [];
    var map = new google.maps.Map(document.getElementById('map'), {
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    



    var setBounds;

    console.log($("#dropdown").val());

    //set bounds based on dropdown box
    if ($("#dropdown").val() == "ny") {
      setBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(40.922, -74.175), 
        new google.maps.LatLng(40.462, -73.763));
      map.fitBounds(setBounds);
    }
    else if ($("#dropdown").val() == "capital") {
      setBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(42.853, -74.611), 
        new google.maps.LatLng(42.617, -73.645));
      map.fitBounds(setBounds);
    }
    else if ($("#dropdown").val() == "sanfrancisco") {
      setBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(38.008, -122.651), 
        new google.maps.LatLng(37.452, -121.906));
      map.fitBounds(setBounds);
    }
    else if ($("#dropdown").val() == "boston") {
      setBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(42.471, -71.277), 
        new google.maps.LatLng(42.217, -70.872));
      map.fitBounds(setBounds);
    }




    // Create search box
    var search = document.getElementById('searchbox');

    var searchBox = new google.maps.places.SearchBox(search);

    
    google.maps.event.addListener(searchBox, 'places_changed', function() {

      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }
      for (var i = 0; i<markers.length; i++) {
        markers[i].setMap(null);
      }

      markers = [];
      var bounds = new google.maps.LatLngBounds();
      for (var i = 0; i<places.length; i++) {
        var image = {
          url: places[i].icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };


        var marker = new google.maps.Marker({
          map: map,
          icon: image,
          title: places[i].name,
          position: places[i].geometry.location
        });

        markers.push(marker);

        bounds.extend(places[i].geometry.location);



      }

      map.fitBounds(bounds);


    });

    google.maps.event.addListener(map, 'bounds_changed', function() {
      var bounds = map.getBounds();
      searchBox.setBounds(bounds);
      
    });



  }




  google.maps.event.addDomListener(window, 'load', init);

//});      



//$('#map').hide();

/*
$("#searchbox").click({
  $("#map").show();
});
*/