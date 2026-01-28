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
    <div className="space-y-6 max-w-6xl mx-auto py-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Audits</h2>
          <p className="text-slate-500 text-sm mt-1">Manage and monitor competitive intelligence deployments.</p>
        </div>
        <div className="flex space-x-3">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Search audits..." 
              className="bg-black border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-slate-600 w-64 transition-all"
            />
          </div>
        </div>
      </div>

      {audits.length === 0 ? (
        <div className="border border-slate-800 rounded-xl p-20 flex flex-col items-center justify-center text-center bg-[#0a0a0a]">
          <div className="w-12 h-12 rounded-full border border-slate-800 flex items-center justify-center mb-6">
            <i className="fa-solid fa-magnifying-glass text-slate-600"></i>
          </div>
          <h3 className="text-lg font-semibold text-white">No Audits Found</h3>
          <p className="text-slate-500 text-sm mt-2 max-w-xs">Initialize your first strategic probe to begin gathering market intelligence.</p>
          <button 
            onClick={onNew}
            className="mt-8 px-6 py-2 bg-white text-black rounded-md font-semibold text-sm hover:bg-slate-200"
          >
            Create Your First Audit
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {audits.map((audit) => (
            <div 
              key={audit.id}
              className="bg-black border border-slate-800 rounded-xl p-6 card-hover group relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row justify-between gap-8">
                {/* Left Side: Identity */}
                <div className="flex items-start space-x-4 min-w-0 flex-1">
                  <div className="p-2 bg-black border border-slate-800 rounded-lg shrink-0">
                    <img 
                      src={`https://logo.clearbit.com/${audit.domain}`} 
                      className="w-10 h-10 rounded-md"
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${audit.companyName}&background=000&color=fff` }}
                      alt=""
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-3">
                      <h4 
                        onClick={() => onSelectAudit(audit.id)}
                        className="font-bold text-lg text-white truncate cursor-pointer hover:underline decoration-slate-600 underline-offset-4"
                      >
                        {audit.companyName}
                      </h4>
                      <span className="flex items-center space-x-2 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full shrink-0">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Ready</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <i className="fa-solid fa-link text-slate-700 text-[10px]"></i>
                      <p className="text-xs text-slate-500 mono truncate">{audit.domain}</p>
                    </div>
                  </div>
                </div>

                {/* Center: Metadata Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 shrink-0">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Created</p>
                    <p className="text-xs text-slate-300 font-medium">{new Date(audit.timestamp).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Industry</p>
                    <p className="text-xs text-slate-300 font-medium truncate max-w-[100px]">{audit.industry}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Tech Index</p>
                    <p className="text-xs text-slate-300 font-medium mono">{audit.techStack.length} Nodes</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Sentiment</p>
                    <div className="flex items-center space-x-2">
                       <span className="text-xs text-white font-bold">{Math.round(audit.sentiment.reduce((a, b) => a + b.score, 0) / audit.sentiment.length)}%</span>
                       <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${Math.round(audit.sentiment.reduce((a, b) => a + b.score, 0) / audit.sentiment.length)}%` }}></div>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Actions */}
                <div className="flex items-center space-x-3 shrink-0">
                  <button 
                    onClick={() => onSelectAudit(audit.id)}
                    className="px-4 py-2 bg-slate-900 border border-slate-800 text-white rounded-md text-xs font-semibold hover:bg-slate-800 transition-colors"
                  >
                    View Report
                  </button>
                  <button 
                    onClick={() => { if(confirm('Permanently delete this audit?')) onDelete(audit.id); }}
                    className="p-2 text-slate-600 hover:text-rose-500 transition-colors"
                  >
                    <i className="fa-solid fa-trash-can text-sm"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;