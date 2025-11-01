// backend/rutas/exam.routes.js
const express = require('express');
const router = express.Router();
const certificaciones = require('../data/certificaciones');
const authMiddleware = require('../middleware/auth.middleware');
const { start, submit, generarPDF, pagar } = require('../controladores/exam.controller');

router.get('/certificaciones', (req, res) => {
  res.json(certificaciones);
});

router.post('/pagar', authMiddleware, pagar);
router.post('/start', authMiddleware, start);
router.post('/submit', authMiddleware, submit);
router.get('/pdf', authMiddleware, generarPDF);

module.exports = router;