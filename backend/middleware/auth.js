const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Inicializamos el cliente de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    'Advertencia: Faltan variables de entorno para Supabase (SUPABASE_URL, SUPABASE_ANON_KEY)'
  );
}

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder'
);

/**
 * Middleware para validar el token JWT de Supabase
 * Extrae el token de la cabecera Authorization y utiliza supabase.auth.getUser
 * para validar que el token pertenece a un usuario válido.
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Falta el token de autorización o el formato es incorrecto',
      });
    }

    const token = authHeader.split(' ')[1];

    // Validamos el token utilizando Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }

    // Adjuntamos el usuario al request para usarlo en controladores o middlewares posteriores (ej. rate limit)
    req.user = user;

    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    res.status(500).json({ error: 'Error interno del servidor al validar autenticación' });
  }
};

module.exports = { authenticate };
