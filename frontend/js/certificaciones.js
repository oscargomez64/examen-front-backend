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
      const esActiva = !!cert.activa;
      const puedePagar = esActiva && !pagado;
      const puedeExamen = esActiva && pagado && !!usuario;

      // ✅ Solo SVG: si no viene, usa el placeholder
      const imgSrc = cert.imagen?.endsWith('.svg') 
        ? cert.imagen 
        : `img/${(cert.imagen || 'cert-placeholder')}.svg`;

      return `
        <div class="cert-card ${!esActiva ? 'inactiva' : ''}">
          <div class="cert-img-box">
            <img 
              src="${imgSrc}" 
              alt="${escapeHtml(cert.nombre || 'Certificación')}" 
              class="cert-img"
              onerror="this.src='img/cert-placeholder.svg'"
            />
          </div>

          <h3>${escapeHtml(cert.nombre)}</h3>
          <p>${escapeHtml(cert.descripcion || '')}</p>
          
          <div class="cert-info">
            <span><strong>Puntuación mínima:</strong> ${Number(cert.puntuacionMin) || 0}%</span>
          </div>
          <div class="cert-info">
            <span><strong>Tiempo:</strong> ${Number(cert.tiempoMinutos) || 0} min</span>
          </div>
          <div class="cert-info">
            <span><strong>Costo:</strong> $${Number(cert.costo) || 0} MXN</span>
          </div>

          ${!esActiva ? `
            <div class="cert-disponible">
              Disponible: ${escapeHtml(cert.fechaDisponible || '')}
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
    if (typeof mostrarAlerta === 'function') {
      mostrarAlerta('error', 'Error al cargar certificaciones');
    } else {
      console.error('Error al cargar certificaciones:', err);
    }
  }
}

function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

async function pagarCertificacion(certId) {
  const token = localStorage.getItem('token');
  let usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!token || !usuario) {
    if (typeof mostrarAlerta === 'function') mostrarAlerta('error', 'Debes iniciar sesión');
    return;
  }

  if (!usuario.pagado) usuario.pagado = {};

  if (usuario.pagado[certId]) {
    if (typeof mostrarAlerta === 'function') mostrarAlerta('error', 'Ya pagaste esta certificación');
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
      if (typeof mostrarAlerta === 'function') mostrarAlerta('exito', '¡Pago simulado exitoso!');
      cargarCertificaciones();
    } else {
      if (typeof mostrarAlerta === 'function') mostrarAlerta('error', data.error || 'Error en el pago');
    }
  } catch (err) {
    if (typeof mostrarAlerta === 'function') mostrarAlerta('error', 'Error en el pago');
  }
}

async function iniciarExamen(certId) {
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!usuario?.pagado?.[certId]) {
    if (typeof mostrarAlerta === 'function') mostrarAlerta('error', 'Debes pagar antes de iniciar');
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
      if (typeof mostrarAlerta === 'function') mostrarAlerta('error', data.error || 'No se pudo iniciar el examen');
      return;
    }

    localStorage.setItem('intento', JSON.stringify({
      certId,
      preguntas: data.preguntas,
      respuestas: Array(data.preguntas.length).fill(null),
      tiempoRestante: data.tiempoMinutos * 60,
      inicio: Date.now()
    }));

    window.location.href = `examen.html?cert=${certId}`;
  } catch (err) {
    if (typeof mostrarAlerta === 'function') mostrarAlerta('error', 'Error al iniciar examen');
  }
}