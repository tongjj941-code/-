
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes an image of a broken item and suggests a fault description.
 */
export const analyzeFaultImage = async (base64Data: string): Promise<string> => {
  try {
    // Remove data URL prefix if present for the API call logic if needed, 
    // but the inlineData helper usually handles standard base64 strings.
    // We expect the raw base64 string or a data URL.
    const base64 = base64Data.split(',')[1] || base64Data;

    // Use gemini-3-flash-preview for vision/text tasks as per guidelines.
    // Fix: Updated model name to gemini-3-flash-preview.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64
            }
          },
          {
            text: "你是一位专业的酒店维修专家。请用中文一句话简要描述照片中可见的损坏或问题。专注于技术细节（例如，‘屏幕破裂’，‘电线磨损’）。仅返回中文描述。"
          }
        ]
      }
    });

    // response.text is a getter property, not a method.
    return response.text || "无法分析图片。";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "AI 分析失败，请手动输入描述。";
  }
};
