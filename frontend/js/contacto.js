// frontend/js/contacto.js
document.getElementById('form-contacto').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = e.target.nombre.value.trim();
  const email = e.target.email.value.trim();
  const mensaje = e.target.mensaje.value.trim();

  if (!nombre || !email || !mensaje) {
    mostrarAlerta('error', 'Por favor, completa todos los campos.');
    return;
  }

  try {
    const response = await fetch('http://172.20.10.3:3000/api/contacto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre, email, mensaje })
    });

    const data = await response.json();

    if (data.success) {
      mostrarAlerta('exito', '¡Mensaje Enviado!');
      e.target.reset(); // Limpia el formulario
    } else {
      mostrarAlerta('error', 'Error al enviar el mensaje.');
    }
  } catch (err) {
    mostrarAlerta('error', 'No se pudo conectar con el servidor.');
    console.error(err);
  }
});