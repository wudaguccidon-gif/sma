
import { GoogleGenAI, Type, Modality } from "@google/genai";
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
    console.error("Extraction error:", e, text);
    throw new Error("Target intelligence scrambled. Try again.");
  }
};

export const performCompetitorAudit = async (domain: string): Promise<AuditResult> => {
  const apiKey = process.env.API_KEY;
  
  // Robust check for Vercel environment variables
  if (!apiKey || apiKey === "undefined" || apiKey.length < 10) {
    throw new Error("CRITICAL: API_KEY is missing or invalid. If you just added it to Vercel, you MUST 'Redeploy' the project for changes to take effect.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Upgraded for complex strategic reasoning
      contents: `Perform a deep forensic tactical audit for domain: ${domain}. Analyze market positioning, technology profile, and perform a detailed SWOT analysis.`,
      config: {
        systemInstruction: "You are a world-class Senior Market Intelligence Analyst. Return ONLY valid JSON. Be forensic, aggressive, and provide highly specific technical and strategic insights. Use tools to find real-time data.",
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
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

    // Tactical Visual (Hero shot)
    let visualUrl = "";
    try {
      const visualRes = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: `Cinematic high-tech futuristic headquarters for ${parsedData.companyName || domain}. Neon accents, hyper-modern, rainy night, 4k, architectural photography.` }] }
      });
      for (const part of visualRes.candidates[0].content.parts) {
        if (part.inlineData) visualUrl = `data:image/png;base64,${part.inlineData.data}`;
      }
    } catch (e) {
      visualUrl = `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200`;
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      domain,
      timestamp: new Date().toISOString(),
      companyName: parsedData.companyName || domain,
      industry: parsedData.industry || "General Technology",
      summary: parsedData.summary || "Forensic summary unavailable.",
      techStack: parsedData.techStack || [],
      swot: parsedData.swot,
      battlecard: parsedData.battlecard,
      featureGap: parsedData.featureGap,
      sentiment: parsedData.sentiment,
      visualUrl
    };
  } catch (error: any) {
    console.error("Audit Service Error:", error);
    throw new Error(`Probe failed: ${error.message}`);
  }
};

export const generateBriefingAudio = async (text: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Professional tactical briefing: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
    },
  });
  const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  return base64 ? `data:audio/pcm;base64,${base64}` : "";
};

export const generateBriefingVideo = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `Cinematic strategic intelligence summary visualization for ${prompt}`,
    config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
  });
  while (!operation.done) {
    await new Promise(r => setTimeout(r, 10000));
    operation = await ai.operations.getVideosOperation({ operation });
  }
  const link = operation.response?.generatedVideos?.[0]?.video?.uri;
  const res = await fetch(`${link}&key=${process.env.API_KEY}`);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
};
