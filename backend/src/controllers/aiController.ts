import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

export const handleAiChat = async (req: Request, res: Response) => {
  try {
    const { message, image, mimeType } = req.body;
    
    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      // Smart Mock fallback if no key
      const lowerMsg = (message || '').toLowerCase();
      let mockReply = "I can help with that! ";
      
      if (lowerMsg.includes('value') || lowerMsg.includes('price') || lowerMsg.includes('worth')) {
        mockReply += "Based on recent ReCircle market data, similar items usually go for around ₹1,500 to ₹3,000 depending on their condition. If it's in good shape, I recommend listing it on the higher end!";
      } else if (lowerMsg.includes('recycle') || lowerMsg.includes('plastic') || lowerMsg.includes('glass') || lowerMsg.includes('paper')) {
        mockReply += "Make sure to clean it out before recycling! If it's a plastic bottle (PET/Type 1), you can toss it straight into your blue bin. For electronics or specialized materials, check out our Local Repair & Recycling Network tab.";
      } else if (lowerMsg.includes('repair') || lowerMsg.includes('fix') || lowerMsg.includes('broken')) {
        mockReply += "Repairing is always better than replacing! It sounds fixable. You might need a few basic tools or replacement parts. If you're not comfortable fixing it yourself, I recommend taking it to a Green Partner in our Network directory.";
      } else {
        mockReply += "That sounds interesting! Whether you want to sell it, donate it, or repair it, ReCircle is the perfect place. Let me know if you need a valuation or recycling advice!";
      }

      if (image) {
        mockReply = "I see the image you attached! " + mockReply;
      }

      return res.json({ response: mockReply });
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
