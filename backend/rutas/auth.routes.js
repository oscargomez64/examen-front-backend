// backend/rutas/auth.routes.js
const express = require('express');
const router = express.Router();
const { login, logout } = require('../controladores/auth.controller');

router.post('/login', login);
router.post('/logout', require('../middleware/auth.middleware'), logout);

module.exports = router;