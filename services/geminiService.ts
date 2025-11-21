import { GoogleGenAI, Type } from "@google/genai";
import { StationInsight } from "../types.ts";

// NOTE: In a real production app, never expose API keys in client-side code directly without a proxy.
// However, for this coding task structure, we use process.env.API_KEY as instructed.
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const getStationInsights = async (stationName: string): Promise<StationInsight | null> => {
  if (!apiKey) {
    console.warn("Gemini API Key is missing.");
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Provide travel insights for the Swiss train station "${stationName}" and its immediate surrounding area. Focus on functionality for a traveler.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A 1-sentence summary of the station's importance or location."
            },
            pointsOfInterest: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 3 key places or landmarks reachable within 5 minutes walk."
            },
            travelTips: {
              type: Type.STRING,
              description: "A useful tip for commuters or tourists at this specific station."
            }
          },
          required: ["summary", "pointsOfInterest", "travelTips"],
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as StationInsight;

  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return {
        summary: "Could not load AI insights at this time.",
        pointsOfInterest: [],
        travelTips: "Please check local station map."
    };
  }
};