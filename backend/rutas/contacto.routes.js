// backend/rutas/contacto.routes.js
const express = require('express');
const router = express.Router();

const mensajes = [];

router.post('/enviar', (req, res) => {
  const { nombre, email, mensaje } = req.body;
  
  mensajes.push({ nombre, email, mensaje, fecha: new Date().toISOString() });
  
  console.log('📧 NUEVO MENSAJE:', { nombre, email, mensaje });
  
  res.json({ mensaje: "Mensaje enviado correctamente" });
});

router.get('/mensajes', (req, res) => {
  res.json(mensajes);
});

module.exports = router;