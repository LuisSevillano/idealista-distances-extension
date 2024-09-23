// Save predefined city coordinates
let citiesCoordinates = {
  Madrid: [40.4168, -3.7038],
  Aranda: [41.668602, -3.6953297],
  Zaragoza: [41.654123, -0.879338],
  Donosti: [43.3152668, -2.0029028],
  Lisboa: [38.723263, -9.130241],
};

const spinnerContainer = document.getElementById("spinner-container");

document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.sync.get(
    ["apiKey", "primaryOrigin", "secondaryOrigin"],
    function (data) {
      // Check if there is any saved data and populate fields accordingly
      if (Object.keys(data).length !== 0) {
        document.getElementById("api-key").value = data.apiKey || "";
        if (data.primaryOrigin !== undefined) {
          document.getElementById("manual-coordinates-primary").value =
            data.primaryOrigin.coordinates || "";
          document.getElementById("manual-city-primary").value =
            data.primaryOrigin.city || "";
        }

        if (data.secondaryOrigin !== undefined) {
          document.getElementById("manual-coordinates-secondary").value =
            data.secondaryOrigin.coordinates || "";
          document.getElementById("manual-city-secondary").value =
            data.secondaryOrigin.city || "";
          addButtonActiveClassFromStorage(
            "secondary",
            data.secondaryOrigin.city,
          );
        }

        updateButtons(data);
        addButtonActiveClassFromStorage("primary", data.primaryOrigin.city);
      }

      spinnerContainer.style.display = "none"; // Hide spinner when data is loaded
    },
  );
});

// Show error message for invalid inputs
function showError(input, message) {
  input.classList.add("input-error");

  let errorElement = input.nextElementSibling;
  if (errorElement && errorElement.classList.contains("error-message")) {
    errorElement.textContent = message;
    errorElement.classList.add("active");
  }
}

// Clear previous error messages
function clearErrors(inputs) {
  inputs.forEach((input) => {
    input.classList.remove("input-error");
    let errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains("error-message")) {
      errorElement.classList.remove("active");
    }
  });
}

// Dynamically update buttons for available cities
function updateButtons(data) {
  let isSecondary = false;
  let isActive = false;
  const { primaryOrigin, secondaryOrigin } = data;

  // Avoid adding duplicate buttons
  Object.entries(citiesCoordinates).forEach(([city]) => {
    if (
      document.querySelectorAll(`.origin-options [data-city='${city}']`)
        .length === 0
    ) {
      if (city === primaryOrigin.city) {
        isActive = true;
      }
      const buttonPrimary = createButton(city, isSecondary, isActive);
      document
        .querySelector(`.origin-options.primary`)
        .appendChild(buttonPrimary);

      // Create secondary button if necessary
      if (secondaryOrigin !== undefined) {
        if (city === secondaryOrigin.city) {
          isActive = true;
        }
        isSecondary = true;
        const buttonSecondary = createButton(city, isSecondary, isActive);
        document
          .querySelector(`.origin-options.secondary`)
          .appendChild(buttonSecondary);
      }
    }
  });
}

// Add "active" class to stored button selections
function addButtonActiveClassFromStorage(group, cityLabel) {
  document
    .querySelectorAll(`.origin-options.${group} button`)
    .forEach((button) => {
      if (button.dataset.city === cityLabel) {
        button.classList.add("active");
      }
    });
}

// Reset all options and clear storage
document.getElementById("resetOptions").addEventListener("click", function () {
  chrome.storage.sync.clear();
  document.querySelectorAll("input").forEach((input) => (input.value = ""));
  removeAllActiveClasses();
  alert("All data removed successfully!");
});

