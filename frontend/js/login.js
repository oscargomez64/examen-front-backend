// frontend/js/login.js
document.getElementById('form-login').addEventListener('submit', async (e) => {
  e.preventDefault();

  const cuenta = document.getElementById('cuenta').value.trim();
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cuenta, password })
    });

    const data = await response.json();

    if (!response.ok) {
      mostrarAlerta('error', data.error || 'Error en el servidor');
      return;
    }

    // Guardar en localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));

    mostrarAlerta('exito', data.mensaje);
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);

  } catch (err) {
    mostrarAlerta('error', 'Error de conexión');
  }
});