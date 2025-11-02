// backend/rutas/contacto.routes.js
const express = require('express');
const router = express.Router();
const { mensajes } = require('../data/mensajes');

// POST: Recibir mensaje de contacto
router.post('/', (req, res) => {
  const { nombre, email, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ success: false, msg: 'Faltan datos' });
  }

  const nuevoMensaje = {
    id: Date.now(),
    nombre,
    email,
    mensaje,
    fecha: new Date().toLocaleString('es-MX')
  };

  mensajes.push(nuevoMensaje);

  console.log('📩 NUEVO MENSAJE DE CONTACTO:');
  console.log(nuevoMensaje);
  console.log('Total mensajes:', mensajes.length);

  res.json({ success: true, msg: 'Mensaje recibido' });
});

module.exports = router;