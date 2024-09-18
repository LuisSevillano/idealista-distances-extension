const apiKey = "27fef946-b325-46ab-a40c-698b24a9e94a";
// Fetch coordinates and calculate the driving distance
function fetchRouteData(latitude, longitude, callback) {
  console.log("fetchRouteData", { latitude, longitude, callback });

  const start = "40.4168,-3.7038"; // Madrid coordinates
  const end = `${latitude},${longitude}`;

  const routeUrl = `https://graphhopper.com/api/1/route?point=${start}&point=${end}&vehicle=car&key=${apiKey}`;

  fetch(routeUrl)
    .then(processRouteResponse)
    .then((data) => calculateTimeAndDistance(data, callback))
    .catch(logRouteError);
}

// Handle the response from the GraphHopper API
function processRouteResponse(response) {
  console.log("processRouteResponse");
  console.log(response);
  return response.json();
}

// Calculate time and distance from the route data
function calculateTimeAndDistance(data, callback) {
  console.log("calculateTimeAndDistance");
  console.log({ data, callback });
  const path = data.paths[0];
  const timeInSeconds = path.time / 1000; // Convert time to seconds
  const distanceInKm = parseInt(path.distance / 1000); // Convert distance to kilometers

  const timeInMinutes = Math.floor(timeInSeconds / 60);
  const hours = Math.floor(timeInMinutes / 60);
  const minutes = timeInMinutes % 60;

  const timeFormatted = formatTime(hours, minutes);
  const color = getTimeColor(hours, minutes);

  callback(distanceInKm, timeFormatted, color);
}

// Format the time to display it in hours and minutes
function formatTime(hours, minutes) {
  console.log("formatTime", { hours, minutes });
  return hours > 0 ? `${hours}h and ${minutes}m` : `${minutes}m`;
}

// Determine the color based on the travel time
function getTimeColor(hours, minutes) {
  console.log("getTimeColor", { hours, minutes });
  const totalHours = hours + minutes / 60;
  if (totalHours >= 3) {
    return { color: "red", className: "discarded" }; // More than 3 hours
  } else if (totalHours >= 2) {
    return { color: "orange", className: "target-orange" }; // Between 2 and 3 hours
  } else {
    return { color: "green", className: "target-green" }; // Less than 2 hours
  }
}

function getPopupHTMLTemplate(distance, time, colorData) {
  return `<div>
            <span class="close-btn">×</span>
            <p class="">
                <span class="color-distance" style="color: ${colorData.color};">${time}</span> from Madrid
                <span class="km-distance"> (${distance}km)</span>
            </p>
        </div>`;
}

// Create the popup displaying the distance and travel time
function createPopup(distance, time, color, isList) {
  console.log("createPopup", { distance, time, color });
  const popup = document.createElement("div");
  popup.className = "floating-distance-popup";
  if (isList === true) {
    popup.className += " in-list";
  }
  popup.innerHTML = getPopupHTMLTemplate(distance, time, color);
  return popup;
}

// Display the popup for each listing item
function displayPopupInListing(item, latitude, longitude) {
  console.log("displayPopupInListing", { item, latitude, longitude });
  const isList = true;

  // Ensure only one popup is present per listing
  let existingPopup = item.querySelector(".floating-distance-popup");
  if (existingPopup) {
    existingPopup.remove();
  }

  const popup = createPopup("", "", "green", isList);

  // Insert the popup just above the element with the 'price-row' class
  const priceRow = item.querySelector(".price-row");
  priceRow.parentNode.insertBefore(popup, priceRow);

  fetchRouteData(latitude, longitude, (distance, time, color) => {
    item.classList.add(color.className);
    updatePopupContent(popup, distance, time, color);
  });
}

// Update the content of the popup with the actual data
function updatePopupContent(popup, distance, time, color) {
  console.log("updatePopupContent", { popup, distance, time, color });
  popup.innerHTML = getPopupHTMLTemplate(distance, time, color);
  popup
    .querySelector(".close-btn")
    .addEventListener("click", closePopup.bind(null, popup));
}

// Close the popup by removing it from the DOM
function closePopup(popup) {
  popup.remove();
}

// Handle entries for each listing item that is being observed
function handleListingItem(entries, observer) {
  console.log("handleListingItem", { entries });
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const item = entry.target;
      const id = item.getAttribute("data-element-id");
      console.log({ item, id });
      if (id) {
        fetchListingData(id, item);
        observer.unobserve(entry.target); // Stop observing once the popup is loaded
      }
    }
  });
}

// Fetch data for a listing from Idealista's API
function fetchListingData(id, item) {
  console.log("fetchListingData", { id, item });
  const apiUrl = `https://www.idealista.com/es/openDetailGallery/${id}?`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const coordinates = data.data.map.coordinates;
      if (coordinates && coordinates.latitude && coordinates.longitude) {
        displayPopupInListing(
          item,
          coordinates.latitude,
          coordinates.longitude,
        );
      }
    });
}

// Observe all listing elements in the page
function observeListings() {
  console.log("observeListings");
  const observer = new IntersectionObserver(handleListingItem, {
    rootMargin: "0px 0px 500px 0px",
  });

  document.querySelectorAll(".item").forEach((item) => {
    observer.observe(item);
  });
}

// Handle detailed view for an individual property
function handleDetailView() {
  console.log("handleDetailView");
  const url = window.location.href;
  const match = url.match(/\/inmueble\/(\d+)/);
  if (match) {
    const propertyId = match[1];
    fetchDetailData(propertyId);
  }
}

// Fetch data for the detailed view of a listing
function fetchDetailData(propertyId) {
  console.log("fetchDetailData", { propertyId });
  const apiUrl = `https://www.idealista.com/es/openDetailGallery/${propertyId}?`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((response) => {
      const { coordinates } = response.data.map;
      if (coordinates && coordinates.latitude && coordinates.longitude) {
        const popup = createPopup("", "", "green");
        document.body.appendChild(popup);
        fetchRouteData(
          coordinates.latitude,
          coordinates.longitude,
          (distance, time, color) => {
            updatePopupContent(popup, distance, time, color);
          },
        );
      }
    });
}

// Log any route-related errors
function logRouteError(error) {
  console.error("Error fetching the route:", error);
}

// Determine the context of the page and trigger the appropriate functions
window.addEventListener("load", function () {
  if (window.location.href.includes("/inmueble/")) {
    handleDetailView();
  } else {
    observeListings();
  }
});
