// Fetch coordinates and calculate the driving distance
async function fetchRouteData(latitude, longitude) {
  const { apiKey, primaryOrigin, secondaryOrigin } =
    await chrome.storage.sync.get([
      "apiKey",
      "primaryOrigin",
      "secondaryOrigin",
    ]);

  const primaryCoordinates = primaryOrigin?.coordinates || "40.4168,-3.7038"; // Default to Madrid
  const end = `${latitude},${longitude}`;

  const primaryRouteUrl = `https://graphhopper.com/api/1/route?point=${primaryCoordinates}&point=${end}&vehicle=car&key=${apiKey}`;
  const primaryData = await fetchRoute(primaryRouteUrl);
  const primaryResult = calculateTimeAndDistance(
    primaryData,
    primaryOrigin?.city,
  );

  let secondaryResult = null;
  if (secondaryOrigin) {
    const secondaryCoordinates = secondaryOrigin.coordinates;
    const secondaryRouteUrl = `https://graphhopper.com/api/1/route?point=${secondaryCoordinates}&point=${end}&vehicle=car&key=${apiKey}`;
    const secondaryData = await fetchRoute(secondaryRouteUrl);
    secondaryResult = calculateTimeAndDistance(
      secondaryData,
      secondaryOrigin.city,
    );
  }

  return { primaryResult, secondaryResult };
}

// Fetch the route data from GraphHopper API
async function fetchRoute(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Error fetching the route data");
  }
  return response.json();
}

// Calculate time and distance from the route data
function calculateTimeAndDistance(data, locationLabel) {
  const path = data.paths[0];
  const timeInSeconds = path.time / 1000; // Convert time to seconds
  const distanceInKm = parseInt(path.distance / 1000); // Convert distance to kilometers

  const timeInMinutes = Math.floor(timeInSeconds / 60);
  const hours = Math.floor(timeInMinutes / 60);
  const minutes = timeInMinutes % 60;

  const timeFormatted = formatTime(hours, minutes);
  const color = getTimeColor(hours, minutes);

  return { distanceInKm, timeFormatted, color, locationLabel };
}

// Format the time to display it in hours and minutes
function formatTime(hours, minutes) {
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

// Determine the color based on the travel time
function getTimeColor(hours, minutes) {
  const totalHours = hours + minutes / 60;
  if (totalHours >= 3) {
    return { color: "red", className: "discarded" }; // More than 3 hours
  } else if (totalHours >= 2) {
    return { color: "orange", className: "target-orange" }; // Between 2 and 3 hours
  } else {
    return { color: "green", className: "target-green" }; // Less than 2 hours
  }
}

// Create the popup displaying the distance and travel time
function createPopup(isList = false, isSecondaryPopup = false) {
  const popup = document.createElement("div");
  popup.className = "floating-distance-popup";
  if (isSecondaryPopup === true) {
    popup.classList.add("secondary-popup");
  }
  if (isList === true) {
    popup.className += " in-list";
  }
  return popup;
}

function createDotIndicator(colorData) {
  const div = document.createElement("div");
  div.classList.add("dot-indicator");
  div.style.background = colorData.color;
  return div;
}

function getPopupHTMLTemplate(distance, time, colorData, locationLabel) {
  return `
    <p class="">
      <span class="color-distance" style="color: ${colorData.color};">
        ${time}
      </span>
      from ${locationLabel}
      <span class="km-distance"> (${distance} km)</span>
    </p>`;
}

// Update the content of the popup with the actual data
function updatePopupContent(popup, distance, time, color, locationLabel) {
  popup.innerHTML = getPopupHTMLTemplate(distance, time, color, locationLabel);
}

// Close the popup by removing the popup-container
function closePopup(popupContainer) {
  popupContainer.remove();
}

// Display the popup for each listing item
async function displayPopupInListing(item, latitude, longitude) {
  const isList = true;
  let popupContainer = item.querySelector(".popup-container");

  if (!popupContainer) {
    popupContainer = document.createElement("div");
    popupContainer.classList.add("popup-container");
    popupContainer.classList.add("in-list");

    // Add close button inside popup-container
    const closeButton = document.createElement("span");
    closeButton.classList.add("close-btn");
    closeButton.innerText = "×";
    closeButton.addEventListener("click", () => closePopup(popupContainer));
    popupContainer.appendChild(closeButton);

    const priceRow = item.querySelector(".price-row");
    priceRow.parentNode.insertBefore(popupContainer, priceRow);
  }

  const popupPrimary = createPopup(isList);
  popupContainer.appendChild(popupPrimary);

  try {
    const { primaryResult, secondaryResult } = await fetchRouteData(
      latitude,
      longitude,
    );
    const dotIndicator = createDotIndicator(primaryResult.color);
    item.classList.add(primaryResult.color.className);
    item.appendChild(dotIndicator);

    // Update popup for primary location
    updatePopupContent(
      popupPrimary,
      primaryResult.distanceInKm,
      primaryResult.timeFormatted,
      primaryResult.color,
      primaryResult.locationLabel,
    );

    // Handle secondary location popup
    if (secondaryResult) {
      const isSecondaryPopup = true;
      const popupSecondary = createPopup(isList, isSecondaryPopup);
      popupContainer.appendChild(popupSecondary);

      updatePopupContent(
        popupSecondary,
        secondaryResult.distanceInKm,
        secondaryResult.timeFormatted,
        secondaryResult.color,
        secondaryResult.locationLabel,
      );
    }
  } catch (error) {
    console.error("Error displaying popups:", error);
  }
}

// Handle entries for each listing item that is being observed
function handleListingItem(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const item = entry.target;
      const id = item.getAttribute("data-element-id");
      if (id) {
        fetchListingData(id, item);
        observer.unobserve(entry.target); // Stop observing once the popup is loaded
      }
    }
  });
}

