function cargarHeader() {
  const usuario = JSON.parse(localStorage.getItem('usuario')) || null;
  const token = localStorage.getItem('token');

  document.getElementById('header-container').innerHTML = `
    <header class="header-responsive">
      <div class="logo-section">
        <img src="img/logo.png" alt="CertiCode Logo" class="logo-img" />
        <div class="brand-text">
          <h1 class="brand-name">CertiCode</h1>
          <p class="slogan">Certifica tu futuro, domina el código</p>
        </div>
      </div>

      <!-- Botón hamburguesa -->
      <button class="menu-toggle" id="menu-toggle" aria-label="Menú">
        <span></span><span></span><span></span>
      </button>

      <!-- Menú -->
      <nav class="menu" id="nav-menu">
        <a href="index.html">Inicio</a>
        <a href="certificaciones.html">Certificaciones</a>
        <a href="contacto.html">Contacto</a>
        <a href="nosotros.html">Nosotros</a>
      </nav>

      <!-- Usuario -->
      <div class="auth-section">
        ${usuario 
          ? `<span class="usuario-activo">¡Hola, ${usuario.nombre.split(' ')[0]}!</span>
             <button onclick="logout()" class="btn-logout">Cerrar sesión</button>`
          : `<a href="login.html" class="btn-login">Iniciar sesión</a>`
        }
      </div>
    </header>
  `;

  // === JS DEL MENÚ RESPONSIVE ===
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
  });

  // Cerrar al hacer clic en enlace
  document.querySelectorAll('#nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      menuToggle.classList.remove('active');
    });
  });
}

// Logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  mostrarAlerta('exito', 'Sesión cerrada');
  setTimeout(() => window.location.href = 'index.html', 1000);
}

// Cargar
document.addEventListener('DOMContentLoaded', cargarHeader);