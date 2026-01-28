
import React from 'react';
import { AppView, AuditResult } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  audits: AuditResult[];
  onSelectAudit: (id: string, tab?: string) => void;
  selectedId: string | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onPrintAll?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  setView, 
  audits, 
  onSelectAudit, 
  selectedId, 
  activeTab, 
  onTabChange,
  onPrintAll
}) => {
  const selectedAudit = audits.find(a => a.id === selectedId);

  const auditSections = [
    { id: 'overview', label: 'Overview', icon: 'fa-eye' },
    { id: 'battlecard', label: 'Battlecard', icon: 'fa-crosshairs' },
    { id: 'features', label: 'Features', icon: 'fa-table-cells' },
    { id: 'sentiment', label: 'Sentiment', icon: 'fa-face-smile' },
    { id: 'tech', label: 'Tech Stack', icon: 'fa-microchip' },
  ];

  return (
    <div className="w-full lg:w-72 bg-slate-950 h-full flex flex-col text-slate-400 border-r border-white/5">
      <div className="p-8">
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Intelligence Lab</h2>
        <nav className="space-y-2">
          <button
            onClick={() => setView(AppView.DASHBOARD)}
            className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${
              currentView === AppView.DASHBOARD ? 'bg-white/5 text-white border border-white/10 glow-indigo' : 'hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <i className={`fa-solid fa-chart-line w-6 ${currentView === AppView.DASHBOARD ? 'text-indigo-400' : 'text-slate-600'}`}></i>
            Dashboard
          </button>
          <button
            onClick={() => setView(AppView.NEW_AUDIT)}
            className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${
              currentView === AppView.NEW_AUDIT ? 'bg-white/5 text-white border border-white/10 glow-indigo' : 'hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <i className={`fa-solid fa-magnifying-glass w-6 ${currentView === AppView.NEW_AUDIT ? 'text-indigo-400' : 'text-slate-600'}`}></i>
            New Audit
          </button>
        </nav>
      </div>

      {selectedAudit && currentView === AppView.AUDIT_DETAIL && (
        <div className="px-8 pb-8">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full"></div>
            <div className="flex items-center space-x-3 mb-6 relative z-10">
              <img 
                src={`https://logo.clearbit.com/${selectedAudit.domain}`} 
                onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${selectedAudit.companyName}&background=4f46e5&color=fff` }}
                className="w-8 h-8 rounded-lg" 
                alt=""
              />
              <span className="text-xs font-black text-white uppercase tracking-wider truncate">{selectedAudit.companyName}</span>
            </div>
            <div className="space-y-1 relative z-10">
              {auditSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => onTabChange(section.id)}
                  className={`w-full flex items-center px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                    activeTab === section.id ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <i className={`fa-solid ${section.icon} w-5 ${activeTab === section.id ? 'text-white' : 'text-slate-600'}`}></i>
                  {section.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-8 py-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Historical Archive</h2>
          <div className="flex items-center space-x-2">
            {onPrintAll && audits.length > 0 && (
              <button 
                onClick={onPrintAll} 
                className="text-[10px] text-rose-500 hover:text-rose-400 font-black uppercase tracking-widest transition-colors mr-1"
                title="Export all audits to PDF"
              >
                Export
              </button>
            )}
            <span className="text-[10px] font-black bg-white/5 px-2 py-0.5 rounded border border-white/10 text-slate-400">{audits.length}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          {audits.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-white/5 text-center">
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest italic">Vault Empty</p>
            </div>
          ) : (
            audits.map((audit) => (
              <button
                key={audit.id}
                onClick={() => onSelectAudit(audit.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all group truncate ${
                  selectedId === audit.id && currentView === AppView.AUDIT_DETAIL ? 'bg-indigo-600/10 text-white border border-indigo-500/20' : 'hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <img 
                  src={`https://logo.clearbit.com/${audit.domain}`} 
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${audit.companyName}&background=4f46e5&color=fff` }}
                  className="w-5 h-5 rounded mr-3 opacity-60 group-hover:opacity-100 transition-opacity" 
                  alt=""
                />
                <span className="truncate">{audit.companyName}</span>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="p-8 border-t border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-xs font-black text-white shadow-lg">
              MA
            </div>
            <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-white truncate">Operator 01</p>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">Status: Operational</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
