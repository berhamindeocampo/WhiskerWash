document.addEventListener('DOMContentLoaded', () => {
    initCustomDropdown();
    initContactForm();
});

function initCustomDropdown() {
    const dropdown = document.getElementById('servicesDropdown');
    if (!dropdown) return;

    const toggle = dropdown.querySelector('.dropdown_toggle');
    const options = dropdown.querySelectorAll('.option_item');
    const selectedValue = dropdown.querySelector('.selected_value');
    const hiddenInput = document.getElementById('selected_service_input');

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
            selectedValue.style.color = '#111';
            dropdown.classList.remove('open');
        });
    });

    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });
}

function initContactForm() {
    const form = document.querySelector('.contact_form');
    if (!form) return;

    const popup = document.getElementById('contactPopup');
    const popupMessage = document.getElementById('contactPopupMessage');
    const closeButton = document.getElementById('closeContactPopup');

    const showPopup = (message, title = 'Message sent') => {
        if (popupMessage) popupMessage.textContent = message;
        if (popup) {
            popup.setAttribute('aria-hidden', 'false');
            popup.classList.add('open');
        }
        const titleElement = document.getElementById('contactPopupTitle');
        if (titleElement) titleElement.textContent = title;
    };

    const hidePopup = () => {
        if (popup) {
            popup.classList.remove('open');
            popup.setAttribute('aria-hidden', 'true');
        }
    };

    if (closeButton) closeButton.addEventListener('click', hidePopup);
    if (popup) {
        popup.addEventListener('click', (e) => {
            if (e.target === popup) hidePopup();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') hidePopup();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name')?.value.trim() || '',
            email: document.getElementById('email')?.value.trim() || '',
            phone: document.getElementById('phone')?.value.trim() || '',
            service: document.getElementById('selected_service_input')?.value || '',
            message: document.getElementById('message')?.value.trim() || ''
        };

        if (!formData.name || !formData.email || !formData.message) {
            showPopup('Please fill out Name, Email, and Message before sending.', 'Notice');
            return;
        }

        console.log('Form Submitted Successfully:', formData);
        showPopup('Thanks for reaching out! Your message has been captured.');

        form.reset();

        const selectedValue = document.querySelector('.selected_value');
        if (selectedValue) {
            selectedValue.textContent = 'Choose Service';
            selectedValue.style.color = '#6b7280';
        }

        const hiddenInput = document.getElementById('selected_service_input');
        if (hiddenInput) hiddenInput.value = '';
    });
}