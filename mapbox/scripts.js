function init() {
  const searchList = [];
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
  // Function to call the Mapbox API and display search results
  function searchMapbox() {
    const searchInput = document.getElementById("searchInput").value.trim();
    const searchResultsDiv = document.getElementById("searchResults");
    if (searchInput === "" || searchInput === null || searchInput.length < 3) {
      searchResultsDiv.innerHTML = "";

      return; // If search input is empty, do nothing
    }

    let sessionToken = Math.random().toString(36).substring(2, 15);

    // API endpoint
    const url = "https://api.mapbox.com/search/searchbox/v1/suggest";
    // Parameters
    const params = {
      q: searchInput,
      language: "en",
      limit: 5,
      access_token: mapboxgl.accessToken,
      session_token: sessionToken,
    };

    // Constructing URL with parameters
    let queryString = Object.keys(params)
      .map((key) => key + "=" + encodeURIComponent(params[key]))
      .join("&");
    const fullUrl = url + "?" + queryString;
    console.log(fullUrl);

    // Making API request
    fetch(fullUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        
        searchResultsDiv.innerHTML = ""; // Clear previous results
        // Displaying result
        data.suggestions.forEach((feature) => {
          const name = feature.name;
          const resultDiv = document.createElement("div");
          resultDiv.innerHTML = `<p class = "search-result-item" , id = "${feature.mapbox_id}">${name}</p>`;
          searchResultsDiv.appendChild(resultDiv);
        });
        const resultList = Array.from(searchResultsDiv.children);
        resultList.forEach(result => {
          result.addEventListener("click", function (event) {
            console.log(event.target.id);
              let session_token = Math.random().toString(36).substring(2, 15);
              document.getElementById("searchInput").value = result.textContent;
              const retrieveUrl = `https://api.mapbox.com/search/searchbox/v1/retrieve/${encodeURIComponent(event.target.id)}?access_token=${encodeURIComponent(mapboxgl.accessToken)}&session_token=${encodeURIComponent(session_token)}`
              console.log(retrieveUrl);
              fetch(retrieveUrl)
              .then((response) => {
                return response.json();
              })
              .then((data) => {
                console.log(data);
                map.flyTo({
                  center: data.features[0].geometry.coordinates,
                  zoom: 15,
                  essential: true
                });
              })
              .catch((error) => console.error("Error:", error))
          });
        });
      })
      .catch((error) => console.error("Error:", error));
  }

  // Adding event listener to input field to trigger search on keyup
  document
    .getElementById("searchInput")
    .addEventListener("keyup", function (event) {
      // Number 13 is the "Enter" key on the keyboard
      searchMapbox();
      event.preventDefault();
    });
}
init();
