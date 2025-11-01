// backend/data/certificaciones.js
const certificaciones = [
  {
    id: 1,
    nombre: "JavaScript Avanzado",
    descripcion: "Domina ES6+, async/await, closures, prototipos, módulos y patrones avanzados. Ideal para desarrolladores frontend.",
    puntuacionMin: 70,
    tiempoMinutos: 45,
    costo: 599,
    activa: true,
    fechaDisponible: null
  },
  {
    id: 2,
    nombre: "React.js Profesional",
    descripcion: "Aprende Hooks, Context, Redux, performance, testing y despliegue de aplicaciones SPA de alto nivel.",
    puntuacionMin: 75,
    tiempoMinutos: 60,
    costo: 799,
    activa: false,
    fechaDisponible: "15 de diciembre de 2025"
  },
  {
    id: 3,
    nombre: "Node.js y Express",
    descripcion: "Construye APIs RESTful, autenticación, middlewares, validación y despliegue en producción.",
    puntuacionMin: 70,
    tiempoMinutos: 50,
    costo: 699,
    activa: false,
    fechaDisponible: "10 de enero de 2026"
  },
  {
    id: 4,
    nombre: "Python para Data Science",
    descripcion: "Pandas, NumPy, Matplotlib, Scikit-learn y despliegue de modelos ML en producción.",
    puntuacionMin: 80,
    tiempoMinutos: 70,
    costo: 899,
    activa: false,
    fechaDisponible: "1 de febrero de 2026"
  }
];

module.exports = certificaciones;