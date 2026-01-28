import React from 'react';
import { SWOTData } from '../types';

interface SWOTCardProps {
  swot: SWOTData;
}

const SWOTCard: React.FC<SWOTCardProps> = ({ swot }) => {
  const sections = [
    { title: 'Strengths', data: swot.strengths, status: 'positive' },
    { title: 'Weaknesses', data: swot.weaknesses, status: 'negative' },
    { title: 'Opportunities', data: swot.opportunities, status: 'neutral' },
    { title: 'Threats', data: swot.threats, status: 'alert' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sections.map((section) => (
        <div 
          key={section.title} 
          className="bg-black border border-slate-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-900">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">{section.title}</h3>
            <span className={`w-2 h-2 rounded-full ${
              section.status === 'positive' ? 'bg-emerald-500' : 
              section.status === 'negative' ? 'bg-rose-500' : 
              section.status === 'neutral' ? 'bg-sky-500' : 'bg-amber-500'
            }`}></span>
          </div>
          <ul className="space-y-3">
            {section.data.map((item, i) => (
              <li key={i} className="flex items-start text-xs font-medium leading-relaxed text-slate-300">
                <span className="mt-1.5 w-1 h-1 bg-slate-700 rounded-full mr-3 shrink-0"></span>
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