// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();
const contactoRoutes = require('./rutas/contacto.routes');
const ALLOWED_ORIGINS = [
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://172.20.10.2:5500',
  'http://172.20.10.4:5500'
  // Ingrese otros IP clientes aquí
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    
    // Si el origenno está permitido, se rechaza la solicitud con un mensaje de error.
    return callback(new Error('Not allowed by CORS: ' + origin));
  },

  // Especifica los métodos HTTP que este servidor aceptará
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],

  // Algunos navegadores antiguos esperan un código 200 (en lugar de 204) en respuestas "preflight".
  optionsSuccessStatus: 200
}));

app.use(express.json());

// Rutas
app.use('/api/auth', require('./rutas/auth.routes'));
app.use('/api/exam', require('./rutas/exam.routes'));
app.use('/api/contacto', require('./rutas/contacto.routes'));


// Puerto
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});