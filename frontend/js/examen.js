// frontend/js/examen.js
let intento = null;
let timerInterval = null;

document.addEventListener('DOMContentLoaded', () => {
  cargarExamen();
});

function cargarExamen() {
  intento = JSON.parse(localStorage.getItem('intento'));
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!intento || !usuario) {
    mostrarAlerta('error', 'No hay examen activo');
    setTimeout(() => window.location.href = 'certificaciones.html', 2000);
    return;
  }

  // Mostrar info
  const cert = intento.preguntas[0]?.certId || intento.certId;
  const certData = { 1: "JavaScript Avanzado" }[cert];
  document.getElementById('cert-nombre').textContent = certData;
  document.getElementById('usuario-nombre').textContent = usuario.nombre;

  // Renderizar preguntas
  const container = document.getElementById('preguntas-container');
  container.innerHTML = intento.preguntas.map((preg, i) => `
    <div class="pregunta">
      <h3>${i + 1}. ${preg.texto}</h3>
      <div class="opciones">
        ${preg.opciones.map((opcion, j) => `
          <label class="opcion">
            <input type="radio" name="preg-${preg.id}" value="${j}" 
              ${intento.respuestas[i] === j ? 'checked' : ''}>
            <span>${opcion}</span>
          </label>
        `).join('')}
      </div>
    </div>
  `).join('');

  // Mostrar botón enviar
  document.getElementById('btn-enviar').style.display = 'block';
  document.getElementById('btn-enviar').onclick = enviarRespuestas;

  // Iniciar temporizador
  iniciarTemporizador();
}

function iniciarTemporizador() {
  const timerEl = document.getElementById('timer');
  let tiempoRestante = intento.tiempoRestante;

  const actualizar = () => {
    const minutos = Math.floor(tiempoRestante / 60);
    const segundos = tiempoRestante % 60;
    timerEl.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;

    if (tiempoRestante <= 0) {
      clearInterval(timerInterval);
      mostrarAlerta('info', '¡Tiempo agotado! Enviando respuestas...');
      enviarRespuestas();
      return;
    }

    tiempoRestante--;
    intento.tiempoRestante = tiempoRestante;
    localStorage.setItem('intento', JSON.stringify(intento));
  };

  actualizar();
  timerInterval = setInterval(actualizar, 1000);
}

async function enviarRespuestas() {
  if (timerInterval) clearInterval(timerInterval);

  // Recolectar respuestas
  intento.preguntas.forEach((preg, i) => {
    const seleccion = document.querySelector(`input[name="preg-${preg.id}"]:checked`);
    intento.respuestas[i] = seleccion ? parseInt(seleccion.value) : null;
  });

  localStorage.setItem('intento', JSON.stringify(intento));

  const token = localStorage.getItem('token');
  try {
    const response = await fetch('http://172.20.10.3:3000/api/exam/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        certId: intento.certId,
        respuestas: intento.respuestas
      })
    });

    const data = await response.json();

    if (response.ok) {
      mostrarAlerta('exito', `¡Calificación: ${data.calificacion}%! ${data.aprobado ? 'Aprobado' : 'No aprobado'}`);
      
      if (data.aprobado) {
        mostrarAlerta('felicitacion', '¡FELICIDADES! Descargando tu certificado...');

        fetch(`http://172.20.10.3:3000/api/exam/pdf?certId=${intento.certId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(r => r.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Certificado_CertiCode.pdf`;
          a.click();
          URL.revokeObjectURL(url);
        })
        .catch(() => mostrarAlerta('error', 'Error al generar PDF'));
      }

      setTimeout(limpiarExamen, 4000);
    } else {
      mostrarAlerta('error', data.error);
    }
  } catch (err) {
    mostrarAlerta('error', 'Error al enviar respuestas');
  }
}

function limpiarExamen() {
  localStorage.removeItem('intento');
  window.location.href = 'certificaciones.html';
}