function init() {
  const ACCESS_TOKEN =
    "pk.eyJ1IjoidGhpbmhsZTk5IiwiYSI6ImNsdHd1M3RjejAxYmwyaXBvbWRvN3VldW0ifQ.u_n9TO0Rr00-a65HjZ-0Fw";

  mapboxgl.accessToken = ACCESS_TOKEN;
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: [-73.99209, 40.68933],
    zoom: 8.8,
  });

  const searchJS = document.getElementById("search-js");
  searchJS.onload = function () {
    const searchBox = new MapboxSearchBox();
    searchBox.accessToken = ACCESS_TOKEN;
    searchBox.options = {
      types: "address,poi",
      proximity: [-73.99209, 40.68933],
    };
    searchBox.marker = true;
    searchBox.mapboxgl = mapboxgl;
    map.addControl(searchBox);
  };

  map.on("click", function (event) {
    // Retrieve the coordinates where the user clicked
    let lngLat = event.lngLat;

    // Check if a marker was clicked
    let features = map.queryRenderedFeatures(event.point, {
      layers: ["markers"],
    });

    // If a marker was clicked, remove it
    if (features.length) {
      let markerId = features[0].properties.markerId;
      let marker = markers[markerId];
      marker.remove();
      delete markers[markerId];
    } else {
      // Otherwise, add a marker at the clicked location
      let msg = prompt("Enter a message for the marker");
      if (msg) addMarker(lngLat, msg);
    }
  });

  // Function to add a marker at the specified coordinates
  function addMarker(lngLat, msg) {
    popup = new mapboxgl.Popup({ offset: 25 })
      .setHTML("<h3>Marker</h3><p>" + msg + "</p>")
      .addTo(map);

    let marker = new mapboxgl.Marker().setLngLat(lngLat).addTo(map);

    marker.getElement().addEventListener("click", function (event) {
      // alert('You clicked on the marker');
      marker.togglePopup();
      event.stopPropagation();
    });
  }
}
init();
