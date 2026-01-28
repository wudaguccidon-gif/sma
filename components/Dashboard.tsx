import React from 'react';
import { AuditResult } from '../types';

interface DashboardProps {
  audits: AuditResult[];
  onSelectAudit: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ audits, onSelectAudit, onNew, onDelete }) => {
  return (
    <div className="space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-1 w-8 bg-indigo-500 rounded-full"></div>
            <span className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em]">Strategic Control</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter text-glow">Market Intelligence Hub</h2>
          <p className="text-slate-400 mt-2 max-w-2xl font-medium">Enterprise-grade competitor monitoring powered by Gemini 3 Flash. High-fidelity forensics & sales intelligence.</p>
        </div>
        <button 
          onClick={onNew}
          className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-sm font-black hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 flex items-center group uppercase tracking-widest"
        >
          <i className="fa-solid fa-plus mr-3 group-hover:rotate-90 transition-transform"></i>
          Initialize Audit
        </button>
      </div>

      {audits.length === 0 ? (
        <div className="glass rounded-[3rem] overflow-hidden border-white/5 relative group">
          <div className="relative h-[450px] overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200" 
              className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-[3000ms]"
              alt="Cyber Intelligence"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center">
              <div className="w-24 h-24 rounded-3xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-8 shadow-2xl animate-bounce">
                <i className="fa-solid fa-satellite-dish text-5xl text-indigo-400"></i>
              </div>
              <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Awaiting Signal Input</h3>
              <p className="text-slate-400 max-w-md mx-auto mb-10 font-medium leading-relaxed">
                Deploy an automated forensic probe to extract competitive SWOT intelligence, tech stack blueprints, and sentiment datasets.
              </p>
              <button 
                onClick={onNew}
                className="bg-white text-slate-950 px-12 py-4 rounded-2xl font-black hover:bg-indigo-50 transition-all shadow-2xl flex items-center active:scale-95 text-lg"
              >
                Initialize Probe
                <i className="fa-solid fa-arrow-right ml-4"></i>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {audits.map((audit) => (
            <div 
              key={audit.id}
              className="glass rounded-[2.5rem] overflow-hidden hover:border-indigo-500/50 transition-all duration-500 flex flex-col group"
            >
              <div className="p-6 border-b border-white/5 flex items-start justify-between">
                <div className="flex items-center space-x-4 cursor-pointer" onClick={() => onSelectAudit(audit.id)}>
                  <div className="p-1.5 bg-white rounded-xl shadow-lg">
                    <img 
                        src={`https://logo.clearbit.com/${audit.domain}`} 
                        className="w-10 h-10 rounded-lg"
                        onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${audit.companyName}&background=4f46e5&color=fff` }}
                        alt=""
                    />
                  </div>
                  <div className="truncate max-w-[150px]">
                    <h4 className="font-black text-white text-lg truncate group-hover:text-indigo-400 transition-colors">{audit.companyName}</h4>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest truncate">{audit.domain}</p>
                  </div>
                </div>
                <button 
                  onClick={() => { if(confirm('Purge this audit?')) onDelete(audit.id); }}
                  className="text-slate-600 hover:text-rose-500 transition-colors p-2"
                >
                  <i className="fa-solid fa-trash-can text-sm"></i>
                </button>
              </div>
              
              <div className="p-6 flex-1 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Primary Insight</span>
                    <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full"></span>
                  </div>
                  <p className="text-sm text-slate-300 font-medium leading-relaxed italic line-clamp-2">
                    "{audit.swot.strengths[0]}"
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:border-indigo-500/20 transition-all">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Sentiment</p>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-black text-white">
                        {Math.round(audit.sentiment.reduce((acc, curr) => acc + curr.score, 0) / (audit.sentiment.length || 1))}
                      </span>
                      <span className="text-xs text-slate-500 font-black">/100</span>
                    </div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:border-indigo-500/20 transition-all">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Tech Index</p>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-black text-white">{audit.techStack.length}</span>
                      <span className="text-xs text-slate-500 font-black">Modules</span>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => onSelectAudit(audit.id)}
                className="w-full py-5 bg-white/[0.03] border-t border-white/5 text-[10px] font-black text-indigo-400 hover:text-white hover:bg-indigo-600 transition-all uppercase tracking-[0.3em]"
              >
                Access Forensic Archive
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="glass rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-10 border-indigo-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] -mr-32 -mt-32"></div>
        <div className="flex items-center space-x-8 relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-800 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 group">
             <i className="fa-solid fa-microchip text-4xl text-white group-hover:rotate-90 transition-transform duration-700"></i>
          </div>
          <div>
            <h4 className="text-2xl font-black text-white tracking-tight">Flash Engine: Operational</h4>
            <p className="text-slate-400 font-medium mt-1">Real-time competitive datasets active. Latency optimization enabled.</p>
          </div>
        </div>
        <div className="flex space-x-4 relative z-10">
          <span className="px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center">
            <span className="h-2 w-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></span>
            Real-time Scans
          </span>
          <span className="px-5 py-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center">
            Efficiency Active
          </span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;