document.addEventListener('DOMContentLoaded', () => {
  const profileName = document.getElementById('profile-name');
  const profileEmail = document.getElementById('profile-email');
  const profilePet = document.getElementById('profile-pet');
  const saveProfileBtn = document.getElementById('save-profile-btn');
  const bookingsList = document.getElementById('account-bookings-list');

  // Load Profile from localStorage
  function loadProfile() {
    try {
      const profileData = JSON.parse(localStorage.getItem('whiskerWashProfile'));
      if (profileData) {
        if (profileName) profileName.value = profileData.name || '';
        if (profileEmail) profileEmail.value = profileData.email || '';
        if (profilePet) profilePet.value = profileData.pet || '';
      }
    } catch (e) {
      console.error("Could not load profile data.");
    }
  }

  // Save Profile to localStorage
  if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', () => {
      const profileData = {
        name: profileName.value.trim(),
        email: profileEmail.value.trim(),
        pet: profilePet.value.trim()
      };
      localStorage.setItem('whiskerWashProfile', JSON.stringify(profileData));
      
      const originalText = saveProfileBtn.innerHTML;
      saveProfileBtn.innerHTML = 'Saved! ✓';
      setTimeout(() => {
        saveProfileBtn.innerHTML = originalText;
      }, 2000);
    });
  }

  // Render Bookings from localStorage
  function renderAccountBookings() {
    if (!bookingsList) return;
    
    bookingsList.innerHTML = '';
    let savedBookings = [];
    try {
      savedBookings = JSON.parse(localStorage.getItem('whiskerWashBookings') || '[]');
    } catch (e) {
      savedBookings = [];
    }

    if (savedBookings.length === 0) {
      bookingsList.innerHTML = '<div class="no-bookings">You have no upcoming appointments yet. 🐾<br><br><a href="booking.html" style="color:#fcae59; font-weight:bold; text-decoration:none;">Book Now</a></div>';
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

  loadProfile();
  renderAccountBookings();
});
