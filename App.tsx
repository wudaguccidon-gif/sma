
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

  useEffect(() => {
    const saved = localStorage.getItem('competeai_audits');
    if (saved) {
      try {
        setAudits(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load audits", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('competeai_audits', JSON.stringify(audits));
  }, [audits]);

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
            {printContext === 'all' && (
               <div className="mt-20">
                  <h2 className="text-2xl font-black mb-8">Supplementary Sales Battlecard: {audit.companyName}</h2>
                  <AuditResults audit={audit} activeTab="battlecard" onTabChange={() => {}} hideTabs />
               </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {/* Sidebar - Desktop */}
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

      {/* Mobile Sidebar Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"></div>
          <div 
            className="relative flex flex-col w-full max-w-xs h-full bg-slate-900 border-r border-slate-800 animate-in slide-in-from-left duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
               <span className="text-white font-black flex items-center tracking-tight">
                 <i className="fa-solid fa-bolt text-indigo-400 mr-2"></i>
                 CompeteAI
               </span>
               <button onClick={() => setIsMenuOpen(false)} className="text-slate-400 p-2 hover:text-white transition-colors">
                 <i className="fa-solid fa-xmark text-xl"></i>
               </button>
            </div>
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

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden relative z-10 bg-grid">
        <Navbar 
          onNewAudit={() => { setCurrentView(AppView.NEW_AUDIT); setIsMenuOpen(false); }} 
          setView={(view) => { setCurrentView(view); setIsMenuOpen(false); }}
          toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
        />
        
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none p-4 md:p-10">
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
            
            {currentView === AppView.AUDIT_DETAIL && !selectedAudit && (
              <div className="text-center py-20">
                <p className="text-slate-500">No audit selected</p>
                <button 
                  onClick={() => setCurrentView(AppView.DASHBOARD)}
                  className="mt-4 text-indigo-400 hover:text-indigo-300 hover:underline"
                >
                  Go back to Dashboard
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
