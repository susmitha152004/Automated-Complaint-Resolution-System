import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Home,
  Bell,
  Sun,
  Moon,
  User as UserIcon,
  LogOut,
  PlusCircle,
  BarChart3,
  Search,
  CheckCircle2,
  BookOpen,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NotificationItem } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  openAuthModal: () => void;
  openDocumentation: () => void;
  openProfileModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  openAuthModal,
  openDocumentation,
  openProfileModal,
}) => {
  const { user, isAuthenticated, logout, switchDemoRole } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchNotifs = async () => {
        try {
          const token = localStorage.getItem('app_auth_token');
          const res = await fetch('/api/notifications', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setNotifications(data.notifications || []);
            setUnreadCount((data.notifications || []).filter((n: any) => !n.read).length);
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchNotifs();
      const interval = setInterval(fetchNotifs, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user]);

  const markRead = async (id: string) => {
    try {
      const token = localStorage.getItem('app_auth_token');
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/60 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 border border-white/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                Automated Complaint <span className="text-indigo-400">Resolution</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                AI System
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'home'
                  ? 'bg-white/15 text-white border border-white/20 shadow-sm backdrop-blur-md'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <Home className="w-4 h-4 text-indigo-400" />
              Home
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'dashboard'
                  ? 'bg-white/15 text-white border border-white/20 shadow-sm backdrop-blur-md'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <UserIcon className="w-4 h-4 text-purple-400" />
              Dashboard
            </button>

            {isAuthenticated && user?.role === 'admin' ? (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'admin'
                    ? 'bg-white/15 text-white border border-white/20 shadow-sm backdrop-blur-md'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-amber-400" />
                Admin Console
              </button>
            ) : null}

            <button
              onClick={() => setActiveTab('submit')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'submit'
                  ? 'bg-white/15 text-white border border-white/20 shadow-sm backdrop-blur-md'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              File Complaint
            </button>

            <button
              onClick={() => setActiveTab('track')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'track'
                  ? 'bg-white/15 text-white border border-white/20 shadow-sm backdrop-blur-md'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <Search className="w-4 h-4 text-cyan-400" />
              Track Ticket
            </button>

            <button
              onClick={openDocumentation}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition-all flex items-center gap-2 border border-transparent"
              title="System Specs & API Docs"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              Docs & APIs
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Role Switcher Button */}
            {isAuthenticated ? (
              <button
                onClick={() => switchDemoRole(user?.role === 'admin' ? 'user' : 'admin')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition-all backdrop-blur-md"
                title="Switch role instantly to test user/admin views"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>As {user?.role === 'admin' ? 'Admin' : 'Citizen'}</span>
                <span className="text-[10px] underline opacity-80">(Switch)</span>
              </button>
            ) : null}

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors border border-transparent"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-300" />}
            </button>

            {/* Notifications Dropdown */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors relative border border-transparent"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse shadow-md">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-slate-900/90 border border-white/15 rounded-2xl shadow-2xl z-50 p-3.5 backdrop-blur-2xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-2.5">
                      <span className="font-semibold text-sm text-white">Notifications</span>
                      <span className="text-xs text-slate-400">{unreadCount} unread</span>
                    </div>

                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-4">No notifications yet.</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markRead(n.id)}
                            className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                              n.read
                                ? 'bg-white/5 border-white/5 text-slate-300 opacity-70'
                                : 'bg-indigo-500/15 border-indigo-500/30 text-white font-medium backdrop-blur-md'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-white">{n.title}</span>
                              {!n.read && <span className="w-2 h-2 rounded-full bg-indigo-400"></span>}
                            </div>
                            <p className="text-slate-300 leading-relaxed mb-1">{n.message}</p>
                            <span className="text-[10px] text-slate-400">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile or Login Button */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 border-l border-white/10 pl-2">
                <button
                  onClick={openProfileModal}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/10 transition-colors"
                  title="View Profile"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center uppercase shadow-md border border-white/20">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-semibold text-white line-clamp-1">{user.name}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300 capitalize border border-white/10">
                      {user.role}
                    </span>
                  </div>
                </button>

                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 border border-indigo-400/30 transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
