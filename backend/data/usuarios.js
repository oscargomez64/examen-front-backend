// backend/data/usuarios.js
const usuarios = [
  {
    id: 1,
    cuenta: "juan123",
    password: "12345",
    nombre: "Juan Pérez Gómez",
    pagado: {}, // { certId: true }
    intento: null // { preguntas: [], respuestas: [], tiempoRestante: 45 }
  },
  {
    id: 2,
    cuenta: "ana456",
    password: "12345",
    nombre: "Ana López Ruiz",
    pagado: {},
    intento: null
  },
  {
    id: 3,
    cuenta: "carlos789",
    password: "12345",
    nombre: "Carlos Mendoza Díaz",
    pagado: {},
    intento: null
  },
  {
    id: 4,
    cuenta: "laura101",
    password: "12345",
    nombre: "Laura Hernández Soto",
    pagado: {},
    intento: null
  },
  {
    id: 5,
    cuenta: "miguel202",
    password: "12345",
    nombre: "Miguel Torres Vega",
    pagado: {},
    intento: null
  },
  {
    id: 6,
    cuenta: "sofia303",
    password: "12345",
    nombre: "Sofía Ramírez Cruz",
    pagado: {},
    intento: null
  },
   {
    id: 7,
    cuenta: "aza",
    password: "aza",
    nombre: "Azael Fajardo Espino",
    pagado: {},
    intento: null
  }
];

module.exports = usuarios;