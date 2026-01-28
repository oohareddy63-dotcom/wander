const mapDiv = document.getElementById("map");

if (mapDiv && typeof mapboxgl !== "undefined") {
  try {
    const mapToken = mapDiv.dataset.mapToken;
    const rawCoordinates = mapDiv.dataset.coordinates;
    const title = mapDiv.dataset.title || "Listing";
    const location = mapDiv.dataset.location || "";

    if (!mapToken || !rawCoordinates) {
      console.warn("Mapbox: missing token or coordinates, skipping map render.");
    } else {
      const coordinates = JSON.parse(rawCoordinates);

      mapboxgl.accessToken = mapToken;

      const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: coordinates,
        zoom: 9,
      });

      new mapboxgl.Marker({ color: "red" })
        .setLngLat(coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h5>${title}</h5><p>${location}</p>`
          )
        )
        .addTo(map);
    }
  } catch (err) {
    console.error("Error initialising Mapbox map:", err);
  }
}
