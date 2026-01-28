
import { GoogleGenAI, Type } from "@google/genai";
import { AuditResult } from "../types";

const extractJson = (text: string): any => {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    return JSON.parse(text);
  } catch (e) {
    console.error("JSON Parse Error", e);
    throw new Error("Data formatting error. Please try again.");
  }
};

export const performCompetitorAudit = async (domain: string): Promise<AuditResult> => {
  if (!process.env.API_KEY) throw new Error("API Key missing.");

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Dense instructions to minimize input token cost
  const systemInstruction = `Market Intel API. Return JSON for domain audit. 
  Rules: Data-driven SWOT, detectable SaaS tech stack, aggressive "Why us" battlecards. 
  Output MUST follow schema strictly.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Audit: ${domain}`,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        // Flash models are fastest with 0 thinking budget for structured tasks
        thinkingConfig: { thinkingBudget: 0 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            companyName: { type: Type.STRING },
            industry: { type: Type.STRING },
            summary: { type: Type.STRING },
            techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
            swot: {
              type: Type.OBJECT,
              properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                threats: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['strengths', 'weaknesses', 'opportunities', 'threats']
            },
            battlecard: {
              type: Type.OBJECT,
              properties: {
                howToWin: { type: Type.ARRAY, items: { type: Type.STRING } },
                commonObjections: { type: Type.ARRAY, items: { type: Type.STRING } },
                discoveryQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['howToWin', 'commonObjections', 'discoveryQuestions']
            },
            featureGap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  feature: { type: Type.STRING },
                  status: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            },
            sentiment: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  gripes: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            }
          }
        }
      }
    });

    const parsedData = extractJson(response.text || "{}");
    const sourceUrls = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map(chunk => chunk.web?.uri)
      .filter((uri): uri is string => !!uri) || [];

    // Defensive merge to ensure no undefined property access crashes the UI
    return {
      id: Math.random().toString(36).substr(2, 9),
      domain,
      timestamp: new Date().toISOString(),
      sourceUrls,
      companyName: parsedData.companyName || "Unknown Entity",
      industry: parsedData.industry || "General Industry",
      summary: parsedData.summary || "Summary data unavailable for this target.",
      techStack: Array.isArray(parsedData.techStack) ? parsedData.techStack : [],
      swot: {
        strengths: Array.isArray(parsedData.swot?.strengths) ? parsedData.swot.strengths : [],
        weaknesses: Array.isArray(parsedData.swot?.weaknesses) ? parsedData.swot.weaknesses : [],
        opportunities: Array.isArray(parsedData.swot?.opportunities) ? parsedData.swot.opportunities : [],
        threats: Array.isArray(parsedData.swot?.threats) ? parsedData.swot.threats : [],
      },
      battlecard: {
        howToWin: Array.isArray(parsedData.battlecard?.howToWin) ? parsedData.battlecard.howToWin : [],
        commonObjections: Array.isArray(parsedData.battlecard?.commonObjections) ? parsedData.battlecard.commonObjections : [],
        discoveryQuestions: Array.isArray(parsedData.battlecard?.discoveryQuestions) ? parsedData.battlecard.discoveryQuestions : [],
      },
      featureGap: Array.isArray(parsedData.featureGap) ? parsedData.featureGap : [],
      sentiment: Array.isArray(parsedData.sentiment) ? parsedData.sentiment : []
    };
  } catch (error: any) {
    if (error.message?.includes('429')) {
      throw new Error("Efficiency limit reached. Wait 60s.");
    }
    throw error;
  }
};

export const generateCompetitorImage = async (prompt: string): Promise<string> => {
    if (!process.env.API_KEY) return "";
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: `Minimal Daytona dark tech banner for ${prompt}. Indigo neon, deep slate, 16:9.` }]
            },
            config: {
                imageConfig: { aspectRatio: "16:9" }
            }
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
        }
    } catch (e) {
        console.error("Image generation skipped for cost efficiency.");
    }
    return "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200";
};
