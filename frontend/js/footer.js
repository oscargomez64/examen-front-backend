// frontend/js/footer.js
function cargarFooter() {
  document.getElementById('footer-container').innerHTML = `
    <footer class="footer-content">
      <div class="footer-logo">
        <img src="img/logo.svg" alt="CertiCode" height="40" />
        <p>CertiCode &copy; 2025</p>
      </div>

      <div class="footer-redes">
        <a href="https://instagram.com/certicode" target="_blank" aria-label="Instagram">
          <img src="img/instagram.svg" alt="Instagram" height="28" />
        </a>
      </div>

      <div class="footer-info">
        <p>Plataforma de certificaciones en programación</p>
        <p>contacto@certicode.com</p>
      </div>
    </footer>
  `;
}

document.addEventListener('DOMContentLoaded', cargarFooter);
