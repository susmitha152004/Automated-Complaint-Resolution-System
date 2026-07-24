import React from 'react';
import {
  ShieldAlert,
  Sparkles,
  Bot,
  PlusCircle,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Building2,
  Droplets,
  Zap,
  Trash2,
  Lightbulb,
  Construction,
  Users,
  ShieldCheck,
  FileText,
  BarChart2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HomePageProps {
  onNavigate: (tab: string) => void;
  openAuthModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, openAuthModal }) => {
  const { isAuthenticated, user } = useAuth();

  const categories = [
    { name: 'Water Supply', icon: Droplets, color: 'text-blue-400 bg-blue-500/15 border-blue-500/30', desc: 'Pipe leaks, contamination, supply outages' },
    { name: 'Electricity & Power', icon: Zap, color: 'text-amber-400 bg-amber-500/15 border-amber-500/30', desc: 'Transformer issues, loose wiring, power cuts' },
    { name: 'Roads & Infrastructure', icon: Construction, color: 'text-orange-400 bg-orange-500/15 border-orange-500/30', desc: 'Potholes, broken footpaths, road hazards' },
    { name: 'Waste & Garbage', icon: Trash2, color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30', desc: 'Overflowing bins, uncollected refuse, dumping' },
    { name: 'Street Lighting', icon: Lightbulb, color: 'text-yellow-400 bg-yellow-500/15 border-yellow-500/30', desc: 'Non-functional street lamps, dark passages' },
    { name: 'Sanitation & Health', icon: Building2, color: 'text-purple-400 bg-purple-500/15 border-purple-500/30', desc: 'Drainage blockage, mosquito breeding grounds' },
  ];

  const features = [
    {
      icon: Bot,
      title: 'Gemini 3.6 Flash AI Engine',
      description: 'Automatically analyzes grievance text and photo evidence in under 3 seconds using structured JSON schema.',
      badge: 'Multimodal AI',
    },
    {
      icon: TrendingUp,
      title: 'Auto-Priority Routing',
      description: 'Detects hazard level and classifies complaints into Low, Medium, High, or Emergency for instant dispatch.',
      badge: 'Smart Escalation',
    },
    {
      icon: Clock,
      title: 'Real-Time Resolution Timeline',
      description: 'Citizens and officials receive continuous status updates and timestamped audit logs for every action.',
      badge: '100% Transparent',
    },
  ];

  return (
    <div className="space-y-16 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fadeIn">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-950/60 via-slate-900/80 to-slate-950/90 border border-white/15 p-8 sm:p-12 md:p-16 backdrop-blur-2xl shadow-2xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
            <span>AI-Driven Municipal Citizen Portal</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Automated Complaint <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
              Resolution System
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Lodge civic complaints with photo evidence. Our Gemini 3.6 Flash AI automatically categorizes your issue, predicts priority, routes it to the designated municipal department, and tracks real-time resolution timelines.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('submit')}
              className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 border border-indigo-400/40 transition-all flex items-center gap-2 backdrop-blur-md active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-emerald-300" />
              <span>Lodge New Complaint</span>
            </button>

            <button
              onClick={() => onNavigate('track')}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs shadow-lg border border-white/20 transition-all flex items-center gap-2 backdrop-blur-md active:scale-95"
            >
              <Search className="w-4 h-4 text-cyan-300" />
              <span>Track Ticket Status</span>
            </button>

            {isAuthenticated ? (
              <button
                onClick={() => onNavigate(user?.role === 'admin' ? 'admin' : 'dashboard')}
                className="px-6 py-3.5 rounded-2xl bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 font-bold text-xs shadow-lg border border-purple-400/30 transition-all flex items-center gap-2 backdrop-blur-md active:scale-95"
              >
                <BarChart2 className="w-4 h-4 text-purple-300" />
                <span>Open {user?.role === 'admin' ? 'Admin Dashboard' : 'My Complaints'}</span>
              </button>
            ) : (
              <button
                onClick={openAuthModal}
                className="px-6 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-white/10 transition-all flex items-center gap-2 backdrop-blur-md active:scale-95"
              >
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Search Ticket Inline Banner */}
        <div className="mt-10 p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md max-w-2xl">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300 shrink-0">
              <Search className="w-4 h-4" />
              <span>Quick Lookup:</span>
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                readOnly
                onClick={() => onNavigate('track')}
                placeholder="Click here to track CMP-2026-8812..."
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-950/60 border border-white/10 text-slate-300 cursor-pointer hover:border-indigo-400 transition-all"
              />
              <button
                onClick={() => onNavigate('track')}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 shrink-0 border border-indigo-400/30"
              >
                Track
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live System Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Complaints Resolved</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">1,482+</p>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 99.1% Success Rate
          </span>
        </div>

        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Avg Resolution Time</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-indigo-300">2.4 Hours</p>
          <span className="text-[11px] text-indigo-400 font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" /> Powered by Gemini
          </span>
        </div>

        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Departments</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-purple-300">12 Boards</p>
          <span className="text-[11px] text-purple-400 font-semibold flex items-center gap-1">
            <Building2 className="w-3 h-3" /> Direct Integration
          </span>
        </div>

        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Citizen Satisfaction</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-300">4.9 / 5.0</p>
          <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
            <Users className="w-3 h-3" /> Verified Feedback
          </span>
        </div>
      </div>

      {/* AI Key Capabilities Section */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Next-Generation AI Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Eliminating municipal manual triage delays with instant computer vision classification and dynamic routing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl space-y-4 hover:border-indigo-500/50 transition-all hover:bg-white/[0.07]"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  <feat.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/10 text-indigo-200 border border-white/10">
                  {feat.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-white">{feat.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Shortcut Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Supported Civic Categories</h2>
            <p className="text-xs text-slate-400 mt-1">Select a category to quickly file a complaint</p>
          </div>
          <button
            onClick={() => onNavigate('submit')}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <div
              key={i}
              onClick={() => onNavigate('submit')}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/25 cursor-pointer backdrop-blur-md transition-all flex items-start gap-4 hover:scale-[1.01]"
            >
              <div className={`p-3 rounded-xl border ${cat.color} shrink-0`}>
                <cat.icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">{cat.name}</h4>
                <p className="text-[11px] text-slate-400 leading-tight">{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Steps */}
      <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-widest">Simple 4-Step Process</span>
          <h2 className="text-2xl font-bold text-white">How Automated Resolution Works</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative">
          <div className="space-y-2 text-center p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center mx-auto mb-3 shadow-lg">1</div>
            <h4 className="text-xs font-bold text-white">Submit Grievance</h4>
            <p className="text-[11px] text-slate-300">Upload description, location & optional photo evidence.</p>
          </div>

          <div className="space-y-2 text-center p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center mx-auto mb-3 shadow-lg">2</div>
            <h4 className="text-xs font-bold text-white">Gemini AI Analysis</h4>
            <p className="text-[11px] text-slate-300">Instant multimodal classification & priority assessment.</p>
          </div>

          <div className="space-y-2 text-center p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-black text-xs flex items-center justify-center mx-auto mb-3 shadow-lg">3</div>
            <h4 className="text-xs font-bold text-white">Official Dispatch</h4>
            <p className="text-[11px] text-slate-300">Assigned automatically to department officers.</p>
          </div>

          <div className="space-y-2 text-center p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center mx-auto mb-3 shadow-lg">4</div>
            <h4 className="text-xs font-bold text-white">Resolution & Audit</h4>
            <p className="text-[11px] text-slate-300">Receive live status updates until ticket is closed.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
