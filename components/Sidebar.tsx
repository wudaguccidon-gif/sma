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
  return (
    <div className="w-full lg:w-64 bg-black h-full flex flex-col border-r border-slate-800">
      <div className="p-6">
        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">General</h2>
        <nav className="space-y-1">
          <button
            onClick={() => setView(AppView.DASHBOARD)}
            className={`w-full flex items-center px-3 py-2 text-xs font-semibold rounded-md transition-all ${
              currentView === AppView.DASHBOARD ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-900 hover:text-slate-300'
            }`}
          >
            <i className="fa-solid fa-table-columns w-5 text-slate-600"></i>
            Dashboard
          </button>
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Project History</h2>
          {onPrintAll && audits.length > 0 && (
            <button onClick={onPrintAll} className="text-[10px] text-slate-600 hover:text-white font-bold uppercase transition-colors">
              Archive
            </button>
          )}
        </div>
        
        <div className="space-y-1">
          {audits.map((audit) => (
            <button
              key={audit.id}
              onClick={() => onSelectAudit(audit.id)}
              className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-md transition-all group truncate ${
                selectedId === audit.id && currentView === AppView.AUDIT_DETAIL ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-900 hover:text-slate-300'
              }`}
            >
              <img 
                src={`https://logo.clearbit.com/${audit.domain}`} 
                onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${audit.companyName}&background=000&color=fff` }}
                className="w-4 h-4 rounded-sm mr-2 grayscale group-hover:grayscale-0 transition-all" 
                alt=""
              />
              <span className="truncate">{audit.companyName}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
            AI
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-white truncate uppercase tracking-tighter">Strategic Ops</p>
            <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">Active System</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;