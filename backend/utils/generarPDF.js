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
      console.log('PDF generado correctamente');
      resolve(Buffer.concat(buffers));
    });
    doc.on('error', (err) => {
      console.error('Error en PDFKit:', err);
      reject(err);
    });

    try {
      const imgBase = path.join(__dirname, '../img');

      doc.rect(0, 0, doc.page.width, doc.page.height).fill('#ffffff');

      const gradient = doc.linearGradient(0, 0, doc.page.width, 0);
      gradient.stop(0, '#6e8efb').stop(1, '#a777e3');
      doc.rect(0, 0, doc.page.width, 70).fill(gradient);

      doc.lineWidth(5)
         .rect(25, 25, doc.page.width - 50, doc.page.height - 50)
         .stroke('#a777e3');

      const logoPath = path.join(imgBase, 'logo.png');
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 20, { width: 90 });
      }

      doc.font('Helvetica-Bold')
         .fontSize(34)
         .fillColor('#333')
         .text('CERTIFICADO DE COMPETENCIA', 0, 130, { align: 'center' });

      doc.font('Helvetica')
         .fontSize(18)
         .fillColor('#444')
         .text('Por haber completado satisfactoriamente la certificación en:', 0, 190, { align: 'center' });

      doc.font('Helvetica-Bold')
         .fontSize(26)
         .fillColor('#6e8efb')
         .text(cert.nombre, 0, 230, { align: 'center' });

      doc.font('Helvetica')
         .fontSize(16)
         .fillColor('#333')
         .text('Otorgado a:', 0, 280, { align: 'center' });

      doc.font('Helvetica-Bold')
         .fontSize(30)
         .fillColor('#111')
         .text(usuario.nombre, 0, 310, { align: 'center' });

      doc.font('Helvetica')
         .fontSize(16)
         .text(`Con una calificación final de ${calificacion}%`, 0, 365, { align: 'center' });

      const hoy = new Date().toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      doc.font('Helvetica-Oblique')
         .fontSize(13)
         .fillColor('#555')
         .text(`Aguascalientes, Ags. — ${hoy}`,0, 40, { align: 'center' });

      const firmaInstPath = path.join(imgBase, 'instructor_firma.png');
      const firmaCEOPath = path.join(imgBase, 'ceo_firma.png');

      const firmaY = 400;
      const centroX = doc.page.width / 2;
      const anchoFirma = 120;
      const espacio = 210;

      if (fs.existsSync(firmaInstPath)) {
        doc.image(firmaInstPath, centroX - espacio - anchoFirma / 2, firmaY, { width: anchoFirma });
      }
      doc.font('Helvetica').fontSize(12).fillColor('#333')
         .text('Dr. Uriel Ezequiel Rosales', centroX - espacio - 80, firmaY + 100, { width: 160, align: 'center' })
         .text('Instructor', centroX - espacio - 80, firmaY + 120, { width: 160, align: 'center' });

      if (fs.existsSync(firmaCEOPath)) {
        doc.image(firmaCEOPath, centroX + espacio - anchoFirma / 2, firmaY, { width: anchoFirma });
      }
      doc.text('Ing. Oscar Gómez Ruiz', centroX + espacio - 80, firmaY + 100, { width: 160, align: 'center' })
         .text('CEO de CertiCode', centroX + espacio - 80, firmaY + 120, { width: 160, align: 'center' });

      doc.end();
    } catch (err) {
      console.error('Error al generar PDF:', err);
      reject(err);
    }
  });
}

module.exports = generarCertificado;
