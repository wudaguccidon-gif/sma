
import React, { useState } from 'react';
import { AuditResult } from '../types';
import SWOTCard from './SWOTCard';
import Battlecard from './Battlecard';
import FeatureMatrix from './FeatureMatrix';
import ReviewAnalysis from './ReviewAnalysis';
import TechStack from './TechStack';
import VideoBriefing from './VideoBriefing';
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
    { id: 'media', label: 'Visual Intel' },
    { id: 'battlecard', label: 'Offense Strategy' },
    { id: 'features', label: 'Feature Matrix' },
    { id: 'sentiment', label: 'Sentiment' },
    { id: 'tech', label: 'Tech Stack' },
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

  const handleVideoGenerated = (url: string) => {
      const updatedAudit = { ...currentAudit, videoUrl: url };
      setCurrentAudit(updatedAudit);
      const saved = localStorage.getItem('competeai_audits');
      if (saved) {
          const audits = JSON.parse(saved);
          const index = audits.findIndex((a: any) => a.id === audit.id);
          if (index !== -1) {
              audits[index] = updatedAudit;
              localStorage.setItem('competeai_audits', JSON.stringify(audits));
          }
      }
  };

  return (
    <div className="w-full space-y-6 py-4">
      {/* Expanded Hero Section - Full Bleed Potential */}
      {currentAudit.visualUrl && (
        <div className="relative w-full h-48 md:h-80 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl mb-6 group">
          <img src={currentAudit.visualUrl} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105" alt="Strategic Visual" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
          <div className="absolute bottom-6 left-8 flex items-end space-x-6">
            <div className="w-20 h-20 md:w-28 md:h-28 bg-black/80 backdrop-blur-md border border-slate-700 p-2 rounded-2xl shadow-2xl">
                <img 
                  src={`https://logo.clearbit.com/${currentAudit.domain}`} 
                  className="w-full h-full object-contain rounded-lg"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${currentAudit.companyName}&background=000&color=fff` }}
                  alt={currentAudit.companyName}
                />
            </div>
            <div className="pb-2">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">{currentAudit.companyName}</h1>
                <p className="text-indigo-400 font-black text-[10px] md:text-xs tracking-[0.4em] uppercase mt-3">Sector Analysis: {currentAudit.industry}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-slate-800 pb-6">
        <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest">Target: {currentAudit.domain}</span>
            <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[9px] font-black text-indigo-400 uppercase tracking-widest">Signal: Optimal</span>
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black text-emerald-500 uppercase tracking-widest">Status: Classified</span>
        </div>

        <div className="flex space-x-3">
          <button 
            onClick={handleAudioBriefing}
            disabled={isAudioLoading}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center shadow-lg shadow-indigo-500/10 active:scale-95"
          >
            {isAudioLoading ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : <i className="fa-solid fa-volume-high mr-2"></i>}
            {currentAudit.audioUrl ? 'Briefing Active' : 'Start Audio Intel'}
          </button>
          {!hideTabs && onPrint && (
             <button 
               onClick={onPrint}
               className="px-5 py-2.5 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
             >
               Export PDF
             </button>
          )}
        </div>
      </div>

      {currentAudit.audioUrl && (
          <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-2xl p-4 flex items-center space-x-6 animate-in slide-in-from-top-4">
             <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
                <i className="fa-solid fa-waveform"></i>
             </div>
             <div className="flex-1">
                <audio src={currentAudit.audioUrl} controls className="w-full h-8 custom-audio" />
             </div>
          </div>
      )}

      {/* Navigation */}
      {!hideTabs && (
        <div className="flex space-x-8 border-b border-slate-800 sticky top-14 bg-black z-30 w-full overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-4 text-[11px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${
                activeTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-indigo-500 shadow-[0_-4px_10px_rgba(99,102,241,0.5)]"></div>}
            </button>
          ))}
        </div>
      )}

      {/* Expanded Content Area */}
      <div className="mt-8 pb-20 w-full">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-500 w-full">
            <div className="bg-slate-950/50 border border-slate-800 rounded-3xl p-10 relative overflow-hidden group w-full">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/50 group-hover:w-full group-hover:opacity-5 transition-all duration-700"></div>
                <div className="flex items-center space-x-3 mb-6">
                    <div className="h-1 w-6 bg-indigo-500 rounded-full"></div>
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Forensic Summary</span>
                </div>
                <p className="text-slate-200 text-xl md:text-2xl leading-relaxed font-bold tracking-tight italic">
                    "{currentAudit.summary}"
                </p>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start w-full">
              <div className="xl:col-span-2 w-full">
                <SWOTCard swot={currentAudit.swot} />
              </div>
              <div className="space-y-8 w-full">
                <TechStack stack={currentAudit.techStack} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'media' && <div className="animate-in fade-in duration-500 w-full"><VideoBriefing audit={currentAudit} onVideoGenerated={handleVideoGenerated} /></div>}
        {activeTab === 'battlecard' && <div className="animate-in slide-in-from-bottom-4 duration-500 w-full"><Battlecard data={currentAudit.battlecard} companyName={currentAudit.companyName} /></div>}
        {activeTab === 'features' && <div className="animate-in fade-in duration-500 w-full"><FeatureMatrix features={currentAudit.featureGap} /></div>}
        {activeTab === 'sentiment' && <div className="animate-in fade-in duration-500 w-full"><ReviewAnalysis sentiment={currentAudit.sentiment} /></div>}
        {activeTab === 'tech' && <div className="animate-in fade-in duration-500 w-full"><TechStack stack={currentAudit.techStack} isLarge /></div>}
      </div>
    </div>
  );
};

export default AuditResults;
