// Seleccionamos el contenedor donde mostraremos los resultados
const resultsContainer = document.getElementById("recommendation-results");

// Función para cargar datos del JSON
async function loadRecommendations() {
  try {
    const response = await fetch("travel_recommendation_api.json");
    if (!response.ok) {
      throw new Error(`Error al cargar JSON: ${response.status}`);
    }

    const data = await response.json();

    // Verificamos en consola que sí llegan los datos
    console.log("Datos de recomendaciones:", data);

    // Mostramos los resultados
    displayRecommendations(data);
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
}

// Función para renderizar las recomendaciones en el DOM
function displayRecommendations(data) {
  resultsContainer.innerHTML = ""; // Limpiamos el contenedor

  // Mostrar países y sus ciudades
  data.countries.forEach(country => {
    country.cities.forEach(city => {
      createCard(city);
    });
  });

  // Mostrar templos
  data.temples.forEach(temple => {
    createCard(temple);
  });

  // Mostrar playas
  data.beaches.forEach(beach => {
    createCard(beach);
  });
}

// Función para crear una tarjeta de recomendación
function createCard(place) {
  const card = document.createElement("div");
  card.classList.add("recommendation-card");

  card.innerHTML = `
    <img src="${place.imageUrl}" alt="${place.name}" class="recommendation-img"/>
    <h3>${place.name}</h3>
    <p>${place.description}</p>
  `;

  resultsContainer.appendChild(card);
}

// Llamamos a la función al cargar la página
loadRecommendations();


// Attach event listener to Search button
document.getElementById("searchBtn").addEventListener("click", function () {
    const searchInput = document.getElementById("searchInput").value.trim().toLowerCase(); // normalize input
    let keyword = "";

    // Handle variations of keywords
    if (searchInput.includes("beach") || searchInput.includes("beaches")) {
        keyword = "beach";
    } else if (searchInput.includes("temple") || searchInput.includes("temples")) {
        keyword = "temple";
    } else if (searchInput.includes("country") || searchInput.includes("countries")) {
        keyword = "country";
    }

    if (keyword) {
        // Call function to display filtered results
        displayResults(keyword);
    } else {
        alert("No matching results. Please try 'beach', 'temple', or 'country'.");
    }
});

// Example function to display results (you will connect this to your JSON data)
function displayResults(keyword) {
    console.log("Searching for:", keyword);
    // Example: filter JSON results and display dynamically
    fetch("travel_recommendation_api.json")
        .then(response => response.json())
        .then(data => {
            let results = [];
            
            if (keyword === "beach") {
                results = data.beaches;
            } else if (keyword === "temple") {
                results = data.temples;
            } else if (keyword === "country") {
                results = data.countries;
            }

            console.log("Results:", results);
            // TODO: write code to render results into your page
        })
        .catch(error => console.error("Error fetching JSON:", error));
}


// Al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");
    const resultsDiv = document.getElementById("results");
  
    let travelData = [];
  
    // 1. Fetch JSON con datos de recomendaciones
    fetch("travel_recommendation_api.json")
      .then(response => response.json())
      .then(data => {
        travelData = data;
        console.log("Datos cargados:", travelData); // ✅ Verificar en consola
      })
      .catch(error => console.error("Error al cargar JSON:", error));
  
    // 2. Acción al hacer click en Buscar
    searchBtn.addEventListener("click", () => {
      const keyword = searchInput.value.toLowerCase().trim(); // normalizar búsqueda
      resultsDiv.innerHTML = ""; // limpiar resultados previos
  
      if (!keyword) {
        resultsDiv.innerHTML = "<p>Por favor ingresa un término de búsqueda.</p>";
        return;
      }
  
      let filteredResults = [];
  
      // 3. Filtrar según la palabra clave
      if (keyword.includes("beach")) {
        filteredResults = travelData.beaches || [];
      } else if (keyword.includes("temple")) {
        filteredResults = travelData.temples || [];
      } else if (keyword.includes("country")) {
        filteredResults = travelData.countries || [];
      }
  
      // 4. Mostrar resultados en el DOM
      if (filteredResults.length > 0) {
        filteredResults.slice(0, 2).forEach(place => { // mostrar mínimo 2
          const card = document.createElement("div");
          card.classList.add("card");
  
          card.innerHTML = `
            <img src="${place.imageUrl}" alt="${place.name}" />
            <h3>${place.name}</h3>
            <p>${place.description}</p>
          `;
  
          resultsDiv.appendChild(card);
        });
      } else {
        resultsDiv.innerHTML = "<p>No se encontraron resultados para esa búsqueda.</p>";
      }
    });
  });
  

  // Seleccionamos los elementos
const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("results");
const clearBtn = document.getElementById("clearBtn");

// Función para limpiar
function clearResults() {
  resultsContainer.innerHTML = ""; // Borra los resultados
  searchInput.value = "";          // Limpia el campo de búsqueda
}

// Evento para el botón Clear
clearBtn.addEventListener("click", clearResults);
