// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
function initMap() {
    // Create the map.
    const hartford = { lat: 41.7658, lng: -72.6734 };
    const map = new google.maps.Map(document.getElementById("map"), {
      center: hartford,
      zoom: 17,
      mapId: "8d193001f940fde3",
    });
    // Create the places service.
    const service = new google.maps.places.PlacesService(map);
    let getNextPage;
    /* const moreButton = document.getElementById("more");
  
    moreButton.onclick = function () {
      moreButton.disabled = true;
      if (getNextPage) {
        getNextPage();
      }
    }; */
  
    // Perform a nearby search.
    service.nearbySearch(
      { location: hartford, radius: 1800, type: "restaurant" },
      (results, status, pagination) => {
        if (status !== "OK" || !results) return;
  
        addPlaces(results, map);
        /* moreButton.disabled = !pagination || !pagination.hasNextPage;
        if (pagination && pagination.hasNextPage) {
          getNextPage = () => {
            // Note: nextPage will call the same handler function as the initial call
            pagination.nextPage();
          };
        } */
      }
    );
  }
  
  function addPlaces(places, map) {
    const placesList = document.getElementById("places");
    const placeDetails = document.getElementById("placeDetails");
    let resultCount = 0;

    for (const place of places) {
      if (resultCount < 5) {
        console.log(placeDetails);
        if (place.geometry && place.geometry.location) {
          const image = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25),
          };

          const request = {
            placeId: place.place_id,
            fields: ["name", "formatted_address", "place_id", "geometry"],
          };

          const infowindow = new google.maps.InfoWindow();
          const service = new google.maps.places.PlacesService(map);

          service.getDetails(request, (place, status) => {
      
            const marker = new google.maps.Marker({
              map,
              icon: image,
              title: place.name,
              position: place.geometry.location,
            });

            const li = document.createElement("li");
      
            li.textContent = place.name;
            placesList.appendChild(li);
            li.addEventListener("click", () => {
              map.setCenter(place.geometry.location);
            });

            google.maps.event.addListener(marker, "click", () => {
              while (placeDetails.hasChildNodes()) {
                console.log('remove child nodes');
                placeDetails.removeChild(placeDetails.firstChild);
              }

              const content = document.createElement("div");

              const nameElement = document.createElement("h2");

              nameElement.textContent = place.name;
              content.appendChild(nameElement);

              //const placeIdElement = document.createElement("p");

              //placeIdElement.textContent = place.place_id;
              //content.appendChild(placeIdElement);

              const placeAddressElement = document.createElement("p");

              placeAddressElement.textContent = place.formatted_address;
              content.appendChild(placeAddressElement);

              //infowindow.setContent(content);
              //infowindow.open(map, marker);

              placeDetails.appendChild(content);
              console.log(placeDetails);
              console.log(content);
            });
      
            
          });

          resultCount++;
        }
      }
    }
  }