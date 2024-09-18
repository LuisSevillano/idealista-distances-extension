const apiKey = "27fef946-b325-46ab-a40c-698b24a9e94a";

// Obtener coordenadas y calcular la distancia
function fetchRouteData(latitude, longitude, callback) {
  console.log("fetchRouteData", { latitude, longitude, callback });

  const start = "40.4168,-3.7038"; // Coordenadas de Madrid
  const end = `${latitude},${longitude}`;

  const routeUrl = `https://graphhopper.com/api/1/route?point=${start}&point=${end}&vehicle=car&key=${apiKey}`;

  fetch(routeUrl)
    .then(processRouteResponse)
    .then(data => calculateTimeAndDistance(data, callback))
    .catch(logRouteError);
}

// Procesar la respuesta de la API de GraphHopper
function processRouteResponse(response) {
  console.log("processRouteResponse");
  console.log(response);
  return response.json();
}

// Calcular tiempo y distancia
function calculateTimeAndDistance(data, callback) {
  console.log("calculateTimeAndDistance");
  console.log({ data, callback });
  const path = data.paths[0];
  const timeInSeconds = path.time / 1000; // Convertir tiempo a segundos
  const distanceInKm = path.distance / 1000; // Convertir distancia a kilómetros

  const timeInMinutes = Math.floor(timeInSeconds / 60);
  const hours = Math.floor(timeInMinutes / 60);
  const minutes = timeInMinutes % 60;

  const timeFormatted = formatTime(hours, minutes);
  const color = getTimeColor(hours, minutes);

  callback(distanceInKm.toFixed(2), timeFormatted, color);
}

// Formatear tiempo
function formatTime(hours, minutes) {
  console.log("formatTime", { hours, minutes });
  return hours > 0 ? `${hours}h y ${minutes}m` : `${minutes}m`;
}

// Obtener el color según el tiempo
function getTimeColor(hours, minutes) {
  console.log("getTimeColor", { hours, minutes });
  const totalHours = hours + minutes / 60;
  if (totalHours >= 3) {
    return "red"; // Más de 3 horas
  } else if (totalHours >= 2) {
    return "orange"; // Entre 2 y 3 horas
  } else {
    return "green"; // Menos de 2 horas
  }
}

function getPopupHTMLTemplate(distance, time, color) {
  return `<div>
            <span class="close-btn">×</span>
            <p>Distancia a Madrid: ${distance} km</p>
            <p style="color: ${color};">Tiempo en coche: ${time}</p>
        </div>`;
}

// Mostrar el popup con los datos de distancia
function createPopup(distance, time, color) {
  console.log("createPopup", { distance, time, color });
  const popup = document.createElement("div");
  popup.className = "floating-distance-popup";
  popup.innerHTML = getPopupHTMLTemplate(distance, time, color);
  return popup;
}

// Mostrar el popup en cada anuncio del listado
function displayPopupInListing(item, latitude, longitude) {
  console.log("displayPopupInListing", { item, latitude, longitude });
  const popup = createPopup("", "", "green");
  item.querySelector(".price-row").appendChild(popup);

  fetchRouteData(latitude, longitude, (distance, time, color) => {
    updatePopupContent(popup, distance, time, color);
  });
}

// Actualizar el contenido del popup
function updatePopupContent(popup, distance, time, color) {
  console.log("updatePopupContent", { popup, distance, time, color });
  popup.innerHTML = getPopupHTMLTemplate(distance, time, color);
  popup
    .querySelector(".close-btn")
    .addEventListener("click", closePopup.bind(null, popup));
}

// Cerrar el popup
function closePopup(popup) {
  popup.remove();
}

// Manejar la respuesta del listado de anuncios
function handleListingItem(entry) {
  console.log("handleListingItem", { entry });
  if (entry.isIntersecting) {
    const item = entry.target;
    const id = item.getAttribute("data-element-id");
    if (id) {
      fetchListingData(id, item);
    }
  }
}

// Obtener los datos de un anuncio desde la API de Idealista
function fetchListingData(id, item) {
  console.log("fetchListingData", { id, item });
  const apiUrl = `https://www.idealista.com/es/openDetailGallery/${id}?`;
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const coordinates = data.data.map.coordinates;
      if (coordinates && coordinates.latitude && coordinates.longitude) {
        displayPopupInListing(
          item,
          coordinates.latitude,
          coordinates.longitude
        );
      }
    });
}

// Observar los elementos del listado
function observeListings() {
  console.log("observeListings");
  const observer = new IntersectionObserver(handleListingItem, {
    rootMargin: "0px 0px 500px 0px",
  });

  document.querySelectorAll(".item").forEach(item => {
    observer.observe(item);
  });
}

// Manejar la vista de detalle del anuncio
function handleDetailView() {
  console.log("handleDetailView");
  const url = window.location.href;
  const match = url.match(/\/inmueble\/(\d+)/);
  if (match) {
    const propertyId = match[1];
    fetchDetailData(propertyId);
  }
}

// Obtener los datos del anuncio de la vista de detalle
function fetchDetailData(propertyId) {
  console.log("fetchDetailData", { propertyId });
  const apiUrl = `https://www.idealista.com/es/openDetailGallery/${propertyId}?`;
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const coordinates = data.data.map.coordinates;
      if (coordinates && coordinates.latitude && coordinates.longitude) {
        const popup = createPopup("", "", "green");
        document.body.appendChild(popup);
        fetchRouteData(
          coordinates.latitude,
          coordinates.longitude,
          (distance, time, color) => {
            updatePopupContent(popup, distance, time, color);
          }
        );
      }
    });
}

// Log de errores al obtener rutas
function logRouteError(error) {
  console.error("Error al obtener la ruta:", error);
}

// Detectar el contexto de la página y ejecutar la función adecuada
window.addEventListener("load", function () {
  if (window.location.href.includes("/inmueble/")) {
    handleDetailView();
  } else {
    observeListings();
  }
});
