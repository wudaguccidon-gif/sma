import { GoogleGenerativeAI } from "@google/generative-ai"; // Fix #2: Official Library
import { AuditResult } from "../types";

// Helper to pull the key safely from Vercel
const getApiKey = () => {
  const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY; // Fix #1: Vercel naming
  if (!key) throw new Error("CRITICAL: API Key not found in Vercel. See instructions.");
  return key;
};

const extractJson = (text: string): any => {
  try {
    const firstOpen = text.indexOf('{');
    const lastClose = text.lastIndexOf('}');
    return JSON.parse(text.substring(firstOpen, lastClose + 1));
  } catch (e) {
    throw new Error("Intelligence scrambled. Try again.");
  }
};

export const performCompetitorAudit = async (domain: string): Promise<AuditResult> => {
  const genAI = new GoogleGenerativeAI(getApiKey());
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-pro", // Fix #3: Stable Model
    systemInstruction: "You are a Senior Market Intelligence Analyst. Return ONLY valid JSON."
  });
  
  try {
    const prompt = `Perform a forensic tactical audit for: ${domain}. Return JSON matching schema.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text(); // Fix #4: Function call

    const parsedData = extractJson(text);

    return {
      id: Math.random().toString(36).substr(2, 9),
      domain,
      timestamp: new Date().toISOString(),
      companyName: parsedData.companyName || domain,
      industry: parsedData.industry || "General Tech",
      summary: parsedData.summary,
      techStack: parsedData.techStack || [],
      swot: parsedData.swot,
      battlecard: parsedData.battlecard,
      featureGap: parsedData.featureGap,
      sentiment: parsedData.sentiment,
      visualUrl: `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200` 
    };
  } catch (error: any) {
    throw new Error(`Probe failed: ${error.message}`);
  }
};