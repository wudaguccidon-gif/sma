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
    { id: 'media', label: 'Media Intelligence' },
    { id: 'battlecard', label: 'Battlecard' },
    { id: 'features', label: 'Features' },
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
    <div className="max-w-6xl mx-auto space-y-6 py-8">
      {/* Hero Visual Section */}
      {currentAudit.visualUrl && (
        <div className="relative w-full h-64 md:h-80 rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl mb-8 group">
          <img src={currentAudit.visualUrl} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" alt="Strategic Visual" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute bottom-10 left-10">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">{currentAudit.companyName}</h1>
            <p className="text-slate-400 font-bold text-sm tracking-widest uppercase mt-1 opacity-70">Forensic Briefing v1.0</p>
          </div>
        </div>
      )}

      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800 pb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-black border border-slate-800 rounded-xl flex items-center justify-center p-2">
            <img 
              src={`https://logo.clearbit.com/${currentAudit.domain}`} 
              className="w-full h-full object-contain rounded-md"
              onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${currentAudit.companyName}&background=000&color=fff` }}
              alt={currentAudit.companyName}
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{currentAudit.companyName}</h2>
            <p className="text-slate-500 text-sm font-medium mono mt-1">{currentAudit.domain}</p>
          </div>
        </div>

        <div className="flex space-x-3">
          <button 
            onClick={handleAudioBriefing}
            disabled={isAudioLoading}
            className="px-4 py-2 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-md text-xs font-semibold hover:bg-indigo-600/20 transition-all flex items-center"
          >
            {isAudioLoading ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : <i className="fa-solid fa-headset mr-2"></i>}
            {currentAudit.audioUrl ? 'Narrator Active' : 'Start Audio Briefing'}
          </button>
          {!hideTabs && onPrint && (
             <button 
               onClick={onPrint}
               className="px-4 py-2 bg-black border border-slate-800 text-white rounded-md text-xs font-semibold hover:bg-slate-900 transition-all"
             >
               Export Report
             </button>
          )}
        </div>
      </div>

      {currentAudit.audioUrl && (
          <div className="bg-indigo-600/5 border border-indigo-500/20 rounded-2xl p-4 flex items-center space-x-6 animate-in slide-in-from-top-4">
             <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                <i className="fa-solid fa-waveform"></i>
             </div>
             <div className="flex-1">
                <audio src={currentAudit.audioUrl} controls className="w-full h-8" />
             </div>
             <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest px-4">Audio Briefing System Online</span>
          </div>
      )}

      {/* Tabs */}
      {!hideTabs && (
        <div className="flex space-x-6 border-b border-slate-800 sticky top-14 bg-black z-30">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-3 text-sm font-medium transition-all relative ${
                activeTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>}
            </button>
          ))}
        </div>
      )}

      {/* Content Area */}
      <div className="mt-8">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="bg-black border border-slate-800 rounded-xl overflow-hidden p-8">
                <p className="text-slate-300 text-lg leading-relaxed font-medium">{currentAudit.summary}</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SWOTCard swot={currentAudit.swot} />
              <div className="space-y-8">
                <TechStack stack={currentAudit.techStack} />
                {currentAudit.marketPresence && currentAudit.marketPresence.length > 0 && (
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl">
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Strategic Footprint</h4>
                        <div className="space-y-3">
                            {currentAudit.marketPresence.map((loc, i) => (
                                <a key={i} href={loc.uri} target="_blank" className="flex items-center space-x-3 text-sm text-indigo-400 hover:underline">
                                    <i className="fa-solid fa-location-dot"></i>
                                    <span>{loc.title}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'media' && (
           <VideoBriefing audit={currentAudit} onVideoGenerated={handleVideoGenerated} />
        )}

        {activeTab === 'battlecard' && <Battlecard data={currentAudit.battlecard} companyName={currentAudit.companyName} />}
        {activeTab === 'features' && <FeatureMatrix features={currentAudit.featureGap} />}
        {activeTab === 'sentiment' && <ReviewAnalysis sentiment={currentAudit.sentiment} />}
        {activeTab === 'tech' && <TechStack stack={currentAudit.techStack} isLarge />}
      </div>
    </div>
  );
};

export default AuditResults;