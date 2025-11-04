// backend/controladores/auth.controller.js
const { randomUUID } = require('crypto');
const usuarios = require('../data/usuarios');

// Almacena tokens activos: { token: userId }
const sesiones = new Map();

const login = (req, res) => {
  const { cuenta, password } = req.body;

  if (!cuenta || !password) {
    return res.status(400).json({ error: "Faltan credenciales" });
  }

  const usuario = usuarios.find(u => u.cuenta === cuenta && u.password === password);

  if (!usuario) {
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }

  // GENERAR TOKEN
  const token = randomUUID();

  // GUARDAR EN MAPA DE SESIONES
  sesiones.set(token, usuario.id);

  console.log(`Inició sesión ${usuario.cuenta} a las ${Date().toLocaleString('es-MX')}`);

  res.json({
    mensaje: "Acceso permitido",
    token, // ← MISMO TOKEN
    usuario: {
      id: usuario.id,
      cuenta: usuario.cuenta,
      nombre: usuario.nombre,
      pagado: usuario.pagado || {}
    }
  });
};

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Token requerido" });
  }

  const token = authHeader.split(' ')[1];
  const userId = sesiones.get(token);

  if (!userId) {
    return res.status(401).json({ error: "Token invalido" });
  }

  // Adjuntar datos útiles
  req.userId = userId;
  req.token = token;

  // Opcional: adjuntar usuario completo
  const usuario = usuarios.find(u => u.id === userId);
  req.usuario = usuario;

  next();
};

const logout = (req, res) => {
  const token = req.token;
  sesiones.delete(token);
  res.json({ mensaje: "Sesión cerrada" });
};

module.exports = { login, verificarToken, logout, sesiones };