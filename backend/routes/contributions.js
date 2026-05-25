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
 * GET /api/contributions/pending
 * Retorna las aportaciones en estado pendiente de aprobación.
 * Accesible solo para maestros y administradores aprobados.
 */
router.get('/pending', authenticate, requireRole(['maestro', 'superadmin']), async (req, res) => {
  try {
    const supabase = getUserSupabaseClient(req);
    const { data, error } = await supabase
      .from('contributions')
      .select('id, category, ngobe_text, spanish_text, region, audio_lento_url, audio_rapido_url, created_at, user_id')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Error al obtener aportes pendientes:', error);
    res.status(500).json({ error: 'Error al obtener aportes pendientes de la base de datos' });
  }
});

/**
 * PUT /api/contributions/:id/approve
 * Aprueba una aportación, registrando su transcripción fonética y metadatos lingüísticos.
 * Accesible solo para maestros y administradores aprobados.
 */
router.put('/:id/approve', authenticate, requireRole(['maestro', 'superadmin']), async (req, res) => {
  const { id } = req.params;
  const { transcripcion_fonetica, metadatos_linguisticos } = req.body;

  if (!transcripcion_fonetica) {
    return res.status(400).json({ error: 'La transcripción fonética es requerida para aprobar.' });
  }

  try {
    const supabase = getUserSupabaseClient(req);

    // 1. Obtener la contribución para extraer la región y detalles existentes
    const { data: contrib, error: fetchError } = await supabase
      .from('contributions')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !contrib) {
      return res.status(404).json({ error: 'Aportación no encontrada.' });
    }

    // 2. Construir los metadatos lingüísticos detallados requeridos para el aprendizaje de la IA
    const detailedMetadata = {
      duracion_segundos: metadatos_linguisticos?.duracion_segundos || null,
      formato: metadatos_linguisticos?.formato || 'm4a',
      tipo_audio: metadatos_linguisticos?.tipo_audio || 'lento',
      variante_dialectal_reportada: contrib.region || 'General',
      categoria_gramatical: metadatos_linguisticos?.categoria_gramatical || 'otro',
      validador_id: req.user.id,
      fecha_validacion: new Date().toISOString(),
      detalles_acusticos: {
        calidad_estimada: metadatos_linguisticos?.detalles_acusticos?.calidad_estimada || 'buena',
        ruido_fondo: metadatos_linguisticos?.detalles_acusticos?.ruido_fondo || 'no'
      }
    };

    // 3. Actualizar la contribución en la base de datos
    const { error: updateError } = await supabase
      .from('contributions')
      .update({
        status: 'approved',
        transcripcion_fonetica,
        metadatos_linguisticos: detailedMetadata
      })
      .eq('id', id);

    if (updateError) throw updateError;

    res.json({ message: 'Aportación aprobada exitosamente y catalogada para la IA.' });
  } catch (error) {
    console.error('Error al aprobar aportación:', error);
    res.status(500).json({ error: 'Error al procesar la aprobación en la base de datos.' });
  }
});

/**
 * PUT /api/contributions/:id/reject
 * Rechaza una aportación.
 * Accesible solo para maestros y administradores aprobados.
 */
router.put('/:id/reject', authenticate, requireRole(['maestro', 'superadmin']), async (req, res) => {
  const { id } = req.params;

  try {
    const supabase = getUserSupabaseClient(req);
    const { error } = await supabase
      .from('contributions')
      .update({ status: 'rejected' })
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Aportación rechazada y marcada correctamente.' });
  } catch (error) {
    console.error('Error al rechazar aportación:', error);
    res.status(500).json({ error: 'Error al procesar el rechazo en la base de datos.' });
  }
});

/**
 * GET /api/contributions/my-contributions
 * Retorna las aportaciones enviadas por el usuario actual.
 * Accesible para cualquier usuario autenticado.
 */
router.get('/my-contributions', authenticate, async (req, res) => {
  try {
    const supabase = getUserSupabaseClient(req);
    const { data, error } = await supabase
      .from('contributions')
      .select('id, category, ngobe_text, spanish_text, region, status, created_at, transcripcion_fonetica')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Error al obtener aportaciones de usuario:', error);
    res.status(500).json({ error: 'Error al obtener tus aportaciones de la base de datos.' });
  }
});

module.exports = router;
