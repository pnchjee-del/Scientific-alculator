import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Google GenAI client with required User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for checking API key
function checkApiKey(res: express.Response): boolean {
  if (!process.env.GEMINI_API_KEY) {
    res.status(500).json({
      error: 'GEMINI_API_KEY is not configured in the server environment.',
    });
    return false;
  }
  return true;
}

/**
 * Multi-turn Gemini Chatbot Endpoint
 * Supports models:
 * - gemini-3.1-pro-preview (Complex mathematical reasoning & proofs)
 * - gemini-3.5-flash (General scientific problem solving)
 * - gemini-3.1-flash-lite (Fast calculation verification)
 */
app.post('/api/chat', async (req, res) => {
  if (!checkApiKey(res)) return;

  try {
    const { messages, model = 'gemini-3.5-flash', role = 'mathematician' } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const validModels = [
      'gemini-3.1-pro-preview',
      'gemini-3.5-flash',
      'gemini-3.1-flash-lite',
    ];
    const selectedModel = validModels.includes(model) ? model : 'gemini-3.5-flash';

    let systemInstruction =
      'You are AetherCalc AI Tutor — an expert computational mathematician, physicist, and STEM professor. ' +
      'You specialize in scientific computing, complex numbers (z = a + bi), polynomial equation solving, ' +
      'dimensional analysis, unit conversions, and calculus. ' +
      'Always format mathematical formulas cleanly using standard mathematical notation or LaTeX where helpful. ' +
      'Explain derivations step-by-step with rigorous logic, provide intuition, and double-check numerical correctness. ' +
      'Be clear, helpful, encouraging, and precise.';

    if (role === 'proof_master') {
      systemInstruction =
        'You are a rigorous mathematical theorist and formal proof assistant. ' +
        'Deliver exact mathematical proofs, state theorems, boundary conditions, and verify algebraic steps strictly.';
    } else if (role === 'quick_verifier') {
      systemInstruction =
        'You are a high-speed scientific verification engine. ' +
        'Give concise, direct confirmations, error diagnosis, and numerical validation without unnecessary preamble.';
    } else if (role === 'physics_engineer') {
      systemInstruction =
        'You are an applied physics and engineering computational consultant. ' +
        'Focus on physical interpretation, units and dimensional sanity, real-world scientific applications, and constants.';
    }

    // Format messages for @google/genai SDK
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || 'No response generated.';
    res.json({ reply: replyText, model: selectedModel });
  } catch (error: any) {
    console.error('Chat error:', error);
    const rawMsg = error.message || '';
    const isQuotaError =
      error.status === 429 ||
      rawMsg.includes('429') ||
      rawMsg.includes('RESOURCE_EXHAUSTED') ||
      rawMsg.includes('quota') ||
      rawMsg.includes('Quota exceeded');

    const message = isQuotaError
      ? 'Quota limit reached for this model. gemini-3.1-pro-preview requires a paid API key or has reached rate limits. Try switching to gemini-3.5-flash or gemini-3.1-flash-lite, or select a paid API key in AI Studio.'
      : (rawMsg || 'Failed to generate chat response from Gemini API.');

    res.status(isQuotaError ? 429 : 500).json({
      error: message,
      isQuotaError,
    });
  }
});

/**
 * Text-to-Speech Endpoint
 * Uses model: gemini-3.8-flash-tts
 * Allows users to listen to mathematical step-by-step derivations and audio explanations
 */
app.post('/api/tts', async (req, res) => {
  if (!checkApiKey(res)) return;

  try {
    const { text, voice = 'Kore', style } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text string is required for speech synthesis.' });
    }

    // Sanitize text if too long for TTS clip (first 1000 characters)
    const sanitizedText = text.slice(0, 1000).trim();

    const allowedVoices = ['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'];
    const chosenVoice = allowedVoices.includes(voice) ? voice : 'Kore';

    const speechStyle =
      style || 'Clear, articulate, natural-paced university mathematics and physics lecturer';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: sanitizedText,
              speechMetadata: {
                style: speechStyle,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: chosenVoice },
          },
        },
      },
    });

    // Unary default is a complete WAV file (audio/wav, RIFF header, 24kHz mono 16-bit)
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      return res.status(500).json({ error: 'No audio data was returned by the TTS model.' });
    }

    res.json({
      audioUrl: `data:audio/wav;base64,${base64Audio}`,
      voice: chosenVoice,
    });
  } catch (error: any) {
    console.error('TTS error:', error);
    res.status(500).json({
      error: error.message || 'Failed to synthesize audio using gemini-3.8-flash-tts.',
    });
  }
});

/**
 * High-Quality Image Generation Endpoint
 * Uses model: gemini-3-pro-image-preview
 * Supports resolution affordance: 1K, 2K, 4K
 * Generates scientific, geometric, 3D math surface, and concept visualizations
 */
app.post('/api/generate-image', async (req, res) => {
  if (!checkApiKey(res)) return;

  try {
    const {
      prompt,
      imageSize = '1K',
      aspectRatio = '1:1',
    } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt string is required.' });
    }

    // Validate imageSize affordance: 1K, 2K, 4K
    const validSizes = ['1K', '2K', '4K'];
    const selectedSize = validSizes.includes(imageSize) ? imageSize : '1K';

    const validAspectRatios = ['1:1', '3:4', '4:3', '9:16', '16:9'];
    const selectedAspectRatio = validAspectRatios.includes(aspectRatio)
      ? aspectRatio
      : '1:1';

    const enhancedPrompt =
      `${prompt}. Scientific visualization, clean architectural and mathematical clarity, high fidelity, precision diagram or 3D mathematical render.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: enhancedPrompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: selectedAspectRatio,
          imageSize: selectedSize,
        },
      },
    });

    let imageUrl: string | null = null;
    let descriptionText = '';

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        const mime = part.inlineData.mimeType || 'image/png';
        imageUrl = `data:${mime};base64,${part.inlineData.data}`;
      } else if (part.text) {
        descriptionText += part.text;
      }
    }

    if (!imageUrl) {
      return res.status(500).json({
        error: 'The image generation model did not return image data.',
        text: descriptionText,
      });
    }

    res.json({
      imageUrl,
      description: descriptionText,
      size: selectedSize,
      aspectRatio: selectedAspectRatio,
    });
  } catch (error: any) {
    console.error('Image generation error:', error);
    const rawMsg = error.message || '';
    const isQuotaError =
      error.status === 429 ||
      rawMsg.includes('429') ||
      rawMsg.includes('RESOURCE_EXHAUSTED') ||
      rawMsg.includes('quota') ||
      rawMsg.includes('Quota exceeded');

    const message = isQuotaError
      ? 'Quota limit reached: gemini-3-pro-image-preview requires a paid API key with billing enabled. Please select your paid API key in AI Studio to generate 1K, 2K, and 4K images.'
      : (rawMsg || 'Failed to generate image with gemini-3-pro-image-preview.');

    res.status(isQuotaError ? 429 : 500).json({
      error: message,
      isQuotaError,
    });
  }
});

// Setup Vite dev middleware or static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AetherCalc] Full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
