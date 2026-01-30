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

/**
 * Performs a deep forensic tactical audit using Gemini 3 Pro.
 * Incorporates real-time grounding via Google Search.
 */
export const performCompetitorAudit = async (domain: string): Promise<AuditResult> => {
  // FIXED: Changed from process.env to import.meta.env for Vite/Vercel
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey.length < 10) {
    throw new Error("CRITICAL: API_KEY is missing or invalid. Set it in environment variables.");
  }

  // Create new instance for each call to ensure fresh state
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro', // Note: You may need to change 'gemini-3-pro-preview' to 'gemini-1.5-pro' if it fails
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

    // Extract grounding URLs from metadata
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sourceUrls = groundingChunks?.map((chunk: any) => chunk.web?.uri).filter((uri: any) => typeof uri === 'string') || [];

    let visualUrl = "";
    try {
      const visualRes = await ai.models.generateContent({
        model: 'gemini-1.5-flash', // Note: Changed from 'gemini-2.5-flash-image'
        contents: { parts: [{ text: `Cinematic high-tech futuristic headquarters for ${parsedData.companyName || domain}. Neon accents, hyper-modern, architectural photography.` }] }
      });
      // Correctly iterate through parts to find image data per guidelines
      if (visualRes.candidates?.[0]?.content?.parts) {
        for (const part of visualRes.candidates[0].content.parts) {
          if (part.inlineData) {
            visualUrl = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }
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
      sourceUrls,
      visualUrl
    };
  } catch (error: any) {
    console.error("Audit Service Error:", error);
    throw new Error(`Probe failed: ${error.message}`);
  }
};

/**
 * Generates audio briefing using Gemini Text-to-Speech.
 */
export const generateBriefingAudio = async (text: string): Promise<string> => {
  // FIXED: Changed to import.meta.env
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash", // Note: Changed to valid model
    contents: [{ parts: [{ text: `Professional tactical briefing: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
    },
  });
  const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  return base64 ? `data:audio/pcm;base64,${base64}` : "";
};

/**
 * Generates a cinematic video briefing using Veo 3.1.
 * Requires mandatory polling and fetch with API key suffix.
 */
export const generateBriefingVideo = async (summary: string): Promise<string> => {
  // FIXED: Changed to import.meta.env
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
  
  let operation = await ai.models.generateVideos({
    model: 'veo-1', // Note: Standardized model name
    prompt: `A cinematic and futuristic strategic intelligence briefing video. Abstract data visualizations, high-tech environments, professional motion graphics. Context: ${summary}`,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  // Poll the operation until it is complete
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) {
    throw new Error("Video generation failed: No download link produced.");
  }

  // FIXED: Changed to import.meta.env
  const response = await fetch(`${downloadLink}&key=${import.meta.env.VITE_GEMINI_API_KEY}`);
  if (!response.ok) {
    throw new Error("Failed to retrieve generated video file.");
  }
  
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};