// js/header.js
function cargarHeader() {
  const usuario = JSON.parse(localStorage.getItem('usuario')) || null;

  const root = document.getElementById('header-container');
  if (!root) return;

  root.innerHTML = `
    <header class="header-responsive">
      <div class="logo-section">
        <!-- El src se ajusta dinámicamente abajo -->
        <img id="logo-img" src="" alt="CertiCode Logo" class="logo-img" />
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
        ${
          usuario
            ? `<span class="usuario-activo">¡Hola, ${(usuario.nombre || '').split(' ')[0] || 'usuario'}!</span>
               <button onclick="logout()" class="btn-logout">Cerrar sesión</button>`
            : `<a href="login.html" class="btn-login">Iniciar sesión</a>`
        }
      </div>
    </header>
  `;

  // === Selección robusta del logo (prueba varias extensiones) ===
  (function setLogo() {
    const logo = document.getElementById('logo-img');
    if (!logo) return;

    const candidatos = [
      'img/logo.svg',
      'img/logo.png',
      'img/logo.webp',
      'img/logo.jpg',
      'img/logo.jpeg'
    ];

    let i = 0;
    const tryNext = () => {
      if (i >= candidatos.length) {
        // Último recurso: mostrar solo texto alterno (ya está en alt)
        console.warn('No se encontró ninguna variante del logo en /img/');
        return;
      }
      logo.onerror = () => {
        i++;
        tryNext();
      };
      logo.src = candidatos[i];
    };

    tryNext();
  })();

  // === JS DEL MENÚ RESPONSIVE ===
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
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
}

// Logout
async function logout() {
  try {
    const res = await fetch("http://localhost:3000/api/auth/logout", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (res.ok) {
      if (typeof mostrarAlerta === 'function') {
        mostrarAlerta('exito', 'Sesión cerrada');
      }
    } else {
      const data = await res.json();
      if (typeof mostrarAlerta === 'function') {
        mostrarAlerta('error', 'Error al cerrar sesión')
      }
    }
  } catch (err) {
    console.error("Error al conectar con el servidor", err);
    if (typeof mostrarAlerta === 'function') {
      mostrarAlerta('error', 'Error al conectar con el servidor');
    }
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  
    setTimeout(() => (window.location.href = 'index.html'), 1000);
  }
}

// Cargar
document.addEventListener('DOMContentLoaded', cargarHeader);
