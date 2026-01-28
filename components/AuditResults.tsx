import React from 'react';
import { AuditResult } from '../types';
import SWOTCard from './SWOTCard';
import Battlecard from './Battlecard';
import FeatureMatrix from './FeatureMatrix';
import ReviewAnalysis from './ReviewAnalysis';
import TechStack from './TechStack';

interface AuditResultsProps {
  audit: AuditResult;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onPrint?: () => void;
  hideTabs?: boolean;
}

const AuditResults: React.FC<AuditResultsProps> = ({ audit, activeTab, onTabChange, onPrint, hideTabs = false }) => {
  const tabs = [
    { id: 'overview', label: 'Summary' },
    { id: 'vision', label: 'Tactical Visual' },
    { id: 'battlecard', label: 'Battlecard' },
    { id: 'features', label: 'Features' },
    { id: 'sentiment', label: 'Sentiment' },
    { id: 'tech', label: 'Tech Stack' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-8">
      {/* Hero Visual Section */}
      {audit.visualUrl && (
        <div className="relative w-full h-64 md:h-80 rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl mb-8 group">
          <img src={audit.visualUrl} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" alt="Strategic Visual" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute bottom-10 left-10">
            <div className="flex items-center space-x-3 mb-2">
                <div className="h-1 w-8 bg-indigo-500 rounded-full"></div>
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Strategic Vector 01</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">{audit.companyName}</h1>
            <p className="text-slate-400 font-bold text-sm tracking-widest uppercase mt-1 opacity-70">{audit.industry} Intelligence Report</p>
          </div>
        </div>
      )}

      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800 pb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-black border border-slate-800 rounded-xl flex items-center justify-center p-2">
            <img 
              src={`https://logo.clearbit.com/${audit.domain}`} 
              className="w-full h-full object-contain rounded-md"
              onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${audit.companyName}&background=000&color=fff` }}
              alt={audit.companyName}
            />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold text-white tracking-tight">{audit.companyName}</h2>
              <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {audit.industry}
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium mono mt-1">{audit.domain}</p>
          </div>
        </div>

        <div className="flex space-x-3">
          {!hideTabs && onPrint && (
             <button 
               onClick={onPrint}
               className="px-4 py-2 bg-black border border-slate-800 text-white rounded-md text-xs font-semibold hover:bg-slate-900 transition-all flex items-center no-print"
             >
               <i className="fa-solid fa-download mr-2 text-slate-500"></i>
               Export Report
             </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      {!hideTabs && (
        <div className="flex space-x-6 border-b border-slate-800 sticky top-14 bg-black z-30">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-3 text-sm font-medium transition-all relative ${
                activeTab === tab.id 
                ? 'text-white' 
                : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Content Area */}
      <div className="mt-8">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="bg-black border border-slate-800 rounded-xl overflow-hidden">
               <div className="bg-[#0a0a0a] px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Strategic Briefing</h3>
               </div>
               <div className="p-8">
                  <p className="text-slate-300 text-lg leading-relaxed font-medium tracking-tight">
                    {audit.summary}
                  </p>
               </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SWOTCard swot={audit.swot} />
              <div className="space-y-8">
                <TechStack stack={audit.techStack} />
                <div className="bg-white text-black p-8 rounded-xl">
                   <p className="text-[10px] font-bold uppercase tracking-widest mb-4 opacity-50">High-Impact Recommendation</p>
                   <p className="text-lg font-bold italic leading-snug">
                     "{audit.battlecard.howToWin[0]}"
                   </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vision' && (
           <div className="space-y-8 animate-in zoom-in-95 duration-500">
             <div className="bg-black border border-slate-800 rounded-[2.5rem] p-4 overflow-hidden shadow-2xl">
               <img src={audit.visualUrl} className="w-full rounded-[2rem] shadow-inner" alt="Strategic Visual Large" />
             </div>
             <div className="glass p-10 rounded-[2rem] border-white/5 text-center">
                <p className="text-slate-400 font-medium italic text-lg leading-relaxed">
                  "Visualizing the competitive landscape to uncover hidden operational vectors in the {audit.industry} space."
                </p>
             </div>
           </div>
        )}

        {activeTab === 'battlecard' && <Battlecard data={audit.battlecard} companyName={audit.companyName} />}
        {activeTab === 'features' && <FeatureMatrix features={audit.featureGap} />}
        {activeTab === 'sentiment' && <ReviewAnalysis sentiment={audit.sentiment} />}
        {activeTab === 'tech' && <TechStack stack={audit.techStack} isLarge />}
      </div>
    </div>
  );
};

export default AuditResults;