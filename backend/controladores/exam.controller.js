// backend/controladores/exam.controller.js
const preguntas = require('../data/preguntas');
const usuarios = require('../data/usuarios');
const certificaciones = require('../data/certificaciones');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// === FUNCIÓN PARA BARAJAR ===
function barajar(array) {
  const nuevo = [...array];
  for (let i = nuevo.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nuevo[i], nuevo[j]] = [nuevo[j], nuevo[i]];
  }
  return nuevo;
}

// === START ===
const start = (req, res) => {
  const { certId } = req.body;
  const userId = req.userId;

  const usuario = usuarios.find(u => u.id === userId);
  const cert = certificaciones.find(c => c.id === certId);

  if (!cert || !cert.activa) {
    return res.status(400).json({ error: "Certificación no disponible" });
  }

  if (!usuario.pagado[certId]) {
    return res.status(403).json({ error: "Debes pagar para iniciar el examen" });
  }

  if (usuario.intento && usuario.intento.certId === certId) {
    return res.status(403).json({ error: "El examen solo se puede aplicar una vez" });
  }

  let banco = preguntas.filter(p => p.certId === certId);
  const seleccionadas = barajar(banco).slice(0, 8);

  const preguntasExamen = seleccionadas.map(preg => {
    const opcionesBarajadas = barajar(preg.opciones);
    const indiceCorrecta = opcionesBarajadas.indexOf(preg.opciones[preg.correcta]);
    return {
      id: preg.id,
      texto: preg.texto,
      opciones: opcionesBarajadas,
      correcta: indiceCorrecta
    };
  });

  usuario.intento = {
    certId,
    preguntas: preguntasExamen,
    respuestas: Array(8).fill(null),
    inicio: Date.now(),
    tiempoTotal: cert.tiempoMinutos * 60 * 1000,
    calificacion: null
  };

  res.json({
    intentoId: `${userId}-${certId}`,
    preguntas: preguntasExamen.map(p => ({
      id: p.id,
      texto: p.texto,
      opciones: p.opciones
    })),
    tiempoMinutos: cert.tiempoMinutos
  });
};

// === SUBMIT ===
const submit = (req, res) => {
  const { certId, respuestas } = req.body;
  const userId = req.userId;

  const usuario = usuarios.find(u => u.id === userId);
  const cert = certificaciones.find(c => c.id === certId);

  if (!usuario.intento || usuario.intento.certId !== certId) {
    return res.status(400).json({ error: "No hay intento activo" });
  }

  const { preguntas } = usuario.intento;
  let correctas = 0;

  respuestas.forEach((resp, i) => {
    if (resp === preguntas[i].correcta) correctas++;
  });

  const calificacion = Math.round((correctas / preguntas.length) * 100);
  const aprobado = calificacion >= cert.puntuacionMin;

  // Guardar calificación
  usuario.intento.calificacion = calificacion;

  res.json({
    calificacion,
    aprobado,
    correctas,
    total: preguntas.length
  });
};


const pagar = (req, res) => {
  const { certId } = req.body;
  const userId = req.userId; // ← Viene del middleware

  const usuario = usuarios.find(u => u.id === userId);
  const cert = certificaciones.find(c => c.id === certId);

  if (!cert || !cert.activa) {
    return res.status(400).json({ error: "Certificación no disponible" });
  }

  if (!usuario.pagado) {
    usuario.pagado = {};
  }

  if (usuario.pagado[certId]) {
    return res.status(400).json({ error: "Ya pagaste esta certificación" });
  }

  usuario.pagado[certId] = true;
  res.json({ mensaje: "Pago simulado exitoso" });
};


// === GENERAR PDF ===

const generarCertificado = require('../utils/generarPDF');

const generarPDF = async (req, res) => {
  const userId = req.userId;
  const certId = parseInt(req.query.certId);

  const usuario = usuarios.find(u => u.id === userId);
  const cert = certificaciones.find(c => c.id === certId);

  if (!usuario || !cert || !usuario.intento?.calificacion || usuario.intento.calificacion < cert.puntuacionMin) {
    return res.status(403).json({ error: "No autorizado para certificado" });
  }

  try {
    const pdfBuffer = await generarCertificado(usuario, cert, usuario.intento.calificacion);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Certificado_${cert.nombre.replace(/ /g,'_')}.pdf"`
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al generar el certificado" });
  }
};



// === EXPORTAR AL FINAL ===
module.exports = { start, submit, generarPDF, pagar };