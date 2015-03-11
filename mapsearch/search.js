$(document).ready(function(){

	function init() {
		var map = new google.maps.Map(document.getElementById("map"), {
				mapTypeId : google.maps.mapTypeId.ROADMAP 
		});

    /*
		var setBounds= new google.maps.LatLngBounds(
        new google.maps.LatLng(40.922, -74.175), 
        new google.maps.LatLng(40.462, -73.763));
      map.fitBounds(setBounds);
    */
  
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
    else if ($("#dropdown").val() == "chicago") {
      setBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(42.049, -87.967), 
        new google.maps.LatLng(41.716, -87.532));
      map.fitBounds(setBounds);
    }



    //create search box
    var searchBox = document.getElementById("searchbox");
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchBox);

    var search = new google.maps.places.SearchBox(searchBox);

    //dropdown list
    google.maps.event.addListener(search, "places_changed", function() {
      var place_list = search.getPlaces();

      

      //no places
      if (places.length == 0) {
        return;
      }


      var markers = [];
      var newBounds = new google.maps.LatLngBounds();


      for (var i = 0; i < places.length; i++) {


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

	}
});