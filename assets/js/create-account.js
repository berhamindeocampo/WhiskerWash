document.addEventListener('DOMContentLoaded', () => {
  const createAccountForm = document.getElementById('create-account-form');
  
  if (createAccountForm) {
    createAccountForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      
      // Basic validation
      if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
      }

      if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
      }
      
      // Save account info to simulate registration and linking profile
      const profileData = {
        name: name,
        email: email,
        pet: '' // Empty initial pet name
      };
      
      localStorage.setItem('whiskerWashProfile', JSON.stringify(profileData));
      
      // Animate button for success state
      const submitBtn = createAccountForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Account Created! 🎉';
      submitBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)';
      submitBtn.style.boxShadow = '0 8px 20px rgba(76, 175, 80, 0.4)';
      submitBtn.style.transform = 'scale(1.02)';
      
      // Redirect to account dashboard
      setTimeout(() => {
        window.location.href = 'account.html';
      }, 1200);
    });
  }
});
