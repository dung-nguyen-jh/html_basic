function init() {
  // general map configuarion
  const config = {
    language: "en",
    limit: 5,
    zoom: 9,
    language: "en",
  };

  const ACCESS_TOKEN =
    "pk.eyJ1IjoidGhpbmhsZTk5IiwiYSI6ImNsdHd1M3RjejAxYmwyaXBvbWRvN3VldW0ifQ.u_n9TO0Rr00-a65HjZ-0Fw";

  //map initialization using access token
  mapboxgl.accessToken = ACCESS_TOKEN;
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: [-73.99209, 40.68933],
    zoom: config.zoom,
  });

  //return authentification info including access token and session token
  //need to create session token in every request for the api to work
  const getAuthInfo = () => {
    const sessionToken = Math.random().toString(36).substring(2, 15);
    return {
      access_token: mapboxgl.accessToken,
      session_token: sessionToken,
    };
  };

  // Function to add a marker at the specified coordinates
  function addMarker(lngLat, msg) {
    //create a popup for the marker, containing the message from the user
    popup = new mapboxgl.Popup({ offset: 25 })
      .setHTML("<h3>Marker</h3><p>" + msg + "</p>")
      .addTo(map);

    //create a marker at the specified coordinates, and add the popup to it
    let marker = new mapboxgl.Marker()
      .setLngLat(lngLat)
      .setPopup(popup)
      .addTo(map);

    //specify the marker click event to toggle the popup
    marker.getElement().addEventListener("click", function (event) {
      // alert('You clicked on the marker');
      marker.togglePopup();
      event.stopPropagation();
    });
  }

  //handle the click event on the map to add marker on user click
  map.on("click", function (event) {
    // Retrieve the coordinates where the user clicked
    let lngLat = event.lngLat;

    // promt the user to enter a message for the marker
    let msg = prompt("Enter a message for the marker");
    if (msg) addMarker(lngLat, msg);
  });

  
  //get suggestions from the mapbox api based on the search input
  async function getSuggestions(searchInput) {
    try {
      const url = "https://api.mapbox.com/search/searchbox/v1/suggest";
      const auth = getAuthInfo();
      //generate the parameters for the api request including the search input, auth info, language and limit
      const params = {
        ...auth,
        q: searchInput,
        language: config.language,
        limit: config.limit,
      };
      //fetch the suggestions from the api
      const suggestionsResponse = await fetch(
        `${url}?${new URLSearchParams(params).toString()}`
      );
      const suggestionsData = await suggestionsResponse.json();

      return suggestionsData;
    } catch (error) {
      console.error("Suggestion fetch error:", error);
    }
  }

  async function getLocationData(locationId) {
    // the retrieve params are the same as the auth params
    const retrieveParams = getAuthInfo();
    try {
      //the url to retrieve the location data based on the location id
      const retrieveUrl = `https://api.mapbox.com/search/searchbox/v1/retrieve/${encodeURIComponent(
        locationId
      )}?${new URLSearchParams(retrieveParams).toString()}`;

      const resultResponse = await fetch(retrieveUrl);
      const resultData = await resultResponse.json();

      return resultData;
    } catch (error) {
      console.error("Fetch location details error:", error);
    }
  }

  //handle the click event on the search result to fly to the location on the map
  async function onSearchResultClick(event) {
    try {
      //get the location data based on the location id
      const locationData = await getLocationData(event.target.id);
      if (!locationData) return;
      //fly to the location on the map
      map.flyTo({
        center: locationData.features[0].geometry.coordinates,
        zoom: config.zoom,
        essential: true,
      });
      //set the search input to the selected location
      document.getElementById("searchInput").value = event.target.textContent;
    } catch (error) {
      console.error("Result click error:", error);
    }
  }

  function debounce(func, delay) {
    let timeoutId;

    return function () {
      const context = this;
      const args = arguments;

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  }

  async function searchMapbox() {
    //get the search input value
    const searchInput = document.getElementById("searchInput").value.trim();
    const searchResultsDiv = document.getElementById("searchResults");
    if (searchInput === "" || searchInput === null || searchInput.length < 3) {
      // Clear search results if search input is empty
      searchResultsDiv.innerHTML = "";
      return; // If search input is empty, do nothing
    }

    //retrieve the suggestions from the mapbox api based on the search input
    const suggestionsData = await getSuggestions(searchInput);
    searchResultsDiv.innerHTML = "";

    //create a div for each suggestion and add it to the search results div
    suggestionsData.suggestions.forEach((feature) => {
      const name = feature.name;
      const resultDiv = document.createElement("div");
      resultDiv.innerHTML = `<p class="search-result-item" id="${feature.mapbox_id}">${name}</p>`;
      //handle the click event on the search result
      resultDiv.addEventListener("click", onSearchResultClick);
      //add the result div to the search results div
      searchResultsDiv.appendChild(resultDiv);
    });
  }

  // Adding event listener to input field to trigger search on keyup
  document
    .getElementById("searchInput")
    .addEventListener("keyup", function (event) {
      //set a delay of 300ms before triggering the search
      const decouncedSearch = debounce(searchMapbox, 300);
      decouncedSearch();
      event.preventDefault();
    });
}

init();
