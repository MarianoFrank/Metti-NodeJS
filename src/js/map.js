import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { OpenStreetMapProvider } from "leaflet-geosearch";

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

window.addEventListener("DOMContentLoaded", () => {
  const inputBusqueda = document.getElementById("busqueda");

  const provider = new OpenStreetMapProvider();

  function removeAllChilds(elementoPadre) {
    while (elementoPadre.firstChild) {
      elementoPadre.removeChild(elementoPadre.firstChild);
    }
  }

  function moverMapa(chords) {
    console.log(chords);
    map.setView(chords, 13);
    L.marker(chords).addTo(map);
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
        resultElement.dataset.chords = result.bounds[0];
        resultsContainer.appendChild(resultElement);

        resultElement.addEventListener("click", function (e) {
          const chordsString = e.target.dataset.chords;
          resultsContainer.style.display = "none";
          inputBusqueda.value = e.target.textContent;
          //movemos el mapa (no sin antes convertir las coordenadas a array)
          moverMapa(
            chordsString.split(",").map((coordenada) => parseFloat(coordenada))
          );
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
});
