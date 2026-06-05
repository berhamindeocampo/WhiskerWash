const currentYear = new Date().getFullYear();

const yearElement = document.getElementById('current-year');
if (yearElement) {
  yearElement.textContent = currentYear;
} else {
  const copyrightElement = document.getElementById('copyright') || document.querySelector('.copyright');
  if (copyrightElement) {
    copyrightElement.textContent = `© ${currentYear} WhiskerWash. All Rights Reserved.`;
  }
}
