
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
    "Establishing high-speed link...",
    "Injecting forensic crawlers...",
    "Parsing target metadata...",
    "Querying global sentiment indexes...",
    "Analyzing SWOT vectors...",
    "Building tactical battlecard...",
    "Synthesizing high-fidelity visuals..."
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;

    let cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    
    setLoading(true);
    setError(null);
    setLogs(["Initializing probe for: " + cleanDomain]);
    
    let step = 0;
    const interval = setInterval(() => {
      setLogs(prev => [...prev.slice(-8), loadingSteps[step % loadingSteps.length]]);
      step++;
    }, 2500);

    try {
      const result = await performCompetitorAudit(cleanDomain);
      clearInterval(interval);
      onComplete(result);
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || "Audit failed. Ensure API_KEY is valid.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full py-12 px-4">
        <div className="border border-slate-800 rounded-[2rem] overflow-hidden bg-black shadow-2xl relative w-full">
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 animate-pulse"></div>
          <div className="p-10 space-y-6 min-h-[500px] flex flex-col justify-end">
            <div className="space-y-4 mono text-[12px]">
              {logs.map((log, i) => (
                <div key={i} className="flex space-x-6">
                  <span className="text-slate-700 shrink-0">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                  <span className={i === logs.length - 1 ? "text-indigo-400 font-bold" : "text-slate-600"}>
                    {i === logs.length - 1 && <span className="mr-2 text-emerald-500">➜</span>}
                    {log}
                  </span>
                </div>
              ))}
              <div className="flex space-x-6">
                <span className="text-slate-700 shrink-0">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                <span className="text-emerald-500 font-bold animate-pulse">
                   <span className="mr-2">➜</span> Finalizing strategic report...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-10 md:py-20 px-4">
      <div className="bg-black border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl max-w-4xl mx-auto">
        <div className="p-10 border-b border-slate-800 bg-gradient-to-b from-slate-900/50 to-transparent">
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Initiate Audit</h2>
          <p className="text-slate-500 text-sm mt-3 font-medium">Target a competitor's domain to deploy an intelligence probe.</p>
        </div>
        
        <div className="p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label htmlFor="domain" className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                Target Domain Identification
              </label>
              <input
                type="text"
                id="domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="e.g. apple.com"
                className="block w-full px-6 py-5 bg-slate-950 border border-slate-800 rounded-2xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-white font-bold text-xl placeholder:text-slate-800"
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-rose-500/5 border border-rose-500/20 text-rose-400 p-6 rounded-2xl flex items-start space-x-4">
                <i className="fa-solid fa-triangle-exclamation mt-1 text-lg"></i>
                <div className="space-y-1">
                    <p className="text-xs font-black uppercase tracking-widest text-rose-500">Intelligence Failure</p>
                    <p className="text-[11px] font-bold leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-white text-black py-5 px-8 rounded-2xl font-black hover:bg-indigo-50 transition-all active:scale-95 text-xs uppercase tracking-[0.2em]"
              >
                Launch Forensic Probe
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-8 py-5 border border-slate-800 rounded-2xl font-black text-slate-500 hover:text-white transition-all text-xs uppercase tracking-widest"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuditForm;
