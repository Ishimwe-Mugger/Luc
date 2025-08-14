import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import OpenAI from 'openai';

const app = express();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static('public'));
app.use('/api/', rateLimit({ windowMs: 60_000, max: 30 }));

app.post('/api/press', async (req, res) => {
  try {
    const { topic, keyPoints } = req.body || {};
    const prompt = `Write a polished press release about "${topic}". 
Key points:
${(keyPoints || []).map(p => `- ${p}`).join('\n')}

Format with:
- HEADLINE (title case)
- DATELINE (CITY, Country — Month Day, Year)
- BODY (3–6 paragraphs; lead, details, quotes, CTA)
- BOILERPLATE (80–120 words)
- MEDIA CONTACT (name, email, phone)
Tone: professional AP style; include one realistic executive quote.`;

    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
      temperature: 0.7,
      max_output_tokens: 800
    });

    res.json({ ok: true, content: response.output_text ?? 'No content returned.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err?.message || 'Unknown error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
