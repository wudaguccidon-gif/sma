
import React from 'react';
import { SentimentAnalysis } from '../types';

interface ReviewAnalysisProps {
  sentiment: SentimentAnalysis[];
}

const ReviewAnalysis: React.FC<ReviewAnalysisProps> = ({ sentiment }) => {
  return (
    <div className="space-y-10 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sentiment.map((s, i) => (
          <div key={i} className="bg-black border border-slate-800 p-8 rounded-[2rem] shadow-2xl flex flex-col group hover:border-indigo-500/40 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-2xl -mr-12 -mt-12 group-hover:bg-indigo-500/10 transition-all"></div>
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <h4 className="text-lg font-black text-white uppercase tracking-tight truncate pr-4">{s.category}</h4>
              <span className={`text-xl font-black tracking-tighter ${s.score > 70 ? 'text-emerald-400' : s.score > 40 ? 'text-amber-400' : 'text-rose-400'}`}>
                {s.score}%
              </span>
            </div>
            
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden mb-8 relative z-10">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out ${s.score > 70 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : s.score > 40 ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'}`}
                style={{ width: `${s.score}%` }}
              ></div>
            </div>
            
            <div className="flex-1 relative z-10">
              <div className="flex items-center space-x-2 mb-4">
                  <div className="h-0.5 w-4 bg-indigo-500 rounded-full"></div>
                  <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Critical Intel</h5>
              </div>
              <div className="space-y-3">
                {s.gripes.map((gripe, j) => (
                  <div key={j} className="flex items-start space-x-3 p-4 bg-slate-950 rounded-xl border border-slate-900 group-hover:border-slate-800 transition-all">
                    <i className="fa-solid fa-triangle-exclamation text-[10px] mt-1 text-slate-600 group-hover:text-rose-500/70 transition-colors"></i>
                    <p className="text-[11px] text-slate-400 font-bold leading-relaxed italic">
                      "{gripe}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-gradient-to-br from-slate-900 to-black rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl border border-slate-800 group">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] -mr-64 -mt-64 group-hover:opacity-100 opacity-50 transition-opacity"></div>
        
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-10">
          <div className="max-w-4xl">
            <div className="flex items-center space-x-4 mb-6">
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-black shadow-2xl">
                  <i className="fa-solid fa-brain text-xl"></i>
               </div>
               <h3 className="text-3xl font-black tracking-tight uppercase italic">Neural Synthesis Result</h3>
            </div>
            <p className="text-slate-300 text-2xl leading-relaxed font-bold tracking-tight">
              Sentiment forensics highlight critical dissatisfaction vectors. 
              Deploy <span className="text-indigo-400 underline decoration-indigo-500/50 underline-offset-8">asymmetric marketing tactics</span> to capitalize on competitor churn signals.
            </p>
          </div>
          <button className="whitespace-nowrap bg-white text-black px-10 py-5 rounded-2xl font-black hover:bg-indigo-50 transition-all shadow-2xl flex items-center group-hover:scale-105 active:scale-95 text-xs uppercase tracking-[0.2em]">
            Export Strategy Paper
            <i className="fa-solid fa-arrow-right ml-4 text-indigo-600"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewAnalysis;
