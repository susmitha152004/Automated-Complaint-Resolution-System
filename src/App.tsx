import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { SubmitComplaintForm } from './components/SubmitComplaintForm';
import { TrackComplaint } from './components/TrackComplaint';
import { AuthModal } from './components/AuthModal';
import { ComplaintDetailModal } from './components/ComplaintDetailModal';
import { ProfileModal } from './components/ProfileModal';
import { DocumentationModal } from './components/DocumentationModal';
import { Complaint } from './types';

function MainApp() {
  const { user, isAuthenticated } = useAuth();

  // Tab State: 'home' | 'dashboard' | 'admin' | 'submit' | 'track'
  const [activeTab, setActiveTab] = useState<string>('home');

  // Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return (
      localStorage.getItem('app_theme') === 'dark' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  });

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDocOpen, setIsDocOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('app_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('app_theme', 'light');
    }
  }, [darkMode]);

  // Handle redirect to admin if logged in as admin
  useEffect(() => {
    if (user?.role === 'admin' && activeTab === 'dashboard') {
      setActiveTab('admin');
    }
  }, [user]);

  const handleComplaintSubmitted = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setActiveTab('dashboard');
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 transition-colors duration-200 font-sans flex flex-col overflow-x-hidden">
      
      {/* Background Luminous Mesh Gradients for Frosted Glass Effect */}
      <div className="fixed top-[-10%] left-[-10%] w-[55%] h-[55%] bg-indigo-600/20 blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[55%] h-[55%] bg-purple-600/20 blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="fixed top-[35%] right-[15%] w-[40%] h-[40%] bg-blue-600/15 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[20%] left-[10%] w-[35%] h-[35%] bg-teal-600/15 blur-[130px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 flex-col flex min-h-screen">
        {/* Top Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          openAuthModal={() => setIsAuthOpen(true)}
          openDocumentation={() => setIsDocOpen(true)}
          openProfileModal={() => setIsProfileOpen(true)}
        />

        {/* Main View Area */}
        <main className="flex-1 pb-16">
          {activeTab === 'home' && (
            <HomePage
              onNavigate={(tab) => setActiveTab(tab)}
              openAuthModal={() => setIsAuthOpen(true)}
            />
          )}

          {activeTab === 'dashboard' && (
            <UserDashboard
              onSelectComplaint={(c) => setSelectedComplaint(c)}
              onNavigateSubmit={() => setActiveTab('submit')}
              openAuthModal={() => setIsAuthOpen(true)}
            />
          )}

          {activeTab === 'admin' && (
            <AdminDashboard
              onSelectComplaint={(c) => setSelectedComplaint(c)}
            />
          )}

          {activeTab === 'submit' && (
            <SubmitComplaintForm
              onSubmitted={handleComplaintSubmitted}
              openAuthModal={() => setIsAuthOpen(true)}
            />
          )}

          {activeTab === 'track' && (
            <TrackComplaint
              onSelectComplaint={(c) => setSelectedComplaint(c)}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-slate-950/60 backdrop-blur-xl py-6 text-center text-xs text-slate-400">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© 2026 Automated Complaint Resolution System. Powered by Gemini 3.6 Flash AI.</p>
            <div className="flex items-center gap-4 text-[11px]">
              <button onClick={() => setIsDocOpen(true)} className="hover:underline text-indigo-400">
                API Documentation & System Specs
              </button>
              <span>•</span>
              <button onClick={() => setActiveTab('track')} className="hover:underline text-slate-300">
                Track Complaint Status
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

      <DocumentationModal isOpen={isDocOpen} onClose={() => setIsDocOpen(false)} />

      <ComplaintDetailModal
        complaint={selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        onComplaintUpdated={(updated) => {
          setSelectedComplaint(updated);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
