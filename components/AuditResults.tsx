
import React, { useState, useEffect } from 'react';
import { AuditResult } from '../types';
import SWOTCard from './SWOTCard';
import Battlecard from './Battlecard';
import FeatureMatrix from './FeatureMatrix';
import ReviewAnalysis from './ReviewAnalysis';
import TechStack from './TechStack';
import { generateCompetitorImage } from '../services/geminiService';

interface AuditResultsProps {
  audit: AuditResult;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onPrint?: () => void;
  hideTabs?: boolean;
}

const AuditResults: React.FC<AuditResultsProps> = ({ audit, activeTab, onTabChange, onPrint, hideTabs = false }) => {
  const [headerImage, setHeaderImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
        // Generating a high-end corporate strategic visual
        const img = await generateCompetitorImage(`Premium corporate strategy visualization for ${audit.companyName} market intelligence, abstract 3D data flows, indigo and slate palette`);
        setHeaderImage(img);
    };
    fetchImage();
  }, [audit.id]);

  const tabs = [
    { id: 'overview', label: 'Briefing', icon: 'fa-eye' },
    { id: 'battlecard', label: 'Battlecard', icon: 'fa-crosshairs' },
    { id: 'features', label: 'Capabilities', icon: 'fa-table-cells' },
    { id: 'sentiment', label: 'Sentiment', icon: 'fa-face-smile' },
    { id: 'tech', label: 'Forensics', icon: 'fa-microchip' },
  ];

  return (
    <div className={`space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 ${hideTabs ? '' : 'pb-24'}`}>
      {/* High-End Enterprise Banner */}
      <div className="relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-slate-900 group">
        {headerImage ? (
            <img src={headerImage} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[2000ms]" alt="Audit Visual" />
        ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-900">
                <i className="fa-solid fa-circle-notch fa-spin text-indigo-500 text-4xl"></i>
            </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>
        
        {!hideTabs && onPrint && (
           <button 
             onClick={onPrint}
             className="absolute top-8 right-8 z-30 bg-white/5 hover:bg-white/20 backdrop-blur-xl text-white border border-white/20 px-6 py-2.5 rounded-2xl flex items-center transition-all shadow-2xl active:scale-95 no-print text-sm font-black uppercase tracking-widest glow-indigo"
           >
             <i className="fa-solid fa-file-pdf mr-3 text-rose-500"></i>
             Export Archive
           </button>
        )}

        <div className="absolute bottom-0 left-0 p-8 md:p-12 flex items-end space-x-8">
          <div className="p-3 bg-white rounded-3xl border border-white/20 shadow-2xl backdrop-blur-2xl relative">
             <div className="absolute inset-0 bg-indigo-600/10 blur-xl rounded-3xl"></div>
             <img 
                src={`https://logo.clearbit.com/${audit.domain}`} 
                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl relative z-10"
                onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${audit.companyName}&background=4f46e5&color=fff` }}
                alt={audit.companyName}
              />
          </div>
          <div className="mb-2">
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter text-glow">{audit.companyName}</h2>
              <span className="inline-block w-fit bg-indigo-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-xl">
                {audit.industry}
              </span>
            </div>
            <p className="text-slate-400 mt-2 flex items-center font-black text-sm uppercase tracking-widest">
              <i className="fa-solid fa-globe mr-2 text-indigo-400"></i>
              Target: {audit.domain}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      {!hideTabs && (
        <div className="hidden lg:flex space-x-2 p-2 bg-white/5 rounded-[1.5rem] border border-white/10 shadow-2xl sticky top-24 z-40 backdrop-blur-xl no-print">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center px-6 py-4 text-xs font-black uppercase tracking-[0.2em] rounded-2xl transition-all ${
                activeTab === tab.id 
                ? 'bg-white text-slate-950 shadow-2xl' 
                : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <i className={`fa-solid ${tab.icon} mr-3 text-sm ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-600'}`}></i>
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Mobile Tab Header */}
      {!hideTabs && (
        <div className="lg:hidden flex items-center justify-between px-4 no-print">
           <h3 className="text-lg font-black text-white flex items-center uppercase tracking-tight">
             <i className={`fa-solid ${tabs.find(t => t.id === activeTab)?.icon} mr-3 text-indigo-400`}></i>
             {tabs.find(t => t.id === activeTab)?.label}
           </h3>
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sector Active</span>
        </div>
      )}

      {/* Tab Content */}
      <div className={hideTabs ? 'mt-8' : 'mt-4 md:mt-10'}>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              <div className="glass p-10 rounded-[2.5rem] border-white/5">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="h-1 w-6 bg-indigo-500 rounded-full"></div>
                    <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em]">Intelligence Brief</h3>
                </div>
                <p className="text-slate-300 leading-relaxed text-xl font-medium tracking-tight">
                  {audit.summary}
                </p>
              </div>
              <SWOTCard swot={audit.swot} />
            </div>
            <div className="space-y-10">
              <TechStack stack={audit.techStack} />
              
              <div className="bg-gradient-to-br from-indigo-600 to-purple-800 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group glow-indigo border border-white/10">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                   <i className="fa-solid fa-bolt-lightning text-8xl rotate-12 group-hover:rotate-0 transition-transform duration-700"></i>
                </div>
                <h4 className="text-2xl font-black mb-4 flex items-center">
                  <i className="fa-solid fa-crosshairs mr-3"></i>
                  Killer Hook
                </h4>
                <p className="text-indigo-50 opacity-90 leading-relaxed font-bold italic text-lg">
                  "{audit.battlecard.howToWin[0]}"
                </p>
                <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Strategic Priority 01</span>
                    <i className="fa-solid fa-arrow-right text-xs opacity-60"></i>
                </div>
              </div>
              
              {audit.sourceUrls && audit.sourceUrls.length > 0 && (
                <div className="glass p-8 rounded-[2rem] border-white/5">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Data Proof Points</h4>
                  <ul className="space-y-4">
                    {audit.sourceUrls.slice(0, 5).map((url, i) => (
                      <li key={i} className="truncate">
                        <a href={url} target="_blank" rel="noreferrer" className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center no-print tracking-tight">
                          <i className="fa-solid fa-link mr-3 text-slate-600"></i>
                          {new URL(url).hostname}
                        </a>
                        <span className="hidden print:inline text-[10px] text-slate-600">{url}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
