const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Inicializar el cliente de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder'
);

// Inicializar el cliente de Anthropic
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // Se asume cargado por dotenv en server.js
});

// Configuración de palabras clave para detección de región/dialecto
const REGIONAL_KEYWORDS = {
  'Ñö Kribo': ['ñö', 'kribo', 'chube', 'soloy', 'kríbora'],
  'Nedrini': ['nedrini', 'krí', 'nagua', 'töte', 'krun'],
  'Kädriri': ['kädriri', 'jü', 'chi']
};

/**
 * Detecta la región a partir de heurísticas en el texto del usuario.
 */
function detectRegionFromText(text) {
  if (!text) return null;
  const normalized = text.toLowerCase();
  for (const [region, keywords] of Object.entries(REGIONAL_KEYWORDS)) {
    for (const keyword of keywords) {
      if (normalized.includes(keyword)) {
        return region;
      }
    }
  }
  return null;
}

// Configuración del Rate Limit
const aiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 20, // límite de 20 peticiones
  keyGenerator: (req) => {
    return req.user && req.user.id ? req.user.id : req.ip;
  },
  message: { error: 'Demasiadas peticiones. Por favor, espera un minuto.' },
});

const SYSTEM_PROMPT = `Eres un asistente cultural y lingüístico especializado en el idioma Ngäbere.
Tus respuestas deben ser redactadas siempre en idioma Ngäbere con su traducción correspondiente al español.
Debes basarte estrictamente en el corpus validado por los maestros de la comarca. Si una palabra o frase no está en el corpus, admítelo con respeto y sugiere consultar a un maestro.
Es indispensable que identifiques la región o dialecto del usuario y priorices el vocabulario característico de esa zona.`;

/**
 * POST /api/chat
 * Recibe { message, region, conversationHistory }
 * Interactúa con Anthropic para generar una respuesta en Ngäbere y Español.
 */
router.post('/chat', authenticate, aiRateLimiter, async (req, res) => {
  try {
    const { message, region, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'El mensaje es requerido.' });
    }

    // 1. Detección de Región
    let detectedRegion = region;

    // Si no se provee la región en el request, consultar la comunidad en el perfil del usuario
    if (!detectedRegion && req.user) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('comunidad')
          .eq('id', req.user.id)
          .single();

        if (profile && profile.comunidad) {
          detectedRegion = profile.comunidad;
        }
      } catch (err) {
        console.warn('Advertencia al obtener comunidad del perfil:', err.message);
      }
    }

    // Si sigue vacía, intentar deducir a partir de heurísticas del mensaje
    if (!detectedRegion) {
      detectedRegion = detectRegionFromText(message) || 'General';
    }

    // 2. Cargar el corpus de aportes aprobados para inyectar en el contexto
    let corpusContext = '';
    try {
      const { data: corpusData } = await supabase
        .from('contributions')
        .select('ngobe_text, spanish_text, category, region, transcripcion_fonetica')
        .eq('status', 'approved')
        .limit(150); // Traemos hasta 150 aportes validados para no exceder la ventana de contexto

      if (corpusData && corpusData.length > 0) {
        corpusContext = corpusData
          .map((c) => `- Ngäbere: "${c.ngobe_text}" | Español: "${c.spanish_text}" | Categoría: "${c.category}" | Región: "${c.region}" | Fonética: "${c.transcripcion_fonetica || 'No disponible'}"`)
          .join('\n');
      }
    } catch (err) {
      console.error('Error al consultar el corpus de aportes:', err);
    }

    // 3. Formatear Prompt del Sistema Dinámico
    const dynamicSystemPrompt = `${SYSTEM_PROMPT}

Región prioritario para el usuario: ${detectedRegion}

Corpus de Vocabulario y Expresiones Validadas por Maestros:
${corpusContext || 'Aún no hay vocabulario validado registrado en la base de datos.'}`;

    // 4. Formatear el historial de mensajes
    const messages = [];
    if (conversationHistory && Array.isArray(conversationHistory)) {
      messages.push(...conversationHistory);
    }

    // Agregar mensaje actual
    const contextMessage = detectedRegion ? `[Región/Contexto: ${detectedRegion}] ${message}` : message;
    messages.push({
      role: 'user',
      content: contextMessage,
    });

    // 5. Llamar a la API de Anthropic con Claude
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022', // Modelo estable actualizado
      max_tokens: 1024,
      system: dynamicSystemPrompt,
      messages: messages,
    });

    const aiResponse = response.content[0].text;
    res.json({ response: aiResponse, detectedRegion });
  } catch (error) {
    console.error('Error en Chat IA:', error);
    res.status(500).json({ error: 'Error al comunicarse con el asistente de IA cultural.' });
  }
});

module.exports = router;
