//Add your LocationIQ Maps Access Token here (not the API token!)
locationiq.key = mapToken;
const locationName = `${city}, ${country}`;
const apiKey = mapToken;
let latitude;
let longitude;

// Construct the API URL
const apiUrl = `https://eu1.locationiq.com/v1/search.php?key=${apiKey}&q=${encodeURIComponent(
  locationName
)}&format=json`;

// Make the API request
async function fetchCordinates(params) {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data && data[0]) {
      latitude = data[0].lat;
      longitude = data[0].lon;
    } else {
      console.error("No results found");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchCordinates().then(() => {
  //Define the map and configure the map's theme
  var map = new maplibregl.Map({
    container: "map",
    style: locationiq.getLayer("Streets"),
    zoom: 12,
    center: [longitude, latitude], // starting position [log, lat]
  });
  // marker click effect!
  var popup = new maplibregl.Popup()
  .setHTML('<h4 className="pe-3">Extact Location will be provided after booking !</h4>Restify <br>');

  //   adding marker..
  new maplibregl.Marker().setLngLat([longitude, latitude]).setPopup(popup).addTo(map);


  //Define layers you want to add to the layer controls; the first element will be the default layer
  var layerStyles = {
    Streets: "streets/vector",
    Dark: "dark/vector",
    Light: "light/vector",
  };

  map.addControl(
    new locationiqLayerControl({
      key: locationiq.key,
      layerStyles: layerStyles,
    }),
    "top-left"
  );
});
