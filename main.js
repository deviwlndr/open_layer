import Map from 'https://cdn.skypack.dev/ol/Map.js';
import View from 'https://cdn.skypack.dev/ol/View.js';
import TileLayer from 'https://cdn.skypack.dev/ol/layer/Tile.js';
import OSM from 'https://cdn.skypack.dev/ol/source/OSM.js';
import VectorLayer from 'https://cdn.skypack.dev/ol/layer/Vector.js';
import VectorSource from 'https://cdn.skypack.dev/ol/source/Vector.js';
import { fromLonLat, toLonLat } from 'https://cdn.skypack.dev/ol/proj.js';
import { showPopup } from './popup.js';

const markerSource = new VectorSource();

const markerLayer = new VectorLayer({
  source: markerSource,
});

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    markerLayer,
  ],
  view: new View({
    center: fromLonLat([107.9019822944495, -7.215907720160664]),
    zoom: 12,
  }),
});

// Fungsi untuk mendapatkan data alamat dari koordinat
async function reverseGeocode(lat, lon) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error('Gagal mendapatkan data geocoding');
      return null;
    }
  } catch (error) {
    console.error('Error saat mengakses API Nominatim:', error);
    return null;
  }
}

// Event klik di peta
map.on('click', async (event) => {
  const coordinate = event.coordinate;
  const [lon, lat] = toLonLat(coordinate);

  const geocodeData = await reverseGeocode(lat, lon);

  if (geocodeData) {
    const address = geocodeData.display_name || 'Alamat tidak tersedia';

    showPopup(
      'Informasi Lokasi',
      `<strong>Alamat:</strong> ${address}<br>
       <strong>Latitude:</strong> ${lat.toFixed(6)}<br>
       <strong>Longitude:</strong> ${lon.toFixed(6)}`
    );
  } else {
    showPopup(
      'Informasi Lokasi',
      `<strong>Latitude:</strong> ${lat.toFixed(6)}<br>
       <strong>Longitude:</strong> ${lon.toFixed(6)}<br>
       <strong>Keterangan:</strong> Tidak ada informasi lokasi yang tersedia.`
    );
  }
});
// Panggil fungsi untuk memperbarui daftar lokasi setelah halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  const updateLocationList = () => {
    const savedLocations = JSON.parse(localStorage.getItem('savedLocations') || '[]');
    const locationList = document.getElementById('location-list');

    if (!locationList) {
      console.error('Elemen lokasi daftar tidak ditemukan!');
      return;
    }

    locationList.innerHTML = ''; // Kosongkan list sebelumnya
    savedLocations.forEach((location) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="location-header">
          <h4>${location.title}</h4>
          <i class="fa fa-map-marker"></i>
        </div>
        <div class="location-description">${location.description}</div>
        <div class="location-coordinates">${location.message}</div>
      `;
      locationList.appendChild(li);
    });
  };

  // Panggil fungsi untuk memuat lokasi tersimpan
  updateLocationList();
});
