
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Intelligence Hub</h2>
          <p className="text-slate-400 mt-1 text-sm font-medium">Monitoring the competitive landscape.</p>
        </div>
        <button 
          onClick={onNew}
          className="bg-white text-slate-950 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all flex items-center justify-center"
        >
          <i className="fa-solid fa-plus mr-2 text-xs"></i>
          Initialize Audit
        </button>
      </div>

      {audits.length === 0 ? (
        <div className="border border-white/5 bg-slate-900/40 rounded-[2rem] overflow-hidden relative group">
          <div className="relative h-[300px] flex flex-col items-center justify-center p-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-6">
              <i className="fa-solid fa-radar text-2xl text-indigo-400"></i>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Awaiting Input</h3>
            <p className="text-slate-400 max-w-sm mx-auto mb-8 text-sm">
              Enter a target domain to generate an enterprise-grade competitive audit.
            </p>
            <button 
              onClick={onNew}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
            >
              Start Analysis
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audits.map((audit) => (
            <div 
              key={audit.id}
              className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all duration-300 flex flex-col"
            >
              <div className="p-5 border-b border-white/5 flex items-start justify-between">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectAudit(audit.id)}>
                  <div className="p-1 bg-white rounded-lg">
                    <img 
                        src={`https://logo.clearbit.com/${audit.domain}`} 
                        className="w-8 h-8 rounded"
                        onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${audit.companyName}&background=4f46e5&color=fff` }}
                        alt=""
                    />
                  </div>
                  <div className="truncate max-w-[140px]">
                    <h4 className="font-bold text-white text-sm truncate">{audit.companyName}</h4>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{audit.domain}</p>
                  </div>
                </div>
                <button 
                  onClick={() => { if(confirm('Purge this audit?')) onDelete(audit.id); }}
                  className="text-slate-600 hover:text-rose-500 transition-colors p-2"
                >
                  <i className="fa-solid fa-trash-can text-xs"></i>
                </button>
              </div>
              
              <div className="p-5 flex-1 space-y-4">
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed italic">
                  "{audit.swot.strengths[0]}"
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Sentiment</p>
                    <p className="text-lg font-bold text-white">
                      {Math.round(audit.sentiment.reduce((acc, curr) => acc + curr.score, 0) / (audit.sentiment.length || 1))}
                    </p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Tech Stack</p>
                    <p className="text-lg font-bold text-white">{audit.techStack.length}</p>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 bg-white/5 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                  {new Date(audit.timestamp).toLocaleDateString()}
                </span>
                <button 
                  onClick={() => onSelectAudit(audit.id)}
                  className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest"
                >
                  View Report
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
