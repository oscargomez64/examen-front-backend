// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();
const contactoRoutes = require('./rutas/contacto.routes');

app.use(cors({
  origin: '*' // Permite cualquier origen (ideal para pruebas)
}));

app.use(express.json());

// Rutas
app.use('/api/auth', require('./rutas/auth.routes'));
app.use('/api/exam', require('./rutas/exam.routes'));
app.use('/api/contacto', require('./rutas/contacto.routes'));


// Puerto
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
  console.log(`Accede en: http://TU_IP_LOCAL:${PORT}`);
});