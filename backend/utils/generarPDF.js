// backend/utils/generarPDF.js
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generarCertificado(usuario, cert, calificacion) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margin: 50
    });

    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    // Fondo elegante
    doc.rect(0, 0, doc.page.width, doc.page.height)
       .fill('#f8f9ff');

    // Borde decorativo
    doc.lineWidth(8)
       .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
       .stroke('#6e8efb');

    // Logo empresa
    const logoPath = path.join(__dirname, '../frontend/img/logo.png');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 40, { width: 100 });
    }

    // Título
    doc.fontSize(36)
       .fillColor('#6e8efb')
       .font('Helvetica-Bold')
       .text('CERTIFICADO DE COMPETENCIA', 0, 160, {
         align: 'center',
         width: doc.page.width
       });

    // Subtítulo
    doc.fontSize(20)
       .fillColor('#333')
       .font('Helvetica')
       .text('Se hace constar que:', 0, 230, { align: 'center', width: doc.page.width });

    // Nombre del usuario
    doc.fontSize(28)
       .fillColor('#6e8efb')
       .font('Helvetica-Bold')
       .text(usuario.nombre, 0, 280, { align: 'center', width: doc.page.width });

    // Certificación
    doc.fontSize(18)
       .fillColor('#333')
       .font('Helvetica')
       .text(`ha completado exitosamente la certificación en`, 0, 330, { align: 'center' })
       .text(cert.nombre, 0, 355, { align: 'center', width: doc.page.width });

    // Calificación
    doc.fontSize(16)
       .text(`con una calificación de ${calificacion}%`, 0, 400, { align: 'center' });

    // Fecha y ciudad
    const hoy = new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
    doc.fontSize(14)
       .fillColor('#555')
       .text(`Aguascalientes, Ags. a ${hoy}`, 0, 450, { align: 'center' });

    // Firma instructor
    const firmaInstPath = path.join(__dirname, '../frontend/img/instructor_firma.png');
    if (fs.existsSync(firmaInstPath)) {
      doc.image(firmaInstPath, 180, 480, { width: 120 });
    }
    doc.fontSize(12)
       .fillColor('#333')
       .text('Dra. Georgina Salazar Partida', 160, 600, { width: 160, align: 'center' })
       .text('Instructora', 160, 615, { width: 160, align: 'center' });

    // Firma CEO
    const firmaCEOPath = path.join(__dirname, '../frontend/img/ceo_firma.png');
    if (fs.existsSync(firmaCEOPath)) {
      doc.image(firmaCEOPath, 500, 480, { width: 120 });
    }
    doc.fontSize(12)
       .text('Ing. Alejandro Ramírez', 480, 600, { width: 160, align: 'center' })
       .text('CEO de CertiCode', 480, 615, { width: 160, align: 'center' });

    // Pie de página
    doc.fontSize(10)
       .fillColor('#999')
       .text('CertiCode - Certifica tu futuro, domina el código', 0, 540, { align: 'center', width: doc.page.width });

    doc.end();
  });
}

module.exports = generarCertificado;