
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
        <div className="flex items-center space-x-3 md:space-x-6">
          <button onClick={toggleMenu} className="lg:hidden p-2 text-slate-400">
            <i className="fa-solid fa-bars"></i>
          </button>
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView(AppView.DASHBOARD)}>
            <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center hidden xs:flex">
              <i className="fa-solid fa-triangle text-black text-[10px] transform rotate-180"></i>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2">
              <span className="text-sm font-semibold tracking-tight text-white">CompeteAI</span>
              <span className="text-slate-800 hidden xs:inline">/</span>
              <span className="text-xs font-medium text-slate-500 hidden sm:inline">Strategic Audit</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="hidden md:flex items-center space-x-2 mr-4">
            <span className="h-2 w-2 bg-emerald-500 rounded-full"></span>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Ready</span>
          </div>
          
          <button 
            onClick={onNewAudit}
            className="px-2.5 py-1.5 bg-white text-black rounded-md font-bold text-[10px] sm:text-xs hover:bg-slate-200 transition-all active:scale-95 shadow-sm uppercase tracking-tight"
          >
            New Audit
          </button>
          
          <div className="h-7 w-7 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
             <i className="fa-solid fa-user text-[10px] text-slate-400"></i>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
