
import React from 'react';
import { SWOTData } from '../types';

interface SWOTCardProps {
  swot: SWOTData;
}

const SWOTCard: React.FC<SWOTCardProps> = ({ swot }) => {
  const sections = [
    { title: 'Strengths', data: swot.strengths, color: 'emerald', icon: 'fa-shield-check' },
    { title: 'Weaknesses', data: swot.weaknesses, color: 'rose', icon: 'fa-bolt' },
    { title: 'Opportunities', data: swot.opportunities, color: 'indigo', icon: 'fa-star' },
    { title: 'Threats', data: swot.threats, color: 'amber', icon: 'fa-triangle-exclamation' },
  ];

  const getColorClasses = (color: string) => {
    switch(color) {
      case 'emerald': return 'border-emerald-500/20 text-emerald-400 shadow-emerald-500/5';
      case 'rose': return 'border-rose-500/20 text-rose-400 shadow-rose-500/5';
      case 'indigo': return 'border-indigo-500/20 text-indigo-400 shadow-indigo-500/5';
      case 'amber': return 'border-amber-500/20 text-amber-400 shadow-amber-500/5';
      default: return 'border-white/10 text-white';
    }
  };

  const getBulletColor = (color: string) => {
    switch(color) {
      case 'emerald': return 'bg-emerald-500';
      case 'rose': return 'bg-rose-500';
      case 'indigo': return 'bg-indigo-500';
      case 'amber': return 'bg-amber-500';
      default: return 'bg-white';
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {sections.map((section) => (
        <div 
          key={section.title} 
          className={`glass p-8 rounded-[2rem] border transition-all duration-500 hover:border-white/20 hover:scale-[1.02] shadow-2xl ${getColorClasses(section.color)}`}
        >
          <div className="flex items-center mb-6">
            <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mr-4 shadow-xl ${section.color === 'indigo' ? 'glow-indigo' : ''}`}>
                <i className={`fa-solid ${section.icon} text-lg`}></i>
            </div>
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">{section.title}</h3>
          </div>
          <ul className="space-y-4">
            {section.data.map((item, i) => (
              <li key={i} className="flex items-start text-sm font-medium leading-relaxed text-slate-300">
                <span className={`mt-2 w-2 h-2 rounded-full mr-4 flex-shrink-0 opacity-80 ${getBulletColor(section.color)}`}></span>
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
