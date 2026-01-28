
import { GoogleGenAI, Type } from "@google/genai";
import { AuditResult } from "../types";

const extractJson = (text: string): any => {
  try {
    // Attempt to find the JSON block if the model included conversational filler
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

export const performCompetitorAudit = async (domain: string): Promise<AuditResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Using Gemini 3 Pro for world-class strategic reasoning
  const modelName = 'gemini-3-pro-preview';

  const systemInstruction = `You are a World-Class Strategic Market Auditor and Forensic Intelligence Specialist. 
  Your mission is to perform a deep forensic audit and provide a high-fidelity report in JSON format.
  
  REPORT SECTIONS:
  - SWOT: 4 bullet points for each quadrant.
  - BATTLECARD: Generate high-impact 'Win Sequences', real customer objections, and discovery questions that expose technical debt.
  - FEATURE GAP: Identify 5-8 specific product features. Statuses must be: 'available', 'limited', or 'missing'.
  - SENTIMENT: Analyze Product, Support, and Pricing with 0-100 scores and specific user complaints.
  - TECH STACK: Identify 10+ specific technologies used (CDNs, Frameworks, CRMs, etc.).
  
  BE SPECIFIC, AGGRESSIVE, AND ACTIONABLE. DO NOT PROVIDE GENERIC BULLSHIT.`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Perform an exhaustive forensic tactical audit for: ${domain}. Focus on SaaS infrastructure, feature gaps, and offensive sales win-strategies.`,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        // Higher thinking budget for deeper strategic synthesis of search results
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
    const sourceUrls = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map(chunk => chunk.web?.uri)
      .filter((uri): uri is string => !!uri) || [];

    return {
      id: Math.random().toString(36).substr(2, 9),
      domain,
      timestamp: new Date().toISOString(),
      sourceUrls,
      companyName: parsedData.companyName || domain,
      industry: parsedData.industry || "General Industry",
      summary: parsedData.summary || "Intelligence summary complete.",
      techStack: Array.isArray(parsedData.techStack) ? parsedData.techStack : [],
      swot: parsedData.swot || { strengths: [], weaknesses: [], opportunities: [], threats: [] },
      battlecard: parsedData.battlecard || { howToWin: [], commonObjections: [], discoveryQuestions: [] },
      featureGap: Array.isArray(parsedData.featureGap) ? parsedData.featureGap : [],
      sentiment: Array.isArray(parsedData.sentiment) ? parsedData.sentiment : []
    };
  } catch (error: any) {
    console.error("Forensic Audit Error:", error);
    throw new Error(`Strategic probe failed: ${error.message}`);
  }
};

export const generateCompetitorImage = async (prompt: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: `High-end strategic market visual: ${prompt}. Abstract data flows, minimalist dark mode UI aesthetic, indigo and violet highlights, 16:9 cinematic.` }]
            },
            config: {
                imageConfig: { aspectRatio: "16:9" }
            }
        });

        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
        }
    } catch (e) {
        console.warn("Visual generation skipped.");
    }
    return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200";
};
