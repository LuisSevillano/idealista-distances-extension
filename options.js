// Save settings

document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.sync.get(["apiKey", "originCoordinates"], function (data) {
    document.getElementById("api-key").value = data.apiKey || "";
    document.getElementById("coordinates").value = data.originCoordinates || "";
    document.getElementById("coordinates-secondary").value =
      data.originCoordinatesSecondary || "";
  });
});

document.getElementById("saveOptions").addEventListener("click", function () {
  const apiKey = document.getElementById("api-key").value;
  const originCoordinates = document.getElementById("coordinates").value;
  const originCoordinatesSecondary = document.getElementById(
    "coordinates-secondary"
  ).value;

  if (!apiKey) {
    alert("Please enter your GraphHopper API Key.");
    return;
  }

  let data = { apiKey, originCoordinates };

  if (originCoordinatesSecondary !== "") {
    data.originCoordinatesSecondary = originCoordinatesSecondary;
  }

  chrome.storage.sync.set(data, function () {
    alert("Options saved successfully!");
  });
});

window.addEventListener("load", function () {
  chrome.storage.sync.get(["originCoordinates", "api-key"], function (data) {
    if (data.apiKey) {
      document.getElementById("api-key").value = data.apiKey;
    }
    if (data.originCoordinates) {
      document.getElementById("coordinates").value = data.originCoordinates;
    }
    if (data.originCoordinatesSecondary) {
      document.getElementById("coordinates-secondary").value =
        data.originCoordinatesSecondary;
    }
  });
});

const citiesCoordinates = {
  madrid: [40.4168, -3.7038],
  aranda: [41.668602, -3.6953297],
  zaragoza: [41.654123, -0.879338],
  donosti: [43.3152668, -2.0029028],
  lisboa: [38.723263, -9.130241],
};

document.querySelectorAll(".origin-options.primary button").forEach(button => {
  const city = button.getAttribute("data-city");
  button.addEventListener("click", function (e) {
    const coordinates = citiesCoordinates[city]; // Madrid coordinates
    document.getElementById("coordinates").value = coordinates.join(",");
  });
});

document
  .querySelectorAll(".origin-options.secondary button")
  .forEach(button => {
    const city = button.getAttribute("data-city");
    button.addEventListener("click", function (e) {
      const coordinates = citiesCoordinates[city]; // Madrid coordinates
      document.getElementById("coordinates-secondary").value =
        coordinates.join(",");
    });
  });
