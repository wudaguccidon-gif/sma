import React from 'react';

interface TechStackProps {
  stack: string[];
  isLarge?: boolean;
}

const TechStack: React.FC<TechStackProps> = ({ stack, isLarge = false }) => {
  return (
    <div className={`glass border-white/5 rounded-[2rem] ${isLarge ? 'p-12' : 'p-8'} shadow-2xl relative overflow-hidden group`}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/50 to-purple-500/50 opacity-40"></div>
      
      <div className="flex items-center justify-between mb-8">
        <h3 className={`${isLarge ? 'text-3xl' : 'text-xs'} font-black text-white uppercase tracking-[0.3em] flex items-center tracking-tight`}>
          <i className="fa-solid fa-microchip mr-4 text-indigo-500 group-hover:rotate-180 transition-transform duration-700"></i>
          Tech Forensics
        </h3>
        {!isLarge && (
            <span className="text-[9px] font-black text-emerald-400 border border-emerald-400/30 px-2 py-1 rounded uppercase">94% Confidence</span>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {stack.map((tech, i) => (
          <div 
            key={i} 
            className="group/tag px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:border-indigo-500/50 hover:bg-indigo-600/10 transition-all cursor-default flex items-center shadow-lg"
          >
            <span className="text-xs font-black text-slate-300 group-hover/tag:text-white uppercase tracking-widest">{tech}</span>
            <i className="fa-solid fa-shield text-[10px] ml-3 text-indigo-500 opacity-0 group-hover/tag:opacity-100 transition-all"></i>
          </div>
        ))}
      </div>
      
      {!isLarge && (
        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
           <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em]">Signal Origin: Global CDN Scans</p>
           <i className="fa-solid fa-fingerprint text-slate-700 text-xs"></i>
        </div>
      )}
      
      {isLarge && (
        <div className="mt-16 space-y-10">
          <div className="flex items-center space-x-3">
              <div className="h-1 w-4 bg-purple-500 rounded-full"></div>
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Architectural Benchmarks</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5 group/card hover:border-indigo-500/30 transition-all">
              <span className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Platform Identity</span>
              <span className="text-xl font-black text-white tracking-tight">Modern Headless</span>
              <div className="mt-4 h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full w-4/5 bg-indigo-500"></div>
              </div>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5 group/card hover:border-purple-500/30 transition-all">
              <span className="block text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2">Scalability Index</span>
              <span className="text-xl font-black text-white tracking-tight">Enterprise Tier</span>
              <div className="mt-4 h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full w-full bg-purple-500"></div>
              </div>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5 group/card hover:border-emerald-500/30 transition-all">
              <span className="block text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Innovation Velocity</span>
              <span className="text-xl font-black text-white tracking-tight">High Frequency</span>
              <div className="mt-4 h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-emerald-500"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechStack;