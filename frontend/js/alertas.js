// frontend/js/alertas.js
function mostrarAlerta(tipo, mensaje) {
  const alerta = document.createElement('div');
  alerta.className = `alerta alerta-${tipo}`;
  alerta.innerHTML = `
    <span>${mensaje}</span>
    <button class="alerta-cerrar">&times;</button>
  `;

  document.body.appendChild(alerta);

  // Cerrar al hacer clic
  alerta.querySelector('.alerta-cerrar').onclick = () => alerta.remove();

  // Auto-cerrar después de 4 segundos
  setTimeout(() => {
    if (alerta.parentElement) alerta.remove();
  }, 4000);
}

// Estilos
const style = document.createElement('style');
style.textContent = `
  .alerta {
    position: fixed;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%) translateY(50px);
    padding: 1.3rem 2rem;
    border-radius: 12px;
    color: white;
    font-weight: 600;
    font-size: 1.1rem;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 8px 30px rgba(0,0,0,0.25);
    animation: alertaUp 0.35s ease-out forwards;
    backdrop-filter: blur(6px);
  }

  .alerta-exito { background: linear-gradient(135deg, #3EDC81, #2CBF63); }
  .alerta-error { background: linear-gradient(135deg, #FF5A5A, #D42929); }

  .alerta-cerrar {
    background: none;
    border: none;
    color: white;
    font-size: 1.4rem;
    cursor: pointer;
    padding: 0;
    width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.2s;
  }

  .alerta-cerrar:hover {
    transform: scale(1.2);
  }

  @keyframes alertaUp {
    0% { transform: translateX(-50%) translateY(80px); opacity: 0; }
    100% { transform: translateX(-50%) translateY(0); opacity: 1; }
  }
`;
document.head.appendChild(style);