// Save user settings
document.getElementById("saveOptions").addEventListener("click", function () {
  const coordinatesRegex = /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/;
  let hasErrors = false;

  // inputs
  const apiKeyInput = document.querySelector("#api-key");
  const coordinatesPrimaryInput = document.querySelector(
    "#manual-coordinates-primary",
  );
  const coordinatesSecondaryInput = document.querySelector(
    "#manual-coordinates-secondary",
  );
  const cityPrimaryInput = document.querySelector("#manual-city-primary");
  const citySecondaryInput = document.querySelector("#manual-city-secondary");

  // end inputs
  clearErrors([
    apiKeyInput,
    cityPrimaryInput,
    citySecondaryInput,
    coordinatesPrimaryInput,
    coordinatesSecondaryInput,
  ]);

  // Validate API key
  if (!apiKeyInput.value) {
    showError(
      apiKeyInput,
      "Please set your GraphHopper API Key in the extension settings.",
    );
    hasErrors = true;
  }

  // Validate city and coordinates for the primary location
  if (!cityPrimaryInput.value) {
    showError(
      cityPrimaryInput,
      "Please enter the city name or select one from the options",
    );
    hasErrors = true;
  }

  if (
    coordinatesPrimaryInput.value === "" ||
    !coordinatesRegex.test(coordinatesPrimaryInput.value)
  ) {
    showError(coordinatesPrimaryInput, "Please enter valid coordinates");
    hasErrors = true;
  }

  let data = {
    apiKey: apiKeyInput.value,
    primaryOrigin: {
      coordinates: coordinatesPrimaryInput.value,
      city: cityPrimaryInput.value,
    },
  };

  // If secondary city or coordinates exist, validate them
  if (
    citySecondaryInput.value !== "" ||
    coordinatesSecondaryInput.value !== ""
  ) {
    if (
      coordinatesSecondaryInput.value === "" ||
      !coordinatesRegex.test(coordinatesSecondaryInput.value)
    ) {
      hasErrors = true;
      showError(
        coordinatesSecondaryInput,
        "Please enter valid secondary coordinates",
      );
    }
    if (!citySecondaryInput.value) {
      showError(
        citySecondaryInput,
        "Please enter the city name or select one from the options",
      );
      hasErrors = true;
    }

    data.secondaryOrigin = {
      coordinates: coordinatesSecondaryInput.value,
      city: citySecondaryInput.value,
    };
  } else {
    chrome.storage.sync.remove("secondaryOrigin");
  }

  if (hasErrors) {
    alert("There seem to be some errors. Check the form and try again.");
    return; // Don't save if there are errors
  }

  chrome.storage.sync.set(data, function () {
    alert("Options saved successfully!");
  });
});

// Remove all "active" classes from buttons
function removeAllActiveClasses(button) {
  if (button) {
    button.parentNode
      .querySelectorAll("button")
      .forEach((button) => button.classList.remove("active"));
    button.classList.add("active");
  } else {
    document
      .querySelectorAll(`.origin-options [data-city]`)
      .forEach((button) => button.classList.remove("active"));
  }
}

// Event listeners for primary city buttons
document
  .querySelectorAll(".origin-options.primary button")
  .forEach((button) => {
    const city = button.getAttribute("data-city");

    button.addEventListener("click", function () {
      removeAllActiveClasses(button);
      const coordinates = citiesCoordinates[city];
      document.getElementById("manual-coordinates-primary").value =
        coordinates.join(",");
      document.getElementById("manual-city-primary").value =
        button.getAttribute("data-city");
    });
  });

// Event listeners for secondary city buttons
document
  .querySelectorAll(".origin-options.secondary button")
  .forEach((button) => {
    const city = button.getAttribute("data-city");

    button.addEventListener("click", function () {
      removeAllActiveClasses(button);
      const coordinates = citiesCoordinates[city];
      document.getElementById("manual-coordinates-secondary").value =
        coordinates.join(",");
      document.getElementById("manual-city-secondary").value =
        button.getAttribute("data-city");
    });
  });

// Helper to create a new button for city options
function createButton(city, isSecondary = false, isActive = true) {
  const button = document.createElement("button");
  button.setAttribute("data-city", city);
  button.innerHTML = city;
  if (isActive) {
    button.classList.add("active");
  }

  return button;
}
