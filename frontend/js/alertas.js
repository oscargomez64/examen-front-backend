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

  // Auto-cerrar
  setTimeout(() => {
    if (alerta.parentElement) alerta.remove();
  }, 4000);
}

// Inyectar estilos
const style = document.createElement('style');
style.textContent = `
  .alerta {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    animation: slideIn 0.4s ease;
  }
  .alerta-exito { background: #4caf50; }
  .alerta-error { background: #f44336; }
  .alerta-cerrar {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;
document.head.appendChild(style);