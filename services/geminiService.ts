import { GoogleGenAI } from "@google/genai";

export const generateMenuDescription = async (itemName: string, category: string): Promise<string> => {
  try {
    const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY || "";
    if (!apiKey) {
      return "A classic dish prepared with fresh ingredients.";
    }
    const ai = new GoogleGenAI(apiKey);
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a short, appetizing, 2-sentence description for a menu item named "${itemName}" in the category "${category}". 
      The description should be appealing to customers of a modern Nigerian restaurant. 
      Do not use markdown. Just plain text.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Fast response needed
      }
    });

    return response.text || "Delicious freshly prepared meal.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "A classic dish prepared with fresh ingredients.";
  }
};
