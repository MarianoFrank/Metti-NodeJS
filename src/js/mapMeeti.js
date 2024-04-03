import L from "leaflet";

import { OpenStreetMapProvider } from "leaflet-geosearch";
window.addEventListener("DOMContentLoaded", async () => {
  //lat - long
  let chords = document.getElementById("chords").value.split(","); //inicializa en Paraná

  if (!chords) {
    return;
  }

  const mapa = document.querySelector(".mapa");

  const map = L.map(mapa, {
    center: chords,
    zoom: 16,
  });

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker(chords, {
    draggable: false,
    autoPan: false,
  }).addTo(map);

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
      console.log(result);
      return result;
    } catch (error) {
      return null;
    }
  }

  const ubicacionLabel = document.querySelector(".ubicacion p");
  const ubi = await getUbicacion();
  const ubicacionFormateada = `${ubi.name ? `${ubi.name}, ` : ""}
  ${ubi.address.road}${ubi.address.house_number ? ` ${ubi.address.house_number}, ` : ", "}
  ${ubi.address.city}, ${ubi.address.state}, ${ubi.address.country}
  `;
  ubicacionLabel.textContent = ubicacionFormateada;
});
