const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

/**
 * Helper to generate a Supabase client acting on behalf of the authenticated user
 */
const getUserSupabaseClient = (req) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  return createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseKey || 'placeholder',
    {
      global: {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    }
  );
};

/**
 * DELETE /
 * Implementa el Derecho al Olvido (Art. 16 de la Ley 81 de Protección de Datos Personales de Panamá).
 * - Elimina audios del bucket.
 * - Elimina contribuciones del usuario.
 * - Elimina perfil de usuario.
 * - Elimina al usuario de Auth.
 */
router.delete('/', authenticate, async (req, res) => {
  const userId = req.user.id;

  try {
    const supabase = getUserSupabaseClient(req);

    // 1. Obtener todas las contribuciones del usuario para extraer las URLs de los audios
    const { data: contributions, error: fetchError } = await supabase
      .from('contributions')
      .select('audio_lento_url, audio_rapido_url')
      .eq('user_id', userId);

    if (fetchError) {
      console.error('Error al obtener contribuciones:', fetchError);
      return res.status(500).json({
        error: 'Error al obtener datos del usuario para eliminación.',
      });
    }

    // 2. Extraer los paths de los audios que no sean nulos
    const audioPaths = [];
    if (contributions && contributions.length > 0) {
      contributions.forEach((contrib) => {
        if (contrib.audio_lento_url) audioPaths.push(contrib.audio_lento_url);
        if (contrib.audio_rapido_url) audioPaths.push(contrib.audio_rapido_url);
      });
    }

    // Eliminar los archivos de audio del bucket 'audios'
    if (audioPaths.length > 0) {
      const { error: storageError } = await supabase.storage.from('audios').remove(audioPaths);

      if (storageError) {
        console.error('Error al eliminar audios del bucket:', storageError);
        return res.status(500).json({ error: 'Error al eliminar archivos de audio del usuario.' });
      }
    }

    // 3. Eliminar los registros de la tabla 'contributions' del usuario
    const { error: deleteContribError } = await supabase
      .from('contributions')
      .delete()
      .eq('user_id', userId);

    if (deleteContribError) {
      console.error('Error al eliminar contribuciones:', deleteContribError);
      return res.status(500).json({ error: 'Error al eliminar registros de contribuciones.' });
    }

    // 4. Eliminar el registro del usuario de la tabla 'profiles'
    const { error: deleteProfileError } = await supabase.from('profiles').delete().eq('id', userId);

    if (deleteProfileError) {
      console.error('Error al eliminar perfil:', deleteProfileError);
      return res.status(500).json({ error: 'Error al eliminar el perfil del usuario.' });
    }

    // 5. Eliminar el usuario de Supabase Auth usando el cliente Admin (si está disponible)
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceRoleKey && serviceRoleKey !== 'placeholder') {
      const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
      const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(userId);

      if (deleteAuthError) {
        console.error('Error al eliminar usuario de Auth:', deleteAuthError);
        return res.status(500).json({ error: 'Error al eliminar la cuenta de autenticación.' });
      }
    } else {
      console.warn('Advertencia: SUPABASE_SERVICE_ROLE_KEY no está disponible. No se pudo eliminar la cuenta de auth del usuario.');
    }

    res.json({
      message: 'Cuenta y datos eliminados exitosamente conforme a la Ley 81.',
    });
  } catch (error) {
    console.error('Error en el proceso de eliminación de cuenta:', error);
    res.status(500).json({
      error: 'Error interno del servidor al procesar la solicitud de eliminación.',
    });
  }
});

/**
 * GET /pending-approvals
 * Retorna perfiles de usuarios con estado = 'pendiente'.
 * Accesible solo para superadmin.
 */
router.get('/pending-approvals', authenticate, requireRole(['superadmin']), async (req, res) => {
  try {
    const supabase = getUserSupabaseClient(req);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('estado', 'pendiente');

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Error al obtener perfiles pendientes:', error);
    res.status(500).json({ error: 'Error al obtener perfiles pendientes.' });
  }
});

/**
 * PUT /:id/approve-profile
 * Aprueba a un colaborador/maestro nuevo.
 * Accesible solo para superadmin.
 */
router.put('/:id/approve-profile', authenticate, requireRole(['superadmin']), async (req, res) => {
  const { id } = req.params;
  const { rol } = req.body;

  try {
    const supabase = getUserSupabaseClient(req);
    const updateData = { estado: 'aprobado' };
    if (rol) updateData.rol = rol;

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Usuario aprobado exitosamente.' });
  } catch (error) {
    console.error('Error al aprobar usuario:', error);
    res.status(500).json({ error: 'Error al aprobar perfil en la base de datos.' });
  }
});

/**
 * PUT /:id/block-profile
 * Bloquea a un usuario.
 * Accesible solo para superadmin.
 */
router.put('/:id/block-profile', authenticate, requireRole(['superadmin']), async (req, res) => {
  const { id } = req.params;

  try {
    const supabase = getUserSupabaseClient(req);
    const { error } = await supabase
      .from('profiles')
      .update({ estado: 'bloqueado' })
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Usuario bloqueado exitosamente.' });
  } catch (error) {
    console.error('Error al bloquear usuario:', error);
    res.status(500).json({ error: 'Error al bloquear perfil en la base de datos.' });
  }
});

module.exports = router;
