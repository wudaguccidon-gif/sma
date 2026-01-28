import React, { useState } from 'react';
import { AuditResult } from '../types';
import { generateBriefingVideo } from '../services/geminiService';

interface VideoBriefingProps {
  audit: AuditResult;
  onVideoGenerated: (url: string) => void;
}

const VideoBriefing: React.FC<VideoBriefingProps> = ({ audit, onVideoGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [log, setLog] = useState<string>("");

  const loadingSteps = [
    "Allocating compute resources for Veo 3.1...",
    "Injecting tactical context into neural video pipeline...",
    "Synthesizing cinematic 720p environments...",
    "Applying high-fidelity texture mapping...",
    "Rendering strategic motion vectors...",
    "Finalizing video briefing package..."
  ];

  const handleStartGeneration = async () => {
    // 1. Check for API key selection (Veo requirement)
    // @ts-ignore
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
        // Proceeding as per instructions (assuming success after dialog)
    }

    setIsGenerating(true);
    let step = 0;
    const interval = setInterval(() => {
        setLog(loadingSteps[step % loadingSteps.length]);
        step++;
    }, 15000); // Veo takes time, slower logs

    try {
        const url = await generateBriefingVideo(audit.summary);
        clearInterval(interval);
        onVideoGenerated(url);
    } catch (e: any) {
        clearInterval(interval);
        alert(`Video Generation Failed: ${e.message}`);
    } finally {
        setIsGenerating(false);
    }
  };

  if (audit.videoUrl) {
    return (
      <div className="space-y-8 animate-in zoom-in-95 duration-500">
        <div className="bg-black border border-slate-800 rounded-[2.5rem] p-4 overflow-hidden shadow-2xl">
          <video 
            src={audit.videoUrl} 
            controls 
            autoPlay 
            className="w-full rounded-[2rem] shadow-inner aspect-video bg-slate-900"
          />
        </div>
        <div className="glass p-10 rounded-[2rem] border-white/5 text-center">
            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-2">Cinematic Briefing Complete</h4>
            <p className="text-slate-400 font-medium italic text-lg leading-relaxed">
              "Strategic visual data stream successfully rendered for {audit.companyName}."
            </p>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500 text-center py-20">
        <div className="inline-block w-24 h-24 border-t-2 border-indigo-500 rounded-full animate-spin mb-8"></div>
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Rendering Strategic Briefing</h3>
        <p className="text-indigo-400 font-bold mono text-xs uppercase tracking-[0.3em] animate-pulse">
            <span className="mr-3">➜</span> {log || "Initializing Tactical Engine..."}
        </p>
        <p className="text-slate-600 text-[10px] max-w-sm mx-auto uppercase tracking-widest mt-10">
            Note: Cinematic rendering takes approximately 1-2 minutes. Do not refresh.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="relative bg-black border border-slate-800 rounded-[2.5rem] p-4 overflow-hidden shadow-2xl group">
        <img src={audit.visualUrl} className="w-full rounded-[2rem] shadow-inner opacity-40 blur-sm grayscale" alt="Preview" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-play text-white text-2xl ml-1"></i>
            </div>
            <h3 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Generate Video Briefing</h3>
            <p className="text-slate-400 max-w-md mx-auto text-sm font-medium leading-relaxed mb-8">
                Deploy Veo 3.1 to synthesize a high-fidelity cinematic video report for this competitor.
            </p>
            <button 
                onClick={handleStartGeneration}
                className="bg-white text-black px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs hover:bg-indigo-50 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all active:scale-95"
            >
                Initialize Veo Engine
            </button>
        </div>
      </div>

      <div className="glass p-10 rounded-[2rem] border-white/5 text-center">
         <div className="flex items-center justify-center space-x-4 mb-4">
             <i className="fa-solid fa-circle-info text-indigo-500"></i>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Veo Access Protocol</span>
         </div>
         <p className="text-slate-400 font-medium italic text-xs leading-relaxed max-w-xl mx-auto">
           Video generation requires a paid GCP project. Selecting "Initialize" will prompt for your Strategic Access Key. Refer to <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-indigo-400 underline">billing documentation</a> for details.
         </p>
      </div>
    </div>
  );
};

export default VideoBriefing;