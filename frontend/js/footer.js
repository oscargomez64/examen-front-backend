// frontend/js/footer.js
function cargarFooter() {
  document.getElementById('footer-container').innerHTML = `
    <div class="footer-content">
      <div class="footer-logo">
        <img src="img/logo.png" alt="CertiCode" />
        <p>CertiCode &copy; 2025</p>
      </div>
      <div class="footer-redes">
        <a href="https://instagram.com/certicode" target="_blank">
          <img src="img/instagram.png" alt="Instagram" />
        </a>
      </div>
      <div class="footer-info">
        <p>Plataforma de certificaciones en programación</p>
        <p>contacto@certicode.com</p>
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', cargarFooter);