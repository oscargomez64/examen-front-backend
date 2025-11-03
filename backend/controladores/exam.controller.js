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
// Reemplaza tu generarPDF con este:
const generarPDF = (req, res) => {
  const userId = req.userId;
  const certId = parseInt(req.query.certId);

  const usuario = usuarios.find(u => u.id === userId);
  const cert = certificaciones.find(c => c.id === certId);

  if (!usuario || !cert || !usuario.intento?.calificacion || usuario.intento.calificacion < cert.puntuacionMin) {
    return res.status(403).json({ error: "No autorizado para certificado" });
  }

  const doc = new PDFDocument({ 
    size: 'A4', 
    layout: 'landscape',
    margin: 50 
  });

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="Certificado_${cert.nombre.replace(/ /g,'_')}.pdf"`
  });
  doc.pipe(res);

  // LOGOS CON PATH CORRECTO
  const imgPath = path.join(__dirname, '../../frontend/img/');
  
  // Fondo elegante
  doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f4f7fa');
  
  // TÍTULOS
  doc.fontSize(32).fillColor('#6e8efb').text('CERTIFICADO DE COMPETENCIA', 50, 80);
  
  doc.fontSize(24).fillColor('#333').text('CertiCode', 50, 120);
  doc.fontSize(18).text('Certifica tu futuro, domina el código', 50, 145);

  // NOMBRE USUARIO (CENTRO)
  doc.fontSize(28).fillColor('#2c3e50').font('Helvetica-Bold')
     .text(usuario.nombre, 100, 220, { width: 600, align: 'center' });

  // CERTIFICACIÓN
  doc.fontSize(20).fillColor('#6e8efb').text(cert.nombre, 100, 280, { width: 600, align: 'center' });
  
  // CALIFICACIÓN
  doc.fontSize(16).text(`Calificación obtenida: ${usuario.intento.calificacion}%`, 100, 330, { align: 'center' });

  // FECHA Y CIUDAD
  const hoy = new Date().toLocaleDateString('es-MX', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  doc.fontSize(14).fillColor('#666')
     .text(`Aguascalientes, Ags. ${hoy}`, 100, 380, { align: 'center' });

  // FIRMAS
  const yFirma = 450;
  
  // Instructor
  doc.fontSize(14).text('Dra. Georgina Salazar Partida', 80, yFirma)
     .fontSize(12).text('Instructora CertiCode', 80, yFirma + 20);
  const firmaInst = `${imgPath}instructor_firma.png`;
  if (fs.existsSync(firmaInst)) doc.image(firmaInst, 80, yFirma - 30, { width: 80 });

  // CEO
  doc.fontSize(14).text('Ing. Carlos Mendoza', 450, yFirma)
     .fontSize(12).text('CEO CertiCode', 450, yFirma + 20);
  const firmaCEO = `${imgPath}ceo_firma.png`;
  if (fs.existsSync(firmaCEO)) doc.image(firmaCEO, 450, yFirma - 30, { width: 80 });

  doc.end();
};

// === EXPORTAR AL FINAL ===
module.exports = { start, submit, generarPDF, pagar };