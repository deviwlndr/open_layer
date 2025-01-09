localStorage.clear(); // Bersihkan semua data localStorage

// Variabel sementara untuk menyimpan lokasi
let savedLocations = []; 

export function showPopup(title, message) {
  const popup = document.getElementById('input-popup');
  const popupTitle = document.getElementById('popup-coordinates');
  const descriptionInput = document.getElementById('location-description');
  const saveButton = document.getElementById('save-location');
  const cancelButton = document.getElementById('cancel-location');

  if (!popup || !popupTitle || !descriptionInput || !saveButton || !cancelButton) {
    console.error('Elemen popup tidak ditemukan');
    return;
  }

  // Tampilkan konten popup
  popupTitle.innerHTML = `${title}:<br>${message}`;
  descriptionInput.value = ''; // Reset deskripsi input
  popup.classList.remove('hidden');

  // Event untuk tombol Simpan
  saveButton.onclick = () => {
    const description = descriptionInput.value;
    if (description.trim() === '') {
      alert('Deskripsi tidak boleh kosong!');
      return;
    }

    // Simpan data lokasi ke variabel sementara
    savedLocations.push({ title, message, description });

    // Perbarui daftar lokasi di UI
    updateLocationList();

    alert('Lokasi berhasil disimpan!');
    popup.classList.add('hidden'); // Tutup popup setelah menyimpan
  };

  // Event untuk tombol Tutup
  cancelButton.onclick = () => {
    popup.classList.add('hidden');
  };
}

// Fungsi untuk memperbarui daftar lokasi
function updateLocationList() {
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
}
