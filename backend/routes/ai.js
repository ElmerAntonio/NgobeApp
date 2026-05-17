const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");
const rateLimit = require("express-rate-limit");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// Inicializar el cliente de Anthropic
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // Se asume cargado por dotenv en server.js
});

// Configuración del Rate Limit
// Límite de 20 peticiones por minuto por usuario
const aiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 20, // límite de 20 peticiones
  keyGenerator: (req) => {
    // Retorna el ID del usuario si está autenticado; si no (o por fallo), el IP
    return req.user && req.user.id ? req.user.id : req.ip;
  },
  message: { error: "Demasiadas peticiones. Por favor, espera un minuto." },
});

const SYSTEM_PROMPT = `Eres un asistente cultural especializado en el idioma Ngäbere.
Responde siempre en Ngäbere con su traducción al español.
Solo usa vocabulario del corpus validado. Si no conoces una
palabra, admítelo con honestidad y sugiere consultar a un maestro.
Identifica la región del usuario y prioriza el vocabulario de esa zona.`;

/**
 * POST /api/chat
 * Recibe { message, region, conversationHistory }
 * Interactúa con Anthropic para generar una respuesta en Ngäbere y Español.
 */
router.post("/chat", authenticate, aiRateLimiter, async (req, res) => {
  try {
    const { message, region, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: "El mensaje es requerido." });
    }

    // Convertimos el historial de conversacion al formato de Anthropic si existe
    const messages = [];
    if (conversationHistory && Array.isArray(conversationHistory)) {
      messages.push(...conversationHistory);
    }

    // Agregamos el mensaje actual del usuario (incluyendo la región para contexto si se envió)
    const contextMessage = region
      ? `[Región del usuario: ${region}] ${message}`
      : message;

    messages.push({
      role: "user",
      content: contextMessage,
    });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514", // Modelo específico requerido
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages,
    });

    // Extraer el texto de la respuesta
    const aiResponse = response.content[0].text;

    res.json({ response: aiResponse });
  } catch (error) {
    console.error("Error al llamar a la API de Anthropic:", error);
    res
      .status(500)
      .json({ error: "Error interno al procesar la solicitud con la IA." });
  }
});

module.exports = router;
