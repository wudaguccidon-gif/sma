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
      <div className="px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button 
            onClick={toggleMenu} 
            className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
          >
            <i className="fa-solid fa-bars-staggered text-lg"></i>
          </button>

          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setView(AppView.DASHBOARD)}>
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20">
              <i className="fa-solid fa-bolt text-white text-sm"></i>
            </div>
            <div>
              <h1 className="text-lg font-black text-white tracking-tight leading-none">CompeteAI</h1>
              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] mt-1 block">Strategic Intelligence</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-4 pr-6 border-r border-white/5">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center">
                <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                System Live
              </span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mt-0.5">Latency: 24ms</span>
            </div>
          </div>
          
          <button 
            onClick={onNewAudit}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-xs hover:bg-indigo-500 transition-all active:scale-95 shadow-xl shadow-indigo-600/20 uppercase tracking-widest"
          >
            Initialize Probe
          </button>
          
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-white/10 overflow-hidden shadow-xl">
              <img src="https://picsum.photos/seed/tech/100/100" className="w-full h-full object-cover" alt="User" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;