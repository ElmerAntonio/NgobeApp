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

/**
 * Middleware para validar que el usuario autenticado tiene uno de los roles permitidos
 * y su estado está aprobado.
 */
const requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('rol, estado')
        .eq('id', req.user.id)
        .single();

      if (error || !profile) {
        return res.status(403).json({ error: 'Perfil de usuario no encontrado o inválido' });
      }

      if (profile.estado !== 'aprobado') {
        return res.status(403).json({ error: 'Tu cuenta de usuario está pendiente de aprobación o bloqueada' });
      }

      if (!allowedRoles.includes(profile.rol)) {
        return res.status(403).json({ error: 'Permisos insuficientes para realizar esta operación' });
      }

      req.userProfile = profile;
      next();
    } catch (err) {
      console.error('Error al verificar rol:', err);
      res.status(500).json({ error: 'Error interno al verificar permisos de usuario' });
    }
  };
};

module.exports = { authenticate, requireRole };
