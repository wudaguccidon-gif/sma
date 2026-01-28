import React from 'react';
import { AppView } from '../types';

interface NavbarProps {
  onNewAudit: () => void;
  setView: (view: AppView) => void;
  toggleMenu: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNewAudit, setView, toggleMenu }) => {
  return (
    <header className="bg-black border-b border-slate-800 z-40 sticky top-0 h-14">
      <div className="px-4 h-full flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView(AppView.DASHBOARD)}>
            <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
              <i className="fa-solid fa-triangle text-black text-[10px] transform rotate-180"></i>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold tracking-tight text-white">CompeteAI</span>
              <span className="text-slate-700">/</span>
              <span className="text-sm font-medium text-slate-400">Strategic Audit</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 mr-4">
            <span className="h-2 w-2 bg-emerald-500 rounded-full"></span>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Ready</span>
          </div>
          
          <button 
            onClick={onNewAudit}
            className="px-3 py-1.5 bg-white text-black rounded-md font-semibold text-xs hover:bg-slate-200 transition-all active:scale-95 shadow-sm"
          >
            Create New Audit
          </button>
          
          <div className="h-6 w-6 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
             <i className="fa-solid fa-user text-[10px] text-slate-400"></i>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;