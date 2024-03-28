function init() {
  const config = {
    language: "en",
    limit: 5,
    zoom: 9,
    language: "en",
  };

  const ACCESS_TOKEN =
    "pk.eyJ1IjoidGhpbmhsZTk5IiwiYSI6ImNsdHd1M3RjejAxYmwyaXBvbWRvN3VldW0ifQ.u_n9TO0Rr00-a65HjZ-0Fw";

  mapboxgl.accessToken = ACCESS_TOKEN;
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: [-73.99209, 40.68933],
    zoom: config.zoom,
  });

  const searchInput = document.getElementById("searchInput")

  const getAuthInfo = () => {
    const sessionToken = Math.random().toString(36).substring(2, 15);
    return {
      access_token: mapboxgl.accessToken,
      session_token: sessionToken,
    };
  };

  function addMarker(lngLat, msg) {
    popup = new mapboxgl.Popup({ offset: 25 })
      .setHTML("<h3>Marker</h3><p>" + msg + "</p>")
      .addTo(map);

    const marker = new mapboxgl.Marker()
      .setLngLat(lngLat)
      .setPopup(popup)
      .addTo(map);

    marker.getElement().addEventListener("click", function (event) {
      marker.togglePopup();
      event.stopPropagation();
    });
  }

  async function getSuggestions(searchInput) {
    try {
      const url = "https://api.mapbox.com/search/searchbox/v1/suggest";
      const auth = getAuthInfo();
      const params = {
        ...auth,
        q: searchInput,
        language: config.language,
        limit: config.limit,
      };
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
    const retrieveParams = getAuthInfo();
    try {
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

  async function handleSearchResultClick(event) {
    try {
      const locationData = await getLocationData(event.target.id);
      if (!locationData) return;
      map.flyTo({
        center: locationData.features[0].geometry.coordinates,
        zoom: config.zoom,
        essential: true,
      });
      searchInput.value = event.target.textContent;
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
    const searchInput = document.getElementById("searchInput").value.trim();
    const searchResultsDiv = document.getElementById("searchResults");
    if (searchInput === "" || searchInput === null || searchInput.length < 3) {
      searchResultsDiv.innerHTML = "";
    }

    const suggestionsData = await getSuggestions(searchInput);
    searchResultsDiv.innerHTML = "";

    suggestionsData.suggestions.forEach((feature) => {
      const name = feature.name;
      const resultDiv = document.createElement("div");
      resultDiv.innerHTML = `<p class="search-result-item" id="${feature.mapbox_id}">${name}</p>`;
      resultDiv.addEventListener("click", handleSearchResultClick);
      searchResultsDiv.appendChild(resultDiv);
    });
  }

  function handleMapClick(event) {
    const lngLat = event.lngLat;
    const msg = prompt("Enter a message for the marker");
    if (msg) addMarker(lngLat, msg);
  }

  function handleSearchInputKeyup(event) {
      const decouncedSearch = debounce(searchMapbox, 300);
      decouncedSearch();
      event.preventDefault();
  }

  map.on("click", handleMapClick);

  searchInput.addEventListener("keyup", handleSearchInputKeyup);
}

init();
