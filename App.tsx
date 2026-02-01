
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeAuditTab, setActiveAuditTab] = useState('overview');

  useEffect(() => {
    const saved = localStorage.getItem('competeai_audits');
    if (saved) {
      try {
        setAudits(JSON.parse(saved));
      } catch (e) {
        console.error("Local storage load failed", e);
      }
    }
  }, []);

  useEffect(() => {
    if (audits.length > 0) {
      localStorage.setItem('competeai_audits', JSON.stringify(audits));
    }
  }, [audits]);

  const handleAuditComplete = (result: AuditResult) => {
    setAudits(prev => [result, ...prev]);
    setSelectedAuditId(result.id);
    setActiveAuditTab('overview');
    setCurrentView(AppView.AUDIT_DETAIL);
    setIsSidebarOpen(false);
  };

  const handleDeleteAudit = (id: string) => {
    setAudits(prev => prev.filter(a => a.id !== id));
    if (selectedAuditId === id) {
      setSelectedAuditId(null);
      setCurrentView(AppView.DASHBOARD);
    }
  };

  const selectedAudit = audits.find(a => a.id === selectedAuditId);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-black text-slate-200">
      <Navbar 
        onNewAudit={() => {
          setCurrentView(AppView.NEW_AUDIT);
          setIsSidebarOpen(false);
        }}
        setView={(view) => {
          setCurrentView(view);
          setIsSidebarOpen(false);
        }}
        toggleMenu={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          currentView={currentView}
          setView={(view) => {
            setCurrentView(view);
            setIsSidebarOpen(false);
          }}
          audits={audits}
          onSelectAudit={(id) => {
            setSelectedAuditId(id);
            setCurrentView(AppView.AUDIT_DETAIL);
            setActiveAuditTab('overview');
            setIsSidebarOpen(false);
          }}
          selectedId={selectedAuditId}
          activeTab={activeAuditTab}
          onTabChange={setActiveAuditTab}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <main className="flex-1 overflow-y-auto bg-black p-4 md:p-10 custom-scrollbar relative bg-grid">
          {currentView === AppView.DASHBOARD && (
            <Dashboard 
              audits={audits}
              onSelectAudit={(id) => {
                setSelectedAuditId(id);
                setCurrentView(AppView.AUDIT_DETAIL);
              }}
              onNew={() => setCurrentView(AppView.NEW_AUDIT)}
              onDelete={handleDeleteAudit}
            />
          )}

          {currentView === AppView.NEW_AUDIT && (
            <AuditForm 
              onComplete={handleAuditComplete}
              onCancel={() => setCurrentView(AppView.DASHBOARD)}
            />
          )}

          {currentView === AppView.AUDIT_DETAIL && selectedAudit && (
            <AuditResults 
              audit={selectedAudit}
              activeTab={activeAuditTab}
              onTabChange={setActiveAuditTab}
              onPrint={() => window.print()}
            />
          )}
        </main>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default App;
