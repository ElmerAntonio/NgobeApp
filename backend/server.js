// Cargar variables de entorno antes de importar cualquier otra cosa
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Importar rutas
const aiRoutes = require('./routes/ai');
const userRoutes = require('./routes/users');

const app = express();

// Parsear orígenes permitidos desde el .env
// TODO: Reemplazar estos orígenes de desarrollo con el dominio de producción antes del lanzamiento
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:8081', 'http://localhost:19006'];

// Configuración de CORS
app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir peticiones sin origin (como aplicaciones móviles o Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('No permitido por CORS'));
      }
    },
  })
);

// Middleware para parsear JSON
app.use(express.json());

// Montar rutas
app.use('/api', aiRoutes);
app.use('/api/users/account', userRoutes);

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor de backend escuchando en el puerto ${PORT}`);
});
