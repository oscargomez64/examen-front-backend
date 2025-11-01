// frontend/js/certificaciones.js
document.addEventListener('DOMContentLoaded', () => {
  cargarCertificaciones();
});

async function cargarCertificaciones() {
  try {
    const response = await fetch('http://localhost:3000/api/exam/certificaciones');
    const certificaciones = await response.json();

    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const grid = document.getElementById('cert-grid');

    grid.innerHTML = certificaciones.map(cert => {
      const pagado = usuario?.pagado?.[cert.id] || false;
      const esActiva = cert.activa;
      const puedePagar = esActiva && !pagado;
      const puedeExamen = esActiva && pagado && usuario;

      return `
        <div class="cert-card ${!esActiva ? 'inactiva' : ''}">
          <h3>${cert.nombre}</h3>
          <p>${cert.descripcion}</p>
          
          <div class="cert-info">
            <span><strong>Puntuación mínima:</strong> ${cert.puntuacionMin}%</span>
          </div>
          <div class="cert-info">
            <span><strong>Tiempo:</strong> ${cert.tiempoMinutos} min</span>
          </div>
          <div class="cert-info">
            <span><strong>Costo:</strong> $${cert.costo} MXN</span>
          </div>

          ${!esActiva ? `
            <div class="cert-disponible">
              Disponible: ${cert.fechaDisponible}
            </div>
          ` : ''}

          <div class="cert-actions">
            <button 
              class="btn btn-pagar" 
              ${!puedePagar ? 'disabled' : ''}
              onclick="pagarCertificacion(${cert.id})">
              ${pagado ? 'Pagado ✓' : 'Pagar'}
            </button>
            <button 
              class="btn btn-examen" 
              ${!puedeExamen ? 'disabled' : ''}
              onclick="iniciarExamen(${cert.id})">
              Iniciar Examen
            </button>
          </div>
        </div>
      `;
    }).join('');

  } catch (err) {
    mostrarAlerta('error', 'Error al cargar certificaciones');
  }
}

async function pagarCertificacion(certId) {
  const token = localStorage.getItem('token');
  let usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!token || !usuario) {
    mostrarAlerta('error', 'Debes iniciar sesión');
    return;
  }

  // Aseguramos que pagado exista
  if (!usuario.pagado) {
    usuario.pagado = {};
  }

  if (usuario.pagado[certId]) {
    mostrarAlerta('error', 'Ya pagaste esta certificación');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/exam/pagar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ certId })
    });

    const data = await response.json();

    if (response.ok) {
      usuario.pagado[certId] = true;
      localStorage.setItem('usuario', JSON.stringify(usuario));
      mostrarAlerta('exito', '¡Pago simulado exitoso!');
      cargarCertificaciones(); // Recarga tarjetas
    } else {
      mostrarAlerta('error', data.error);
    }
  } catch (err) {
    mostrarAlerta('error', 'Error en el pago');
  }
}

async function iniciarExamen(certId) {
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!usuario?.pagado?.[certId]) {
    mostrarAlerta('error', 'Debes pagar antes de iniciar');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/exam/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ certId })
    });

    const data = await response.json();

    if (!response.ok) {
      mostrarAlerta('error', data.error);
      return;
    }

    // Guardar intento en localStorage
    localStorage.setItem('intento', JSON.stringify({
      certId,
      preguntas: data.preguntas,
      respuestas: Array(data.preguntas.length).fill(null),
      tiempoRestante: data.tiempoMinutos * 60,
      inicio: Date.now()
    }));

    window.location.href = `examen.html?cert=${certId}`;

  } catch (err) {
    mostrarAlerta('error', 'Error al iniciar examen');
  }
}