// Fetch data for a listing from Idealista's API
async function fetchListingData(id, item) {
  const apiUrl = `https://www.idealista.com/es/openDetailGallery/${id}?`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const { coordinates } = data.data.map;
    if (coordinates && coordinates.latitude && coordinates.longitude) {
      displayPopupInListing(item, coordinates.latitude, coordinates.longitude);
    }
  } catch (error) {
    console.error("Error fetching listing data:", error);
  }
}

// Observe all listing elements on the page
function observeListings() {
  const observer = new IntersectionObserver(handleListingItem, {
    rootMargin: "0px 0px 500px 0px",
  });

  document.querySelectorAll(".item").forEach((item) => {
    observer.observe(item);
  });
}

// Handle detailed view for an individual property
async function handleDetailView() {
  const url = window.location.href;
  const match = url.match(/\/inmueble\/(\d+)/);
  if (match) {
    const propertyId = match[1];
    await fetchDetailData(propertyId);
  }
}

// Fetch data for the detailed view of a listing
async function fetchDetailData(propertyId) {
  const isList = false;
  const apiUrl = `https://www.idealista.com/es/openDetailGallery/${propertyId}?`;
  try {
    const response = await fetch(apiUrl);
    const responseData = await response.json();
    const { coordinates } = responseData.data.map;
    if (coordinates && coordinates.latitude && coordinates.longitude) {
      let popupContainer = document.createElement("div");
      popupContainer.classList.add("popup-container");

      // Add close button inside popup-container
      const closeButton = document.createElement("span");
      closeButton.classList.add("close-btn");
      closeButton.innerText = "×";
      closeButton.addEventListener("click", () => closePopup(popupContainer));
      popupContainer.appendChild(closeButton);

      const popupPrimary = createPopup();
      document.body.appendChild(popupContainer);
      popupContainer.appendChild(popupPrimary);

      const { primaryResult, secondaryResult } = await fetchRouteData(
        coordinates.latitude,
        coordinates.longitude,
      );
      updatePopupContent(
        popupPrimary,
        primaryResult.distanceInKm,
        primaryResult.timeFormatted,
        primaryResult.color,
        primaryResult.locationLabel,
      );

      if (secondaryResult) {
        const isSecondaryPopup = true;
        const popupSecondary = createPopup(isList, isSecondaryPopup);
        popupContainer.appendChild(popupSecondary);

        updatePopupContent(
          popupSecondary,
          secondaryResult.distanceInKm,
          secondaryResult.timeFormatted,
          secondaryResult.color,
          secondaryResult.locationLabel,
        );
      }
    }
  } catch (error) {
    console.error("Error fetching detailed view data:", error);
  }
}

// Log any route errors to the console
function logRouteError(error) {
  console.error("Error fetching the route data:", error);
}

// Determine if the page is a listing or a detail view
function initializePopups() {
  if (document.querySelector(".listing-items")) {
    observeListings();
  } else {
    handleDetailView();
  }
}

// Wait for the page to fully load before initializing popups
window.addEventListener("load", initializePopups);
