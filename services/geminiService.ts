
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuizQuestions = async (topic: string, count: number = 5) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    // Using gemini-3-pro-preview for complex reasoning and educational content generation tasks
    model: 'gemini-3-pro-preview',
    contents: `Generate ${count} high-quality quiz questions about "${topic}". Include a mix of single-choice and multiple-choice questions.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: 'The question text' },
            type: { type: Type.STRING, enum: ['single', 'multiple'], description: 'Question type' },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Exactly 4 options'
            },
            correctAnswers: {
              type: Type.ARRAY,
              items: { type: Type.INTEGER },
              description: 'Indices (0-3) of correct answers'
            }
          },
          required: ['text', 'type', 'options', 'correctAnswers']
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return [];
  }
};
