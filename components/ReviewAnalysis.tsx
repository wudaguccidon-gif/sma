import React from 'react';
import { SentimentAnalysis } from '../types';

interface ReviewAnalysisProps {
  sentiment: SentimentAnalysis[];
}

const ReviewAnalysis: React.FC<ReviewAnalysisProps> = ({ sentiment }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {sentiment.map((s, i) => (
        <div key={i} className="glass p-10 rounded-[2.5rem] border-white/5 shadow-2xl flex flex-col group hover:border-indigo-500/20 transition-all">
          <div className="flex items-center justify-between mb-10">
            <h4 className="text-xl font-black text-white uppercase tracking-tight">{s.category}</h4>
            <div className="flex items-center space-x-4">
              <div className="h-2 w-32 bg-white/5 rounded-full overflow-hidden flex shadow-inner">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${s.score > 70 ? 'bg-emerald-500' : s.score > 40 ? 'bg-amber-500' : 'bg-rose-500 shadow-rose-500/50'}`}
                  style={{ width: `${s.score}%` }}
                ></div>
              </div>
              <span className={`text-lg font-black tracking-tighter ${s.score > 70 ? 'text-emerald-400' : s.score > 40 ? 'text-amber-400' : 'text-rose-400'}`}>
                {s.score}%
              </span>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-6">
                <div className="h-1 w-4 bg-indigo-500 rounded-full"></div>
                <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Customer Pain Points</h5>
            </div>
            <div className="space-y-4">
              {s.gripes.map((gripe, j) => (
                <div key={j} className="flex items-start space-x-5 p-6 bg-white/5 rounded-3xl border border-white/5 group-hover:bg-white/[0.08] transition-all">
                  <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-2xl">
                    <i className="fa-solid fa-face-frown-open text-slate-500 group-hover:text-rose-400 transition-colors"></i>
                  </div>
                  <p className="text-sm text-slate-300 font-bold leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">
                    "{gripe}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      
      <div className="md:col-span-2 bg-gradient-to-br from-indigo-700 to-purple-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl glow-indigo border border-white/10 group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] -mr-48 -mt-48 group-hover:bg-white/20 transition-all duration-1000"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="grid grid-cols-12 gap-1 w-full h-full">
            {Array.from({length: 48}).map((_, i) => (
              <div key={i} className="border border-white/20 aspect-square"></div>
            ))}
          </div>
        </div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center space-x-4 mb-6">
             <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-indigo-700 shadow-2xl">
                <i className="fa-solid fa-brain text-xl"></i>
             </div>
             <h3 className="text-3xl font-black tracking-tight">Executive Recommendation</h3>
          </div>
          <p className="text-indigo-50 text-xl leading-relaxed opacity-90 mb-10 font-bold tracking-tight">
            Our sentiment forensics identify critical dissatisfaction in <span className="underline decoration-indigo-400 underline-offset-8 decoration-4">{sentiment[0]?.category}</span>. 
            Leverage this signal: In your next campaign, emphasize <span className="text-white font-black">Reliability and User Happiness</span> in this specific domain to force a tactical wedge.
          </p>
          <button className="bg-white text-slate-950 px-10 py-4 rounded-2xl font-black hover:bg-indigo-50 transition-all shadow-2xl flex items-center active:scale-95">
            Initialize Response Campaign
            <i className="fa-solid fa-bolt ml-3 text-indigo-600"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewAnalysis;