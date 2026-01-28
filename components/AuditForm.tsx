
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
    "Connecting to Gemini Core...",
    "Injecting forensic probes...",
    "Compiling SWOT intelligence...",
    "Scanning tech blueprints...",
    "Decrypting market sentiment...",
    "Finalizing report..."
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
    }, 2500);

    try {
      const result = await performCompetitorAudit(cleanDomain);
      clearInterval(interval);
      onComplete(result);
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || "Audit failed. Verify target domain.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-32 px-4 text-center">
        <div className="w-16 h-16 border-2 border-slate-800 border-t-indigo-500 rounded-full animate-spin mx-auto mb-10"></div>
        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Analyzing {domain}</h2>
        <p className="text-slate-500 font-medium text-sm px-2">{statusMessage}</p>
        
        <div className="mt-16 bg-slate-900/50 rounded-2xl p-6 text-left border border-white/5 max-w-sm mx-auto">
          <ul className="space-y-3">
            {[
              "Mapping SaaS tech stack",
              "Uncovering pricing patterns",
              "Extracting competitive sentiment",
              "Defining sales counter-tactics"
            ].map((text, i) => (
              <li key={i} className="flex items-center text-xs text-slate-400">
                <div className="h-1 w-1 bg-indigo-500 rounded-full mr-3 opacity-50"></div>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <div className="bg-slate-900/40 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl relative">
        <div className="p-8 md:p-10 border-b border-white/5">
          <h2 className="text-3xl font-bold text-white tracking-tight">New Audit</h2>
          <p className="text-slate-400 mt-1 text-sm">Identify target for full forensic analysis.</p>
        </div>
        
        <div className="p-8 md:p-10">
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
                placeholder="e.g. stripe.com"
                className="block w-full px-5 py-4 bg-slate-800/50 border border-white/5 rounded-xl focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all text-white font-semibold text-md placeholder:text-slate-600"
                required
              />
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-start space-x-3">
                <i className="fa-solid fa-circle-exclamation mt-1"></i>
                <div className="text-xs font-medium leading-relaxed">{error}</div>
              </div>
            )}

            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-white text-slate-950 py-4 px-8 rounded-xl font-bold hover:bg-slate-100 transition-all shadow-xl active:scale-95"
              >
                Execute Audit
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-4 border border-white/5 rounded-xl font-bold text-slate-500 hover:text-white transition-all text-sm"
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
