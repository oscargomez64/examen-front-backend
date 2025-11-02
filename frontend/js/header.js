// frontend/js/header.js
function cargarHeader() {
  const usuario = JSON.parse(localStorage.getItem('usuario')) || null;
  const token = localStorage.getItem('token');

  document.getElementById('header-container').innerHTML = `
    <div class="header-top">
      <div class="logo">
        <img src="img/logo.png" alt="CertiCode Logo" />
        <div>
          <h1>CertiCode</h1>
          <p class="slogan">Certifica tu futuro, domina el código</p>
        </div>
      </div>
      <nav class="menu">
        <a href="index.html">Inicio</a>
        <a href="certificaciones.html">Certificaciones</a>
        <a href="contacto.html">Contacto</a>
        <a href="nosotros.html">Nosotros</a>
      </nav>
      <div class="auth-section">
        ${usuario 
          ? `<span class="usuario-activo">¡Hola, ${usuario.nombre.split(' ')[0]}!</span>
             <button onclick="logout()" class="btn-logout">Cerrar sesión</button>`
          : `<a href="login.html" class="btn-login">Iniciar sesión</a>`
        }
      </div>
    </div>
  `;
}

// Función logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = 'index.html';
}

// Cargar al inicio
document.addEventListener('DOMContentLoaded', cargarHeader);