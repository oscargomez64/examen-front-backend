// backend/data/preguntas.js
const preguntas = [
  // PREGUNTAS DE JAVASCRIPT AVANZADO (certId: 1)
  {
    id: 1,
    certId: 1,
    texto: "¿Qué método se usa para copiar un array sin modificar el original?",
    opciones: ["slice()", "push()", "shift()", "pop()"],
    correcta: 0
  },
  {
    id: 2,
    certId: 1,
    texto: "¿Qué retorna Promise.all() si una promesa falla?",
    opciones: ["undefined", "Rechaza con el error", "Ignora el error", "Retorna null"],
    correcta: 1
  },
  {
    id: 3,
    certId: 1,
    texto: "¿Qué hace el operador spread (...) en un objeto?",
    opciones: ["Copia propiedades", "Borra propiedades", "Congela el objeto", "Clona funciones"],
    correcta: 0
  },
  {
    id: 4,
    certId: 1,
    texto: "¿Cuál es el scope de una variable con 'let'?",
    opciones: ["Global", "Bloque", "Función", "Ninguno"],
    correcta: 1
  },
  {
    id: 5,
    certId: 1,
    texto: "¿Qué método convierte un objeto en array de pares [clave, valor]?",
    opciones: ["Object.keys()", "Object.values()", "Object.entries()", "Object.assign()"],
    correcta: 2
  },
  {
    id: 6,
    certId: 1,
    texto: "¿Qué es un closure?",
    opciones: ["Función anónima", "Función que recuerda su scope", "Método de clase", "Evento"],
    correcta: 1
  },
  {
    id: 7,
    certId: 1,
    texto: "¿Qué hace 'async' antes de una función?",
    opciones: ["La hace síncrona", "Permite usar await", "La ejecuta después", "La ignora"],
    correcta: 1
  },
  {
    id: 8,
    certId: 1,
    texto: "¿Qué retorna 'map()'?",
    opciones: ["Nuevo array", "Mismo array modificado", "Objeto", "String"],
    correcta: 0
  },
  {
    id: 9,
    certId: 1,
    texto: "¿Qué es el hoisting?",
    opciones: ["Elevación de variables y funciones", "Error de sintaxis", "Copia de objetos", "Bucle infinito"],
    correcta: 0
  },
  {
    id: 10,
    certId: 1,
    texto: "¿Qué hace 'this' en una arrow function?",
    opciones: ["Se refiere al objeto global", "Hereda el 'this' del scope padre", "Es undefined", "Es el evento"],
    correcta: 1
  },
  {
    id: 11,
    certId: 1,
    texto: "¿Qué método detiene la propagación de un evento?",
    opciones: ["preventDefault()", "stopPropagation()", "stopImmediatePropagation()", "return false"],
    correcta: 1
  },
  {
    id: 12,
    certId: 1,
    texto: "¿Qué es un módulo en ES6?",
    opciones: ["Función reutilizable", "Archivo con export/import", "Clase", "Evento"],
    correcta: 1
  },
  {
    id: 13,
    certId: 1,
    texto: "¿Qué hace 'JSON.parse()'?",
    opciones: ["Convierte string a objeto", "Convierte objeto a string", "Valida JSON", "Clona objeto"],
    correcta: 0
  },
  {
    id: 14,
    certId: 1,
    texto: "¿Qué es el event loop?",
    opciones: ["Bucle infinito", "Mecanismo que maneja callbacks", "Función recursiva", "Método de array"],
    correcta: 1
  },
  {
    id: 15,
    certId: 1,
    texto: "¿Qué retorna 'filter()'?",
    opciones: ["Nuevo array con elementos que pasan la condición", "Primer elemento", "Último elemento", "Índice"],
    correcta: 0
  },
  {
    id: 16,
    certId: 1,
    texto: "¿Qué hace 'bind()'?",
    opciones: ["Crea una nueva función con 'this' fijo", "Ejecuta inmediatamente", "Copia array", "Elimina evento"],
    correcta: 0
  }
];

module.exports = preguntas;