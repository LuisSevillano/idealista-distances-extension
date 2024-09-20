// Save settings

document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.sync.get(
    ["apiKey", "primaryOrigin", "secondaryOrigin"],
    function (data) {
      if (Object.keys(data).length !== 0) {
        document.getElementById("api-key").value = data.apiKey || "";
        document.getElementById("coordinates").value =
          data.primaryOrigin.coordinates || "";
        addButtonActiveClassFromStorage("primary", data.primaryOrigin.city);

        if (data.secondaryOrigin !== undefined) {
          document.getElementById("coordinates-secondary").value =
            data.secondaryOrigin.coordinates || "";
          addButtonActiveClassFromStorage(
            "secondary",
            data.secondaryOrigin.city,
          );
        }
      }
    },
  );
});

function addButtonActiveClassFromStorage(group, cityLabel) {
  document
    .querySelectorAll(`.origin-options.${group} button`)
    .forEach((button) => {
      if (button.dataset.city === cityLabel) {
        button.classList.add("active");
      }
    });
}

document.getElementById("saveOptions").addEventListener("click", function () {
  const apiKey = document.getElementById("api-key").value;
  const originCoordinates = document.getElementById("coordinates").value;
  const originCoordinatesCity = document.querySelector(
    ".origin-options.primary button.active",
  ).dataset.city;

  const originCoordinatesSecondary = document.getElementById(
    "coordinates-secondary",
  ).value;

  if (!apiKey) {
    alert("Please enter your GraphHopper API Key.");
    return;
  }

  let data = {
    apiKey,
    primaryOrigin: {
      coordinates: originCoordinates,
      city: originCoordinatesCity,
    },
  };

  if (originCoordinatesSecondary !== "") {
    const originCoordinatesSecondaryCity = document.querySelector(
      ".origin-options.secondary button.active",
    ).dataset.city;

    data.secondaryOrigin = {
      coordinates: originCoordinatesSecondary,
      city: originCoordinatesSecondaryCity,
    };
  } else {
    chrome.storage.sync.remove("originCoordinatesSecondary", function () {
      // console.log("Secondary coordinates removed from storage.");
    });
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
  Madrid: [40.4168, -3.7038],
  Aranda: [41.668602, -3.6953297],
  Zaragoza: [41.654123, -0.879338],
  Donosti: [43.3152668, -2.0029028],
  Lisboa: [38.723263, -9.130241],
};

function removeAllActiveClasses(button) {
  button.parentNode
    .querySelectorAll("button")
    .forEach((button) => button.classList.remove("active"));
  button.classList.add("active");
}

document
  .querySelectorAll(".origin-options.primary button")
  .forEach((button) => {
    const city = button.getAttribute("data-city");

    button.addEventListener("click", function (e) {
      removeAllActiveClasses(button);
      const coordinates = citiesCoordinates[city]; // M coordinates
      document.getElementById("coordinates").value = coordinates.join(",");
    });
  });

document
  .querySelectorAll(".origin-options.secondary button")
  .forEach((button) => {
    const city = button.getAttribute("data-city");
    button.addEventListener("click", function (e) {
      removeAllActiveClasses(button);
      const coordinates = citiesCoordinates[city]; // M coordinates
      document.getElementById("coordinates-secondary").value =
        coordinates.join(",");
    });
  });
