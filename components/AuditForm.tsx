
import React, { useState } from 'react';
import { performCompetitorAudit } from '../services/geminiService';
import { AuditResult } from '../types';

interface AuditFormProps {
  onComplete: (result: AuditResult) => void;
  onCancel: () => void;
}

const AuditForm: React.FC<AuditFormProps> = ({ onComplete, onCancel }) => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const loadingSteps = [
    "Establishing secure connection...",
    "Bypassing target domain perimeter...",
    "Injecting forensic web crawlers...",
    "Parsing metadata and DNS records...",
    "Retrieving public sentiment datasets...",
    "Synthesizing competitive SWOT analysis...",
    "Compiling feature gap matrix...",
    "Finalizing visual intelligence report..."
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;

    let cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    
    setLoading(true);
    setError(null);
    setLogs(["Initialising high-intensity probe for: " + cleanDomain]);
    
    let step = 0;
    const interval = setInterval(() => {
      setLogs(prev => [...prev.slice(-6), loadingSteps[step % loadingSteps.length]]);
      step++;
    }, 2000);

    try {
      const result = await performCompetitorAudit(cleanDomain);
      clearInterval(interval);
      onComplete(result);
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || "Audit failed. Please ensure your API_KEY is correctly set in Vercel environment variables.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto py-20 px-4">
        <div className="border border-slate-800 rounded-[2rem] overflow-hidden bg-black shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 animate-pulse"></div>
          <div className="p-10 space-y-6 min-h-[400px] flex flex-col justify-end">
            <div className="space-y-3 mono text-[11px]">
              {logs.map((log, i) => (
                <div key={i} className="flex space-x-4">
                  <span className="text-slate-700 shrink-0">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                  <span className={i === logs.length - 1 ? "text-indigo-400 font-bold" : "text-slate-600"}>
                    {i === logs.length - 1 && <span className="mr-2 text-emerald-500">➜</span>}
                    {log}
                  </span>
                </div>
              ))}
              <div className="flex space-x-4">
                <span className="text-slate-700 shrink-0">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                <span className="text-emerald-500 font-bold animate-pulse">
                   <span className="mr-2">➜</span> Finalizing neural vectors...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-10 md:py-20 px-4">
      <div className="bg-black border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-10 border-b border-slate-800 bg-gradient-to-b from-slate-900/50 to-transparent">
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Initiate Audit</h2>
          <p className="text-slate-500 text-sm mt-3 font-medium">Target a competitor's domain to deploy an intelligence probe.</p>
        </div>
        
        <div className="p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label htmlFor="domain" className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                Target Identification
              </label>
              <input
                type="text"
                id="domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="e.g. apple.com"
                className="block w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-white font-bold text-lg placeholder:text-slate-800"
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-rose-500/5 border border-rose-500/20 text-rose-400 p-6 rounded-2xl flex items-start space-x-4">
                <i className="fa-solid fa-circle-info mt-1"></i>
                <p className="text-xs font-bold leading-relaxed uppercase tracking-tight">{error}</p>
              </div>
            )}

            <div className="flex items-center space-x-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-white text-black py-4 px-8 rounded-2xl font-black hover:bg-indigo-50 transition-all active:scale-95 text-xs uppercase tracking-[0.2em]"
              >
                Launch Probe
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-4 border border-slate-800 rounded-2xl font-black text-slate-500 hover:text-white transition-all text-xs uppercase tracking-widest"
              >
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuditForm;
