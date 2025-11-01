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

  // Generar token
  const token = randomUUID();
  sesiones.set(token, usuario.id);


res.json({
  mensaje: "Acceso permitido",
  token,
  usuario: {
    id: usuario.id,
    cuenta: usuario.cuenta,
    nombre: usuario.nombre,
    pagado: usuario.pagado || {}  // ← Aseguramos que exista
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
    return res.status(401).json({ error: "Token inválido" });
  }

  req.userId = userId;
  req.token = token;
  next();
};

const logout = (req, res) => {
  const token = req.token;
  sesiones.delete(token);
  res.json({ mensaje: "Sesión cerrada" });
};

module.exports = { login, verificarToken, logout, sesiones };