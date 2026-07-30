/**
 * Extract text from PDF buffers for Notes.
 * Primary: pdf-parse text layer. Optional: Gemini multimodal OCR for scans.
 */
import { getGeminiLiteApiKey } from './geminiLite.js';

let pdfParse = null;
async function loadPdfParse() {
  if (pdfParse) return pdfParse;
  try {
    // Avoid pdf-parse/index.js debug self-test that requires ./test/data/*
    const mod = await import('pdf-parse/lib/pdf-parse.js');
    pdfParse = mod.default || mod;
    return pdfParse;
  } catch {
    try {
      const mod = await import('pdf-parse');
      pdfParse = mod.default || mod;
      return pdfParse;
    } catch {
      return null;
    }
  }
}

export async function extractPdfText(buffer) {
  const parse = await loadPdfParse();
  if (!parse) {
    return { text: '', method: 'none', error: 'pdf-parse not installed' };
  }
  try {
    const result = await parse(buffer);
    const text = String(result?.text || '').trim();
    return { text, method: 'pdf-parse', pages: result?.numpages || null };
  } catch (err) {
    return { text: '', method: 'pdf-parse', error: err.message };
  }
}

async function geminiPdfOcr(buffer, filename) {
  const apiKey = getGeminiLiteApiKey();
  if (!apiKey || !buffer?.length) {
    return { text: '', method: 'gemini', error: 'unavailable' };
  }
  try {
    const { GoogleGenAI } = await import('@google/genai');
    const genai = new GoogleGenAI({ apiKey });
    const model = process.env.GEMINI_LITE_MODEL || 'gemini-2.5-flash-lite';
    const b64 = Buffer.from(buffer).toString('base64');
    const result = await genai.models.generateContent({
      model,
      contents: [{
        role: 'user',
        parts: [
          {
            text: `Extract all readable text from this PDF (${filename || 'document.pdf'}). Return plain text only.`,
          },
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: b64,
            },
          },
        ],
      }],
      config: { maxOutputTokens: 8192, temperature: 0.1 },
    });
    const text = String(result?.text || '').trim();
    return { text, method: 'gemini' };
  } catch (err) {
    return { text: '', method: 'gemini', error: err.message };
  }
}

/**
 * Resolve OCR/text for a note PDF import.
 * Prefer client text → pdf-parse → Gemini OCR.
 */
export async function resolveNotePdfText({ buffer, filename, clientText }) {
  const trimmed = clientText != null ? String(clientText).trim() : '';
  if (trimmed.length > 20) {
    return { text: trimmed.slice(0, 100000), method: 'client' };
  }

  if (buffer?.length) {
    const extracted = await extractPdfText(buffer);
    if (extracted.text && extracted.text.length > 20) {
      return { text: extracted.text.slice(0, 100000), method: extracted.method };
    }

    const gem = await geminiPdfOcr(buffer, filename);
    if (gem.text && gem.text.length > 10) {
      return { text: gem.text.slice(0, 100000), method: 'gemini' };
    }
  }

  return {
    text: trimmed.slice(0, 100000),
    method: 'pending',
    error: 'No extractable text — try a text PDF, paste body, or reconnect OCR keys',
  };
}
