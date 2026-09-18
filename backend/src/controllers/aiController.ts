import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

export const handleAiChat = async (req: Request, res: Response) => {
  try {
    const { message, image, mimeType } = req.body;
    
    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      // Mock fallback if no key
      return res.json({
        response: `[Mock AI - Provide GEMINI_API_KEY in .env]: I received your message: "${message}". ${image ? 'I also see you attached an image!' : ''} In a real environment, I would provide a detailed sustainability analysis!`
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const parts: any[] = [{ text: `You are the Eco-AI Assistant for ReCircle, a hyperlocal circular marketplace. Help the user estimate item value, check recycling codes, or give repair advice based on the text and image provided. Be concise and encouraging. User: ${message}` }];
    
    if (image && mimeType) {
      parts.push({
        inlineData: {
          data: image,
          mimeType: mimeType
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: parts
        }
      ],
      config: {
        maxOutputTokens: 300,
        temperature: 0.7,
      }
    });

    res.json({ response: response.text });
  } catch (error: any) {
    res.status(500).json({ error: 'AI processing failed: ' + error.message });
  }
};
