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
  const [statusMessage, setStatusMessage] = useState('');

  const loadingSteps = [
    "Connecting to Gemini Intelligence Network...",
    "Deploying forensic search probes...",
    "Extracting technical fingerprints...",
    "Analyzing market sentiment datasets...",
    "Compiling SWOT intelligence matrix...",
    "Generating offensive battlecard sequence...",
    "Finalizing decryption..."
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;

    let cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    
    setLoading(true);
    setError(null);
    
    let step = 0;
    const interval = setInterval(() => {
      setStatusMessage(loadingSteps[step % loadingSteps.length]);
      step++;
    }, 2000);

    try {
      const result = await performCompetitorAudit(cleanDomain);
      clearInterval(interval);
      onComplete(result);
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || "Audit failed. Target domain might be protected or invalid.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-32 px-4 text-center">
        <div className="relative inline-block mb-12">
            <div className="w-24 h-24 border-4 border-slate-900 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <i className="fa-solid fa-bolt text-indigo-500 text-2xl animate-pulse"></i>
            </div>
        </div>
        <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">Forensic Scan: {domain}</h2>
        <p className="text-indigo-400 font-black text-xs uppercase tracking-[0.4em] mb-12">{statusMessage}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-xl mx-auto">
          {[
            { label: "Tech Stack Escionage", status: "Active" },
            { label: "SWOT Compilation", status: "Processing" },
            { label: "Pricing Analysis", status: "Scanning" },
            { label: "Sentiment Mapping", status: "Pending" }
          ].map((item, i) => (
            <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
              <span className={`text-[9px] font-black uppercase tracking-widest ${item.status === 'Active' ? 'text-emerald-400' : 'text-slate-600'}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <div className="glass rounded-[3rem] overflow-hidden border-white/10 shadow-2xl relative">
        <div className="p-10 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-1 w-6 bg-indigo-500 rounded-full"></div>
            <span className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em]">Module 01. Probe</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Initialize Audit</h2>
          <p className="text-slate-500 mt-2 font-medium">Enter a target domain for full tactical analysis.</p>
        </div>
        
        <div className="p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label htmlFor="domain" className="block text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
                Target URL / Domain
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <i className="fa-solid fa-globe text-slate-600"></i>
                </div>
                <input
                  type="text"
                  id="domain"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="e.g. stripe.com"
                  className="block w-full pl-12 pr-6 py-5 bg-slate-900/50 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all text-white font-bold text-lg placeholder:text-slate-700"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-5 rounded-2xl flex items-start space-x-4">
                <i className="fa-solid fa-circle-exclamation mt-1"></i>
                <p className="text-xs font-black leading-relaxed uppercase tracking-tight">{error}</p>
              </div>
            )}

            <div className="flex items-center gap-6 pt-4">
              <button
                type="submit"
                className="flex-1 bg-white text-slate-950 py-5 px-8 rounded-2xl font-black hover:bg-indigo-50 transition-all shadow-2xl active:scale-95 text-md uppercase tracking-widest"
              >
                Execute Probe
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-8 py-5 border border-white/5 rounded-2xl font-black text-slate-500 hover:text-white transition-all text-xs uppercase tracking-widest"
              >
                Abort
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuditForm;