// travel_recommendation.js - versión limpia y consolidada
document.addEventListener('DOMContentLoaded', () => {
  // Selectores únicos y descriptivos
  const recommendationResultsContainer = document.getElementById('recommendation-results');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const clearBtn = document.getElementById('clearBtn');
  const resultsDiv = document.getElementById('results');

  let travelData = null; // contendrá el JSON completo

  // Carga inicial de datos
  async function loadRecommendations() {
    try {
      const res = await fetch('travel_recommendation_api.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      travelData = data;
      console.log('Datos cargados:', travelData);
      // No mostrar recomendaciones al cargar; se mostrarán al buscar
    } catch (err) {
      console.error('Error al cargar JSON:', err);
      if (resultsDiv) resultsDiv.innerHTML = '<p>Error al cargar datos.</p>';
    }
  }

  // Render principal (se muestran tarjetas en #recommendation-results)
  function displayRecommendations(data) {
    if (!recommendationResultsContainer) return;
    recommendationResultsContainer.innerHTML = '';

    // Ciudades dentro de países
    (data.countries || []).forEach(country => {
      (country.cities || []).forEach(city => createRecommendationCard(city));
    });

    // Templos y playas
    (data.temples || []).forEach(t => createRecommendationCard(t));
    (data.beaches || []).forEach(b => createRecommendationCard(b));
  }

  function createRecommendationCard(place) {
    if (!recommendationResultsContainer) return;
    const card = document.createElement('div');
    card.className = 'recommendation-card';

    const imgSrc = (place.imageUrl && !place.imageUrl.includes('enter_your_image')) ? place.imageUrl : 'https://via.placeholder.com/320x200?text=No+Image';

    card.innerHTML = `
      <img src="${imgSrc}" alt="${place.name || ''}" class="recommendation-img"/>
      <h3>${place.name || 'Sin nombre'}</h3>
      <p>${place.description || ''}</p>
    `;

    recommendationResultsContainer.appendChild(card);
  }

  // Obtiene un array plano con todos los lugares (playas, templos y ciudades)
  function getAllPlaces() {
    const out = [];
    if (!travelData) return out;

    (travelData.beaches || []).forEach(p => out.push({ ...p, type: 'beach' }));
    (travelData.temples || []).forEach(p => out.push({ ...p, type: 'temple' }));
    (travelData.countries || []).forEach(country => {
      (country.cities || []).forEach(city => out.push({ ...city, type: 'city', country: country.name }));
    });

    return out;
  }

  // Renderiza resultados de búsqueda en #results
  function renderSearchResults(items) {
    if (!resultsDiv) return;
    resultsDiv.innerHTML = '';

    if (!items || items.length === 0) {
      resultsDiv.innerHTML = '<p>No se encontraron resultados para esa búsqueda.</p>';
      resultsDiv.style.display = 'block';
      return;
    }

    // Mostrar hasta 2 resultados
    items.slice(0, 2).forEach(place => {
      const card = document.createElement('div');
      card.className = 'card';

      const imgSrc = (place.imageUrl && !place.imageUrl.includes('enter_your_image'))
        ? place.imageUrl
        : 'https://via.placeholder.com/320x200?text=No+Image';

      card.innerHTML = `
      <img src="${imgSrc}" alt="${place.name || ''}" />
      <h3>${place.name || ''}</h3>
      <p>${place.description || ''}</p>
    `;

      resultsDiv.appendChild(card);
    });

    resultsDiv.style.display = 'block';
  }


  // Lógica de búsqueda: reconoce palabras clave y búsqueda libre por nombre/descr.
  function performSearch(raw) {
    const q = (raw || '').toLowerCase().trim();
    if (!q) {
      resultsDiv.innerHTML = '<p>Por favor ingresa un término de búsqueda.</p>';
      return;
    }

    const all = getAllPlaces();

    // Keywords comunes en inglés y español
    if (q.includes('beach') || q.includes('beaches') || q.includes('playa') || q.includes('playas')) {
      const beaches = all.filter(p => p.type === 'beach');
      renderSearchResults(beaches.length >= 2 ? beaches.slice(0, 2) : beaches);
      return;
    }
    if (q.includes('temple') || q.includes('temples') || q.includes('templo') || q.includes('templos')) {
      const temples = all.filter(p => p.type === 'temple');
      renderSearchResults(temples.length >= 2 ? temples.slice(0, 2) : temples);
      return;
    }
    if (q.includes('country') || q.includes('countries') || q.includes('país') || q.includes('pais')) {
      // Mostrar ciudades pertenecientes a países (al menos 2 cuando existan)
      const cities = all.filter(p => p.type === 'city');
      renderSearchResults(cities.length >= 2 ? cities.slice(0, 2) : cities);
      return;
    }

    // Búsqueda libre por nombre o descripción
    const matched = all.filter(p => {
      const name = (p.name || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      return name.includes(q) || desc.includes(q) || (p.country || '').toLowerCase().includes(q);
    });

    renderSearchResults(matched);
  }

  function clearResults() {
    if (resultsDiv) {
      resultsDiv.innerHTML = '';
      resultsDiv.style.display = 'none';
    }
    if (recommendationResultsContainer) recommendationResultsContainer.style.display = 'none';
    if (searchInput) searchInput.value = '';
  }

  // Listeners
  if (searchBtn) searchBtn.addEventListener('click', () => performSearch(searchInput.value));
  if (clearBtn) clearBtn.addEventListener('click', clearResults);

  // Inicialización
  loadRecommendations();
});
