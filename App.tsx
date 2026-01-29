import React, { useState, useEffect } from 'react';
import { AppView, AuditResult } from './types';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AuditForm from './components/AuditForm';
import AuditResults from './components/AuditResults';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [audits, setAudits] = useState<AuditResult[]>([]);
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeAuditTab, setActiveAuditTab] = useState('overview');
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [printContext, setPrintContext] = useState<'single' | 'all'>('single');
  const [hasCheckedKey, setHasCheckedKey] = useState(false);
  const [isKeyRequired, setIsKeyRequired] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      // Priority 1: Check for standard environment variable
      if (process.env.API_KEY && process.env.API_KEY.length > 5) {
        setHasCheckedKey(true);
        setIsKeyRequired(false);
        return;
      }
      
      // Priority 2: Check for AI Studio session
      if (window.aistudio?.hasSelectedApiKey) {
        try {
          const selected = await window.aistudio.hasSelectedApiKey();
          if (!selected) {
            setIsKeyRequired(true);
          }
        } catch (e) {
          setIsKeyRequired(true);
        }
      } else {
        // Fallback for non-studio contexts without ENV
        setIsKeyRequired(true);
      }
      setHasCheckedKey(true);
    };
    checkKey();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('competeai_audits');
    if (saved) {
      try {
        setAudits(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load historical audits", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('competeai_audits', JSON.stringify(audits));
  }, [audits]);

  const handleSelectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      // Assume success and proceed per safety guidelines
      setIsKeyRequired(false);
    }
  };

  if (!hasCheckedKey) return null;

  if (isKeyRequired) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center bg-grid">
        <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-indigo-500/20">
          <i className="fa-solid fa-key text-white text-3xl"></i>
        </div>
        <h1 className="text-4xl font-black text-white mb-4 tracking-tighter">Strategic Access Required</h1>
        <p className="text-slate-400 max-w-md mb-10 leading-relaxed font-medium">
          CompeteAI requires a valid Gemini API key to perform forensic market analysis. 
          Please connect a key from a paid GCP project.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={handleSelectKey}
            className="bg-white text-slate-950 px-10 py-4 rounded-2xl font-black hover:bg-indigo-50 transition-all flex items-center justify-center shadow-2xl active:scale-95 text-sm uppercase tracking-widest"
          >
            Connect API Key
          </button>
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noreferrer"
            className="px-10 py-4 rounded-2xl border border-white/10 text-slate-500 font-black hover:text-white transition-all text-[10px] uppercase tracking-[0.2em] flex items-center justify-center"
          >
            Billing Documentation
          </a>
        </div>
      </div>
    );
  }

  const handleAuditComplete = (result: AuditResult) => {
    setAudits(prev => [result, ...prev]);
    setSelectedAuditId(result.id);
    setActiveAuditTab('overview');
    setCurrentView(AppView.AUDIT_DETAIL);
  };

  const selectedAudit = audits.find(a => a.id === selectedAuditId);

  const deleteAudit = (id: string) => {
    setAudits(prev => prev.filter(a => a.id !== id));
    if (selectedAuditId === id) {
      setSelectedAuditId(null);
      setCurrentView(AppView.DASHBOARD);
    }
  };

  const selectAudit = (id: string, tab: string = 'overview') => {
    setSelectedAuditId(id);
    setActiveAuditTab(tab);
    setCurrentView(AppView.AUDIT_DETAIL);
    setIsMenuOpen(false);
  };

  const triggerPrint = (context: 'single' | 'all') => {
    setPrintContext(context);
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  if (isPrinting) {
    const auditsToPrint = printContext === 'all' ? audits : (selectedAudit ? [selectedAudit] : []);
    return (
      <div className="bg-white p-8 text-slate-900">
        {auditsToPrint.map((audit, index) => (
          <div key={audit.id} className={index < auditsToPrint.length - 1 ? 'print-break' : ''}>
            <div className="mb-10 pb-10 border-b-2 border-slate-900">
               <h1 className="text-4xl font-black mb-2 uppercase tracking-tighter">CompeteAI Strategic Audit</h1>
               <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Generated on {new Date(audit.timestamp).toLocaleDateString()}</p>
            </div>
            <AuditResults 
                audit={audit} 
                activeTab="overview" 
                onTabChange={() => {}} 
                hideTabs
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar 
          currentView={currentView} 
          setView={(view) => { setCurrentView(view); setIsMenuOpen(false); }} 
          audits={audits}
          onSelectAudit={selectAudit}
          selectedId={selectedAuditId}
          activeTab={activeAuditTab}
          onTabChange={setActiveAuditTab}
          onPrintAll={() => triggerPrint('all')}
        />
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"></div>
          <div className="relative flex flex-col w-full max-w-xs h-full bg-slate-950 border-r border-white/5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <Sidebar 
              currentView={currentView} 
              setView={(view) => { setCurrentView(view); setIsMenuOpen(false); }} 
              audits={audits}
              onSelectAudit={selectAudit}
              selectedId={selectedAuditId}
              activeTab={activeAuditTab}
              onTabChange={setActiveAuditTab}
              onPrintAll={() => triggerPrint('all')}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col flex-1 w-0 overflow-hidden relative z-10 bg-grid">
        <Navbar 
          onNewAudit={() => { setCurrentView(AppView.NEW_AUDIT); setIsMenuOpen(false); }} 
          setView={(view) => { setCurrentView(view); setIsMenuOpen(false); }}
          toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
        />
        
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none px-4 py-8 md:px-10">
          <div className="max-w-7xl mx-auto">
            {currentView === AppView.DASHBOARD && (
              <Dashboard 
                audits={audits} 
                onSelectAudit={selectAudit}
                onNew={() => setCurrentView(AppView.NEW_AUDIT)}
                onDelete={deleteAudit}
              />
            )}

            {currentView === AppView.NEW_AUDIT && (
              <AuditForm onComplete={handleAuditComplete} onCancel={() => setCurrentView(AppView.DASHBOARD)} />
            )}

            {currentView === AppView.AUDIT_DETAIL && selectedAudit && (
              <AuditResults 
                audit={selectedAudit} 
                activeTab={activeAuditTab} 
                onTabChange={setActiveAuditTab} 
                onPrint={() => triggerPrint('single')}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
