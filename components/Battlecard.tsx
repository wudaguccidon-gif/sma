
import React from 'react';
import { BattlecardData } from '../types';

interface BattlecardProps {
  data: BattlecardData;
  companyName: string;
}

const Battlecard: React.FC<BattlecardProps> = ({ data, companyName }) => {
  if (!data) return <div className="p-10 text-center text-slate-500">Battlecard data currently unavailable.</div>;

  return (
    <div className="space-y-6 md:space-y-10 w-full">
      <div className="glass rounded-[2rem] md:rounded-[3rem] p-6 md:p-16 border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] -mr-64 -mt-64"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6 md:mb-8">
            <div className="w-8 md:w-12 h-0.5 md:h-1 bg-indigo-500 rounded-full"></div>
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-indigo-400">Classified Sales Intelligence</span>
          </div>
          
          <h2 className="text-2xl md:text-7xl font-black mb-8 md:mb-16 tracking-tighter text-white">
            Offensive Strategy: <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">{companyName}</span>
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
            <div className="space-y-8 md:space-y-12">
              <div>
                <h3 className="text-xl md:text-2xl font-black mb-6 md:mb-8 text-emerald-400 flex items-center uppercase tracking-tight">
                  <i className="fa-solid fa-bolt-lightning mr-3 md:mr-4"></i>
                  Win Sequences
                </h3>
                <div className="space-y-4 md:space-y-6">
                  {data.howToWin?.length > 0 ? data.howToWin.map((point, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-4 md:p-6 rounded-2xl md:rounded-3xl hover:bg-white/10 transition-all group">
                      <div className="flex items-center mb-1 md:mb-2">
                        <span className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Tactic {i+1}</span>
                      </div>
                      <p className="text-slate-200 leading-relaxed font-bold text-base md:text-lg">"{point}"</p>
                    </div>
                  )) : (
                    <p className="text-slate-500 italic text-xs">Target specific win strategies pending...</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-8 md:space-y-12">
              <div>
                <h3 className="text-xl md:text-2xl font-black mb-6 md:mb-8 text-rose-400 flex items-center uppercase tracking-tight">
                  <i className="fa-solid fa-shield-halved mr-3 md:mr-4"></i>
                  Counter-Arguments
                </h3>
                <div className="space-y-3 md:space-y-4">
                  {data.commonObjections?.length > 0 ? data.commonObjections.map((objection, i) => (
                    <div key={i} className="flex items-start space-x-3 md:space-x-4 p-4 md:p-5 bg-slate-900/50 rounded-xl md:rounded-2xl border border-white/5 hover:border-rose-500/20 transition-colors">
                      <span className="text-rose-500 font-black text-[10px] mt-1 uppercase tracking-widest shrink-0">Obj:</span>
                      <p className="text-xs md:text-sm text-slate-400 font-bold italic leading-relaxed">"{objection}"</p>
                    </div>
                  )) : (
                    <p className="text-slate-500 italic text-xs">No common objections identified.</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-black mb-6 md:mb-8 text-sky-400 flex items-center uppercase tracking-tight">
                  <i className="fa-solid fa-comment-dots mr-3 md:mr-4"></i>
                  Discovery Hooks
                </h3>
                <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl">
                  <ul className="space-y-4 md:space-y-6">
                    {data.discoveryQuestions?.length > 0 ? data.discoveryQuestions.map((q, i) => (
                      <li key={i} className="flex items-start group">
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center mr-3 md:mr-4 mt-0.5 group-hover:bg-indigo-500 transition-colors shrink-0">
                            <i className="fa-solid fa-chevron-right text-[8px] md:text-[10px] text-indigo-400 group-hover:text-white"></i>
                        </div>
                        <span className="text-xs md:text-sm text-indigo-50 font-black tracking-tight leading-relaxed">{q}</span>
                      </li>
                    )) : (
                      <p className="text-slate-500 italic text-xs">Analyzing target discovery vectors...</p>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="glass p-6 md:p-12 rounded-2xl md:rounded-[2.5rem] border-white/5 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-0.5 md:h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
        <h4 className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] md:tracking-[0.4em] mb-4 md:mb-6">Strategic Forensic Analysis</h4>
        <p className="text-slate-300 w-full max-w-5xl mx-auto italic text-base md:text-xl font-medium leading-relaxed tracking-tight">
          "{companyName} typically anchors on legacy reliability. Disrupt this by emphasizing your <span className="text-indigo-400 font-black">Velocity of Innovation</span>. Pivot the prospect toward the technical debt hidden within legacy platforms."
        </p>
      </div>
    </div>
  );
};

export default Battlecard;
