
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
    <div className="space-y-6 w-full py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white uppercase italic">Strategic Inventory</h2>
          <p className="text-slate-500 text-xs mt-1 font-black uppercase tracking-widest">Active Intelligence Deployments: {audits.length}</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-[10px]"></i>
            <input 
              type="text" 
              placeholder="Filter probes..." 
              className="bg-black border border-slate-800 rounded-md pl-9 pr-3 py-1.5 text-[10px] text-slate-300 focus:outline-none focus:border-indigo-500 w-full sm:w-64 transition-all uppercase tracking-widest font-bold"
            />
          </div>
          <button 
            onClick={onNew}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-500/10"
          >
            New Probe
          </button>
        </div>
      </div>

      {audits.length === 0 ? (
        <div className="border border-slate-800 rounded-xl p-20 flex flex-col items-center justify-center text-center bg-[#050505] min-h-[50vh]">
          <div className="w-16 h-16 rounded-2xl border border-slate-800 flex items-center justify-center mb-6 bg-black">
            <i className="fa-solid fa-radar text-slate-700 text-2xl animate-pulse"></i>
          </div>
          <h3 className="text-xl font-bold text-white uppercase tracking-tighter">No Active Signals</h3>
          <p className="text-slate-500 text-xs mt-2 max-w-xs uppercase tracking-widest leading-relaxed">Initialize a strategic probe to begin gathering forensic market data.</p>
          <button 
            onClick={onNew}
            className="mt-8 px-8 py-3 bg-white text-black rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-200 transition-all active:scale-95"
          >
            Launch First Probe
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
          {audits.map((audit) => (
            <div 
              key={audit.id}
              className="bg-black border border-slate-800 rounded-2xl p-6 card-hover group relative overflow-hidden flex flex-col xl:flex-row xl:items-center justify-between gap-6"
            >
              {/* Animated corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              {/* Identity Section */}
              <div className="flex items-start space-x-5 min-w-0 xl:w-1/3">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl shrink-0 shadow-2xl">
                  <img 
                    src={`https://logo.clearbit.com/${audit.domain}`} 
                    className="w-12 h-12 rounded-lg grayscale group-hover:grayscale-0 transition-all"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${audit.companyName}&background=000&color=fff` }}
                    alt=""
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-3">
                    <h4 
                      onClick={() => onSelectAudit(audit.id)}
                      className="font-black text-xl text-white truncate cursor-pointer hover:text-indigo-400 transition-colors uppercase tracking-tighter"
                    >
                      {audit.companyName}
                    </h4>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest truncate">{audit.domain}</p>
                  </div>
                </div>
              </div>

              {/* Status/Metrics Section */}
              <div className="grid grid-cols-2 gap-4 xl:gap-8 flex-1 xl:px-8 xl:border-l xl:border-r xl:border-slate-800/50">
                <div className="space-y-1">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-slate-600 font-black">Sector</p>
                  <p className="text-xs text-slate-300 font-bold uppercase truncate">{audit.industry}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-slate-600 font-black">Intelligence Index</p>
                  <div className="flex items-center space-x-3">
                     <span className="text-xs text-white font-black">{Math.round(audit.sentiment.reduce((a, b) => a + b.score, 0) / audit.sentiment.length)}%</span>
                     <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden max-w-[60px]">
                        <div className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" style={{ width: `${Math.round(audit.sentiment.reduce((a, b) => a + b.score, 0) / audit.sentiment.length)}%` }}></div>
                     </div>
                  </div>
                </div>
              </div>

              {/* Action Section */}
              <div className="flex items-center space-x-3 shrink-0 xl:w-48 justify-end">
                <button 
                  onClick={() => onSelectAudit(audit.id)}
                  className="px-5 py-2.5 bg-slate-900 border border-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all active:scale-95"
                >
                  Intercept Report
                </button>
                <button 
                  onClick={() => { if(confirm('Permanently wipe this audit data?')) onDelete(audit.id); }}
                  className="p-2.5 text-slate-700 hover:text-rose-500 transition-colors"
                >
                  <i className="fa-solid fa-trash-can text-sm"></i>
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
