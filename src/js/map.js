import L from "leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";

window.addEventListener("DOMContentLoaded", () => {
  const inputBusqueda = document.getElementById("busqueda");

  if (!inputBusqueda) {
    return;
  }

  //lat - long
  let chords = [-31.742231, -60.517831]; //inicializa en Paraná

  const map = L.map("mapa", {
    center: chords,
    zoom: 13,
  });

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const provider = new OpenStreetMapProvider();

  function removeAllChilds(elementoPadre) {
    while (elementoPadre.firstChild) {
      elementoPadre.removeChild(elementoPadre.firstChild);
    }
  }

  async function getUbicacion() {
    //Api de openstreetmap para Reverse geocoding
    //obtine toda la informacion de una direccion con solo saber sus coordenadas
    try {
      const response = await fetch(
        "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" +
          chords[0] +
          "&lon=" +
          chords[1]
      );
      const result = await response.json();
      return result;
    } catch (error) {
      return null;
    }
  }

  let marker;
  //mueve el mapa y coloca el marcador en la coordenada
  function moverMapa() {
    map.setView(chords, 13);
    if (marker) {
      marker.remove();
    }
    marker = L.marker(chords, {
      draggable: true,
      autoPan: true,
    }).addTo(map);

    marker.on("moveend", async function (e) {
      const chordsObj = e.target.getLatLng();
      chords = [chordsObj.lat, chordsObj.lng];
      llenarCampos();
    });
  }

  async function llenarCampos() {
    const ubi = await getUbicacion();
    if (!ubi) {
      return;
    }

    ubi.address.house_number = ubi.address.house_number
      ? ubi.address.house_number + ", "
      : "";

    inputBusqueda.value = `${ubi.address.house_number}${ubi.address.road}`;

    const direccion = document.getElementById("direccion");
    const ciudad = document.getElementById("ciudad");
    const estado = document.getElementById("estado");
    const pais = document.getElementById("pais");
    const coordenadas = document.getElementById("coordenadas");

    direccion.value = `${ubi.address.house_number}${ubi.address.road}`;

    ciudad.value = ubi.address.city;
    estado.value = ubi.address.state;
    pais.value = ubi.address.country;

    const { lat, lon } = ubi;
    coordenadas.value = JSON.stringify({ lat, lng: lon });
  }

  function mostrarResultador(results) {
    const resultsContainer = document.querySelector(".resultados-busqueda");
    if (results.length > 0) {
      removeAllChilds(resultsContainer);
      resultsContainer.style.display = "block";

      results.forEach((result) => {
        const resultElement = document.createElement("LI");
        resultElement.textContent = result.label;
        //guardamos la coordenada del cada resultado
        resultElement.dataset.chords = JSON.stringify(result.bounds[0]);
        resultsContainer.appendChild(resultElement);

        resultElement.addEventListener("click", function (e) {
          chords = JSON.parse(e.target.dataset.chords);

          //oculto modal de resultados
          resultsContainer.style.display = "none";

          moverMapa();
          llenarCampos();
        });
      });
    } else {
      resultsContainer.style.display = "none";
      return;
    }
  }

  const loader = document.querySelector(".loader");
  let debounceTimeout;
  async function buscarDireccion(e) {
    const query = e.target.value;

    if (query.length < 8) {
      //Empieza a buscar a partir de un length
      return;
    }
    loader.style.opacity = 1;

    clearTimeout(debounceTimeout); // Limpiamos el temporizador anterior

    debounceTimeout = setTimeout(async () => {
      // Realizamos la búsqueda después de que haya pasado un tiempo sin que el usuario escriba
      try {
        const results = await provider.search({ query });
        mostrarResultador(results);
      } catch (error) {
        console.error("Error al buscar:", error);
      } finally {
        loader.style.opacity = 0;
      }
    }, 300); // Esperar 300 milisegundos antes de realizar la búsqueda
  }

  inputBusqueda.addEventListener("input", buscarDireccion);

  //Verifica si hay coordenadas al momento de cargar la pagina
  function coordenadasPrevias() {
    const inputCoordenadas = document.getElementById("coordenadas");

    if (inputCoordenadas.value) {
      chords = JSON.parse(inputCoordenadas.value);
      moverMapa();
      llenarCampos();
    }
  }

  coordenadasPrevias();
});
