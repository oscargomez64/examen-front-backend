// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
const contactoRoutes = require('./rutas/contacto.routes');

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', require('./rutas/auth.routes'));
app.use('/api/exam', require('./rutas/exam.routes'));
app.use('/api/contacto', require('./rutas/contacto.routes'));
app.use('/api/contacto', contactoRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});