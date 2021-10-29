mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: campground.geometry.coordinates,
  zoom: 7,
});
const marker1 = new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      '<h6>' + campground.title + '</h6>'
    )
  ) // add popup
  .addTo(map);
