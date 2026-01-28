
import React from 'react';
import { AppView } from '../types';

interface NavbarProps {
  onNewAudit: () => void;
  setView: (view: AppView) => void;
  toggleMenu: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNewAudit, setView, toggleMenu }) => {
  return (
    <header className="bg-slate-950/50 backdrop-blur-md border-b border-white/5 z-40 sticky top-0">
      <div className="px-6 h-14 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleMenu}
            className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
            aria-label="Toggle Menu"
          >
            <i className="fa-solid fa-bars-staggered text-lg"></i>
          </button>

          <div className="flex items-center space-x-2 cursor-pointer group" onClick={() => setView(AppView.DASHBOARD)}>
            <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
              <i className="fa-solid fa-bolt text-white text-sm"></i>
            </div>
            <h1 className="text-md font-bold text-white tracking-tight">CompeteAI</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={onNewAudit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold text-xs hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-500/10"
          >
            New Audit
          </button>
          
          <div className="flex items-center pl-4 border-l border-white/5">
            <img 
              src="https://picsum.photos/seed/tech/100/100" 
              className="w-8 h-8 rounded-full border border-white/10"
              alt="User"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
