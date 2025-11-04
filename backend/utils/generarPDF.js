// backend/utils/generarPDF.js
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Genera un certificado en formato PDF con diseño elegante y disposición formal.
 * @param {Object} usuario - Datos del usuario.
 * @param {Object} cert - Información de la certificación.
 * @param {number} calificacion - Calificación obtenida.
 * @returns {Promise<Buffer>} PDF generado.
 */
function generarCertificado(usuario, cert, calificacion) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margin: 50
    });

    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));

    /* === Fondo y marco decorativo === */
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f8f9ff');
    doc.lineWidth(8)
       .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
       .stroke('#6e8efb');

    /* === Logo institucional === */
    const logoPath = path.join(__dirname, '../frontend/img/logo.png');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 40, { width: 100 });
    }

    /* === Encabezado === */
    doc.font('Helvetica-Bold')
       .fontSize(36)
       .fillColor('#6e8efb')
       .text('CERTIFICADO DE COMPETENCIA', 0, 160, {
         align: 'center',
         width: doc.page.width
       });

    /* === Subtítulo === */
    doc.font('Helvetica')
       .fontSize(20)
       .fillColor('#333')
       .text('Se hace constar que:', 0, 230, {
         align: 'center',
         width: doc.page.width
       });

    /* === Nombre del participante === */
    doc.font('Helvetica-Bold')
       .fontSize(28)
       .fillColor('#6e8efb')
       .text(usuario.nombre, 0, 280, {
         align: 'center',
         width: doc.page.width
       });

    /* === Cuerpo del certificado === */
    doc.font('Helvetica')
       .fontSize(18)
       .fillColor('#333')
       .text('ha completado exitosamente la certificación en', 0, 330, { align: 'center' })
       .text(cert.nombre, 0, 355, {
         align: 'center',
         width: doc.page.width
       });

    doc.fontSize(16)
       .text(`con una calificación de ${calificacion}%`, 0, 400, { align: 'center' });

    /* === Fecha y lugar === */
    const hoy = new Date().toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    doc.font('Helvetica-Oblique')
       .fontSize(14)
       .fillColor('#555')
       .text(`Aguascalientes, Ags. a ${hoy}`, 0, 450, { align: 'center' });

    /* === Firmas === */
    const firmaInstPath = path.join(__dirname, '../frontend/img/instructor_firma.png');
    const firmaCEOPath = path.join(__dirname, '../frontend/img/ceo_firma.png');

    // Firma del instructor
    if (fs.existsSync(firmaInstPath)) {
      doc.image(firmaInstPath, 180, 480, { width: 120 });
    }
    doc.font('Helvetica')
       .fontSize(12)
       .fillColor('#333')
       .text('Dr. Uriel Ezequiel Rosales', 160, 610, { width: 160, align: 'center' })
       .text('Instructor', 160, 625, { width: 160, align: 'center' });

    // Firma del CEO
    if (fs.existsSync(firmaCEOPath)) {
      doc.image(firmaCEOPath, 500, 480, { width: 120 });
    }
    doc.font('Helvetica')
       .fontSize(12)
       .text('Ing. Oscar Gómez Ruiz', 480, 610, { width: 160, align: 'center' })
       .text('CEO de CertiCode', 480, 625, { width: 160, align: 'center' });

    /* === Pie de página === */
    doc.font('Helvetica-Oblique')
       .fontSize(10)
       .fillColor('#999')
       .text('CertiCode — Certifica tu futuro, domina el código.', 0, 570, {
         align: 'center',
         width: doc.page.width
       });

    doc.end();
  });
}

module.exports = generarCertificado;
