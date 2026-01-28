import { GoogleGenAI, Type } from "@google/genai";
import { AuditResult } from "../types";

const extractJson = (text: string): any => {
  try {
    const firstOpen = text.indexOf('{');
    const lastClose = text.lastIndexOf('}');
    if (firstOpen !== -1 && lastClose !== -1) {
      const jsonStr = text.substring(firstOpen, lastClose + 1);
      return JSON.parse(jsonStr);
    }
    return JSON.parse(text);
  } catch (e) {
    console.error("JSON Parse Error:", e, "Raw Text:", text);
    throw new Error("Strategic intelligence extraction failed. Please re-run the probe.");
  }
};

export const generateCompetitorImage = async (apiKey: string, domain: string, industry: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: `High-end cinematic strategic market visual for ${domain} in the ${industry} sector. Abstract architectural data flows, minimalist dark mode tech aesthetic, deep charcoal and electric indigo highlights, professional commercial photography style, ultra-detailed.` }]
            },
            config: {
                imageConfig: { aspectRatio: "16:9" }
            }
        });

        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
        }
    } catch (e) {
        console.warn("Visual generation skipped:", e);
    }
    return `https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200&domain=${domain}`;
};

export const performCompetitorAudit = async (domain: string): Promise<AuditResult> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey.length < 5) {
    throw new Error("CRITICAL: API_KEY is missing from environment. Please add 'API_KEY' to your Environment Variables in Settings.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const modelName = 'gemini-3-flash-preview';

  const systemInstruction = `You are a World-Class Strategic Market Auditor and Forensic Intelligence Specialist. 
  Your mission is to perform a deep forensic audit and provide a high-fidelity report in JSON format.
  
  BE SPECIFIC, AGGRESSIVE, AND ACTIONABLE.`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Perform an exhaustive forensic tactical audit for: ${domain}.`,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 8000 },
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
                },
                required: ['feature', 'status', 'description']
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
                },
                required: ['category', 'score', 'gripes']
              }
            }
          },
          required: ['companyName', 'industry', 'summary', 'techStack', 'swot', 'battlecard', 'featureGap', 'sentiment']
        }
      }
    });

    const parsedData = extractJson(response.text || "{}");
    
    // Trigger visual generation in parallel
    const visualUrl = await generateCompetitorImage(apiKey, domain, parsedData.industry || "Technology");

    return {
      id: Math.random().toString(36).substr(2, 9),
      domain,
      timestamp: new Date().toISOString(),
      companyName: parsedData.companyName || domain,
      industry: parsedData.industry || "General Industry",
      summary: parsedData.summary || "Intelligence summary complete.",
      techStack: Array.isArray(parsedData.techStack) ? parsedData.techStack : [],
      swot: parsedData.swot || { strengths: [], weaknesses: [], opportunities: [], threats: [] },
      battlecard: parsedData.battlecard || { howToWin: [], commonObjections: [], discoveryQuestions: [] },
      featureGap: Array.isArray(parsedData.featureGap) ? parsedData.featureGap : [],
      sentiment: Array.isArray(parsedData.sentiment) ? parsedData.sentiment : [],
      visualUrl
    };
  } catch (error: any) {
    console.error("Forensic Audit Error:", error);
    throw new Error(error.message.includes("API_KEY") ? error.message : `Strategic probe failed: ${error.message}`);
  }
};