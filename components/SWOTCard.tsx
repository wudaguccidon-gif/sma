
import React from 'react';
import { SWOTData } from '../types';

interface SWOTCardProps {
  swot: SWOTData;
}

const SWOTCard: React.FC<SWOTCardProps> = ({ swot }) => {
  const sections = [
    { title: 'Strengths', data: swot.strengths, status: 'positive', icon: 'fa-plus' },
    { title: 'Weaknesses', data: swot.weaknesses, status: 'negative', icon: 'fa-minus' },
    { title: 'Opportunities', data: swot.opportunities, status: 'neutral', icon: 'fa-arrow-trend-up' },
    { title: 'Threats', data: swot.threats, status: 'alert', icon: 'fa-shield-virus' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {sections.map((section) => (
        <div 
          key={section.title} 
          className="bg-black border border-slate-800 rounded-3xl p-6 group hover:border-slate-700 transition-all relative overflow-hidden h-full flex flex-col"
        >
          {/* Subtle background icon */}
          <div className="absolute -bottom-4 -right-4 text-slate-900 opacity-20 transform -rotate-12 transition-transform group-hover:rotate-0">
             <i className={`fa-solid ${section.icon} text-6xl`}></i>
          </div>

          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-900 relative z-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{section.title}</h3>
            <span className={`w-2.5 h-2.5 rounded-full ${
              section.status === 'positive' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 
              section.status === 'negative' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 
              section.status === 'neutral' ? 'bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
            }`}></span>
          </div>
          <ul className="space-y-4 relative z-10 flex-1">
            {section.data.map((item, i) => (
              <li key={i} className="flex items-start text-[11px] font-bold leading-relaxed text-slate-300 group-hover:text-white transition-colors">
                <span className={`mt-1.5 w-1.5 h-1.5 rounded-sm mr-4 shrink-0 transition-colors ${
                    section.status === 'positive' ? 'bg-emerald-800 group-hover:bg-emerald-500' : 
                    section.status === 'negative' ? 'bg-rose-800 group-hover:bg-rose-500' : 
                    section.status === 'neutral' ? 'bg-sky-800 group-hover:bg-sky-500' : 'bg-amber-800 group-hover:bg-amber-500'
                }`}></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SWOTCard;
