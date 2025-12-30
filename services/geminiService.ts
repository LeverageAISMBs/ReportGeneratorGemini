import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { WeeklyReportStructured } from "../types";

const reportSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    period: {
      type: Type.STRING,
      description: "The date range of the analysis (e.g., Oct 10 - Oct 17)",
    },
    intellectualFocus: {
      type: Type.STRING,
      description: "Analysis of the core issue and achievements. Supports Markdown formatting.",
    },
    keyInsights: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 1-3 key insights or 'aha' moments.",
    },
    challenges: {
      type: Type.STRING,
      description: "Analysis of recurring problems and ignored clues. Supports Markdown formatting.",
    },
    nextWeekNavigation: {
      type: Type.STRING,
      description: "Encouragement and inspiring questions for next week. Supports Markdown formatting.",
    },
  },
  required: ["period", "intellectualFocus", "keyInsights", "challenges", "nextWeekNavigation"],
};

export const generateWeeklyInsight = async (conversationLog: string): Promise<WeeklyReportStructured> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: conversationLog,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: reportSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated from Gemini.");
    }

    try {
      const data = JSON.parse(text) as WeeklyReportStructured;
      return data;
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", text);
      throw new Error("Failed to process the report data structure.");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};