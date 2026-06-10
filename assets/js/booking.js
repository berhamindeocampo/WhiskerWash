document.addEventListener('DOMContentLoaded', () => {
  // State variables
  let currentDate = new Date(); // Start at current date
  let selectedDateObj = null;
  let selectedTimeStr = null;

  // DOM Elements
  const monthYearDisplay = document.getElementById('currentMonthYear');
  const calendarDaysContainer = document.getElementById('calendarDays');
  const timeSlotsContainer = document.getElementById('timeSlots');
  const summaryDate = document.getElementById('summaryDate');
  const summaryTime = document.getElementById('summaryTime');
  const confirmBtn = document.getElementById('confirmBookingBtn');
  const bookingForm = document.getElementById('bookingForm');

  // Initialize Custom Dropdown
  initCustomDropdown();

  function initCustomDropdown() {
    const dropdown = document.getElementById('bookingServiceDropdown');
    if (!dropdown) return;

    const toggle = dropdown.querySelector('.dropdown_toggle');
    const options = dropdown.querySelectorAll('.option_item');
    const selectedValue = dropdown.querySelector('.selected_value');
    const hiddenInput = document.getElementById('bookingService');

    if (!toggle || !selectedValue || !hiddenInput) return;

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    options.forEach((option) => {
      option.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const value = option.getAttribute('data-value') || '';
        const text = option.textContent.trim();

        selectedValue.textContent = text;
        hiddenInput.value = value;
        
        selectedValue.style.color = 'var(--text-color)';
        dropdown.classList.remove('open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });
  }

  // Available dummy time slots
  const availableTimes = ['09:00 AM', '09:30 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:30 PM', '04:00 PM'];

  // Initialize Calendar
  renderCalendar();

  // Navigation Listeners
  document.getElementById('prevMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  document.getElementById('nextMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  function renderCalendar() {
    calendarDaysContainer.innerHTML = '';
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Set Month/Year Header (e.g., "June 2026")
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthYearDisplay.textContent = `${monthNames[month]} ${year}`;

    // Get the first day of the month (0 = Sun, 1 = Mon...)
    const firstDay = new Date(year, month, 1).getDay();
    // Get total days in this month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Create empty slots for days before the 1st of the month
    for (let i = 0; i < firstDay; i++) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'calendar-day empty';
      calendarDaysContainer.appendChild(emptyDiv);
    }

    const today = new Date();
    today.setHours(0,0,0,0);

    // Create the actual days
    for (let i = 1; i <= daysInMonth; i++) {
      const dayBtn = document.createElement('button');
      dayBtn.className = 'calendar-day';
      dayBtn.textContent = i;

      const thisDate = new Date(year, month, i);

      // Disable past days
      if (thisDate < today) {
        dayBtn.classList.add('disabled');
        dayBtn.disabled = true;
      } else {
        // If it's a valid future date, add click listener
        dayBtn.addEventListener('click', () => handleDateSelect(thisDate, dayBtn));
      }

      // Re-apply 'active' class if this day was previously selected
      if (selectedDateObj && thisDate.getTime() === selectedDateObj.getTime()) {
        dayBtn.classList.add('active');
      }

      calendarDaysContainer.appendChild(dayBtn);
    }
  }

  function handleDateSelect(dateObj, btnElement) {
    // Remove active class from all days
    document.querySelectorAll('.calendar-day').forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked day
    btnElement.classList.add('active');
    
    // Update State
    selectedDateObj = dateObj;
    selectedTimeStr = null; // Reset time when date changes
    
    // Update Summary UI
    summaryDate.textContent = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    summaryTime.textContent = 'Not selected';
    updateConfirmButton();

    // Render Time Slots
    renderTimeSlots();
  }

  function renderTimeSlots() {
    timeSlotsContainer.innerHTML = '';
    
    // Simulate some times being randomly unavailable based on the date
    availableTimes.forEach((time, index) => {
      // Randomly skip some times just to make it feel real (unless it's the first 3 times)
      if (index > 2 && Math.random() > 0.7) return; 

      const timeBtn = document.createElement('button');
      timeBtn.className = 'time_btn';
      timeBtn.type = 'button'; // Prevent form submission on click
      timeBtn.textContent = time;

      timeBtn.addEventListener('click', () => handleTimeSelect(time, timeBtn));
      timeSlotsContainer.appendChild(timeBtn);
    });
  }

  function handleTimeSelect(time, btnElement) {
    // Remove active from all time buttons
    document.querySelectorAll('.time_btn').forEach(btn => btn.classList.remove('active'));
    
    // Add active to clicked time
    btnElement.classList.add('active');
    
    // Update State
    selectedTimeStr = time;
    
    // Update Summary UI
    summaryTime.textContent = time;
    updateConfirmButton();
  }

  function updateConfirmButton() {
    // Enable button only if both date and time are selected
    if (selectedDateObj && selectedTimeStr) {
      confirmBtn.disabled = false;
    } else {
      confirmBtn.disabled = true;
    }
  }

  // Handle Form Submission
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // In a real app, you would send this data to a server
    const service = document.getElementById('bookingService').value;
    const petName = document.getElementById('petName').value;
    const ownerName = document.getElementById('ownerName').value;
    
    if (!service) {
      alert("Please select a service first!");
      return;
    }
    
    console.log("Booking Confirmed:", {
      service, petName, ownerName, date: summaryDate.textContent, time: selectedTimeStr
    });

    // Alert the user and redirect back to homepage
    alert(`🎉 Booking Confirmed!\n\nWe will see ${petName} on ${summaryDate.textContent} at ${selectedTimeStr} for ${service}.`);
    window.location.href = 'homepage.html';
  });

});
