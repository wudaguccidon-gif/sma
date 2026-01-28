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
    "Establishing secure connection to Gemini Flash-3...",
    "Injecting forensic web crawlers...",
    "Analyzing target DNS records and infrastructure...",
    "Retrieving public sentiment datasets...",
    "Synthesizing competitive SWOT analysis...",
    "Generating tactical sales battlecards...",
    "Finalizing intelligence report..."
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;

    let cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    
    setLoading(true);
    setError(null);
    setLogs(["Initialising probe for: " + cleanDomain]);
    
    let step = 0;
    const interval = setInterval(() => {
      setLogs(prev => [...prev.slice(-10), loadingSteps[step % loadingSteps.length]]);
      step++;
    }, 1500);

    try {
      const result = await performCompetitorAudit(cleanDomain);
      clearInterval(interval);
      onComplete(result);
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || "Strategic probe failed. Check target connectivity.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4">
        <div className="border border-slate-800 rounded-xl overflow-hidden bg-black shadow-2xl">
          <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
            <div className="flex space-x-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mono">Building Intelligence Report</span>
          </div>
          <div className="p-8 space-y-4 min-h-[400px] flex flex-col justify-end">
            <div className="space-y-2 mono text-xs">
              {logs.map((log, i) => (
                <div key={i} className="flex space-x-4">
                  <span className="text-slate-600 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                  <span className={i === logs.length - 1 ? "text-white font-bold" : "text-slate-500"}>
                    {i === logs.length - 1 && <span className="mr-2 text-emerald-500">➜</span>}
                    {log}
                  </span>
                </div>
              ))}
              <div className="flex space-x-4 animate-pulse">
                <span className="text-slate-600 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                <span className="text-emerald-500 font-bold">
                   <span className="mr-2">➜</span> Running forensic analysis...
                   <span className="inline-block w-2 h-4 bg-emerald-500 ml-1"></span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-20">
      <div className="bg-black border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-800 bg-[#0a0a0a]">
          <h2 className="text-2xl font-bold text-white tracking-tight">Create a New Audit</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Deploy a strategic intelligence probe to analyze a competitor's market position.</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="domain" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Target Domain
              </label>
              <input
                type="text"
                id="domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="e.g. apple.com"
                className="block w-full px-4 py-3 bg-black border border-slate-800 rounded-md focus:border-slate-400 outline-none transition-all text-white font-medium text-sm placeholder:text-slate-700"
                required
              />
              <p className="text-[10px] text-slate-600 italic">Enter the primary business domain for the most accurate results.</p>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-md flex items-start space-x-3">
                <i className="fa-solid fa-circle-exclamation mt-0.5 text-xs"></i>
                <p className="text-[11px] font-bold leading-normal uppercase tracking-tight">{error}</p>
              </div>
            )}

            <div className="flex items-center space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-white text-black py-2.5 px-4 rounded-md font-bold hover:bg-slate-200 transition-all active:scale-95 text-xs uppercase tracking-widest shadow-lg"
              >
                Deploy Probe
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 border border-slate-800 rounded-md font-bold text-slate-500 hover:text-white transition-all text-xs uppercase tracking-widest"
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