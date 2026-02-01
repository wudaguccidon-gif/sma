
import React, { useState } from 'react';
import { AuditResult } from '../types';
import SWOTCard from './SWOTCard';
import Battlecard from './Battlecard';
import FeatureMatrix from './FeatureMatrix';
import ReviewAnalysis from './ReviewAnalysis';
import TechStack from './TechStack';
import { generateBriefingAudio } from '../services/geminiService';

interface AuditResultsProps {
  audit: AuditResult;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onPrint?: () => void;
  hideTabs?: boolean;
}

const AuditResults: React.FC<AuditResultsProps> = ({ audit, activeTab, onTabChange, onPrint, hideTabs = false }) => {
  const [currentAudit, setCurrentAudit] = useState(audit);
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Summary' },
    { id: 'battlecard', label: 'Strategy' },
    { id: 'features', label: 'Matrix' },
    { id: 'sentiment', label: 'Sentiment' },
    { id: 'tech', label: 'Tech' },
  ];

  const handleAudioBriefing = async () => {
    if (currentAudit.audioUrl) return;
    setIsAudioLoading(true);
    try {
        const url = await generateBriefingAudio(currentAudit.summary);
        setCurrentAudit(prev => ({ ...prev, audioUrl: url }));
    } catch (e) {
        console.error("Audio generation failed", e);
    } finally {
        setIsAudioLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4 md:space-y-6 py-2 md:py-4">
      {currentAudit.visualUrl && (
        <div className="relative w-full h-40 md:h-80 rounded-2xl md:rounded-3xl overflow-hidden border border-slate-800 shadow-2xl mb-4 md:mb-6 group">
          <img src={currentAudit.visualUrl} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105" alt="Strategic Visual" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute bottom-4 left-4 md:bottom-6 md:left-8 flex items-end space-x-3 md:space-x-6">
            <div className="w-14 h-14 md:w-28 md:h-28 bg-black/80 backdrop-blur-md border border-slate-700 p-1.5 md:p-2 rounded-xl md:rounded-2xl shadow-2xl shrink-0">
                <img 
                  src={`https://logo.clearbit.com/${currentAudit.domain}`} 
                  className="w-full h-full object-contain rounded-lg"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${currentAudit.companyName}&background=000&color=fff` }}
                  alt={currentAudit.companyName}
                />
            </div>
            <div className="pb-1">
                <h1 className="text-xl md:text-5xl font-black text-white tracking-tighter uppercase leading-tight md:leading-none truncate max-w-[200px] sm:max-w-none">{currentAudit.companyName}</h1>
                <p className="text-indigo-400 font-black text-[8px] md:text-xs tracking-[0.2em] md:tracking-[0.4em] uppercase mt-1 md:mt-3">Sector: {currentAudit.industry}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-800 pb-4 md:pb-6">
        <div className="flex flex-wrap gap-1.5 md:gap-2">
            <span className="px-2 py-0.5 md:px-3 md:py-1 bg-slate-900 border border-slate-800 rounded-full text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">{currentAudit.domain}</span>
            <span className="px-2 py-0.5 md:px-3 md:py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[8px] md:text-[9px] font-black text-indigo-400 uppercase tracking-widest">Signal: Opt</span>
        </div>

        <div className="flex space-x-2 w-full sm:w-auto">
          <button 
            onClick={handleAudioBriefing}
            disabled={isAudioLoading}
            className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 text-white rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center justify-center shadow-lg shadow-indigo-500/10 active:scale-95"
          >
            {isAudioLoading ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : <i className="fa-solid fa-volume-high mr-2"></i>}
            {currentAudit.audioUrl ? 'Briefing Active' : 'Start Intel'}
          </button>
          {!hideTabs && onPrint && (
             <button 
               onClick={onPrint}
               className="flex-1 sm:flex-none px-4 py-2 bg-white text-black rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
             >
               Export
             </button>
          )}
        </div>
      </div>

      {currentAudit.audioUrl && (
          <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-xl md:rounded-2xl p-3 md:p-4 flex items-center space-x-4 md:space-x-6 animate-in slide-in-from-top-4">
             <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-xl shrink-0">
                <i className="fa-solid fa-waveform text-xs md:text-base"></i>
             </div>
             <div className="flex-1 min-w-0">
                <audio src={currentAudit.audioUrl} controls className="w-full h-7 md:h-8 custom-audio" />
             </div>
          </div>
      )}

      {!hideTabs && (
        <div className="flex space-x-6 md:space-x-8 border-b border-slate-800 sticky top-14 bg-black z-30 w-full overflow-x-auto no-scrollbar scroll-smooth">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-3 md:py-4 text-[9px] md:text-[11px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap shrink-0 ${
                activeTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-[2px] md:h-[3px] bg-indigo-500 shadow-[0_-4px_10px_rgba(99,102,241,0.5)]"></div>}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 md:mt-8 pb-10 md:pb-20 w-full">
        {activeTab === 'overview' && (
          <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 w-full">
            <div className="bg-slate-950/50 border border-slate-800 rounded-2xl md:rounded-3xl p-6 md:p-10 relative overflow-hidden group w-full">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/50 group-hover:w-full group-hover:opacity-5 transition-all duration-700"></div>
                <div className="flex items-center space-x-2 md:space-x-3 mb-4 md:mb-6">
                    <div className="h-0.5 w-4 md:w-6 bg-indigo-500 rounded-full"></div>
                    <span className="text-[8px] md:text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] md:tracking-[0.4em]">Forensic Summary</span>
                </div>
                <p className="text-slate-200 text-base md:text-2xl leading-relaxed font-bold tracking-tight italic">
                    "{currentAudit.summary}"
                </p>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8 items-start w-full">
              <div className="xl:col-span-2 w-full">
                <SWOTCard swot={currentAudit.swot} />
              </div>
              <div className="space-y-6 md:space-y-8 w-full">
                <TechStack stack={currentAudit.techStack} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'battlecard' && <div className="animate-in slide-in-from-bottom-4 duration-500 w-full"><Battlecard data={currentAudit.battlecard} companyName={currentAudit.companyName} /></div>}
        {activeTab === 'features' && <div className="animate-in fade-in duration-500 w-full"><FeatureMatrix features={currentAudit.featureGap} /></div>}
        {activeTab === 'sentiment' && <div className="animate-in fade-in duration-500 w-full"><ReviewAnalysis sentiment={currentAudit.sentiment} /></div>}
        {activeTab === 'tech' && <div className="animate-in fade-in duration-500 w-full"><TechStack stack={currentAudit.techStack} isLarge /></div>}
      </div>
    </div>
  );
};

export default AuditResults;
