document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('my-bookings-modal');
  const openBtn = document.getElementById('my-bookings-btn');
  const closeBtn = document.getElementById('close-bookings-btn');
  const bookingsList = document.getElementById('bookings-list');

  if (!modal || !openBtn || !closeBtn || !bookingsList) return;

  // Open Modal
  openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    renderBookings();
    modal.classList.remove('hidden');
  });

  // Close Modal
  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });

  // Render Bookings from localStorage
  function renderBookings() {
    bookingsList.innerHTML = '';
    
    let savedBookings = [];
    try {
      savedBookings = JSON.parse(localStorage.getItem('whiskerWashBookings') || '[]');
    } catch (e) {
      savedBookings = [];
    }

    if (savedBookings.length === 0) {
      bookingsList.innerHTML = '<div class="no-bookings">You have no upcoming appointments yet. 🐾</div>';
      return;
    }

    // Sort descending by timestamp
    savedBookings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    savedBookings.forEach(booking => {
      const item = document.createElement('div');
      item.className = 'booking-item';
      
      const capitalizedService = booking.service.charAt(0).toUpperCase() + booking.service.slice(1);

      item.innerHTML = `
        <div class="booking-header">
          <span>${capitalizedService} Service</span>
          <span>${booking.date} at ${booking.time}</span>
        </div>
        <div class="booking-details">
          <strong>Pet:</strong> ${booking.petName} <br>
          <strong>Owner:</strong> ${booking.ownerName}
        </div>
      `;
      bookingsList.appendChild(item);
    });
  }
});
