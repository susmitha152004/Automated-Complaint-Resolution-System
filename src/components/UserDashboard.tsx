import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Eye,
  FileText,
  MapPin,
  Bot,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Complaint, PriorityType, StatusType } from '../types';

interface UserDashboardProps {
  onSelectComplaint: (complaint: Complaint) => void;
  onNavigateSubmit: () => void;
  openAuthModal: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  onSelectComplaint,
  onNavigateSubmit,
  openAuthModal,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const fetchUserComplaints = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('app_auth_token');
      if (!token) {
        setLoading(false);
        return;
      }

      const query = new URLSearchParams({ mineOnly: 'true' });
      if (selectedCategory !== 'All') query.append('category', selectedCategory);
      if (selectedStatus !== 'All') query.append('status', selectedStatus);
      if (searchTerm) query.append('search', searchTerm);

      const res = await fetch(`/api/complaints?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setComplaints(data.complaints || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserComplaints();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, selectedCategory, selectedStatus, searchTerm]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-3xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 mx-auto flex items-center justify-center mb-4 shadow-xl backdrop-blur-md">
          <FileText className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Sign In to View Your Complaints</h2>
        <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto">
          Sign in to access your complaint history, track real-time resolution timelines, and receive official AI & department updates.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={openAuthModal}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/25 border border-indigo-400/30 transition-all"
          >
            Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  // Quick stats calculations
  const total = complaints.length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;
  const pending = complaints.filter((c) => c.status === 'Pending').length;
  const underReview = complaints.filter((c) => c.status === 'Under Review').length;

  const priorityBadge: Record<PriorityType, string> = {
    Low: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    Medium: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    High: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
    Emergency: 'bg-rose-500/25 text-rose-300 border border-rose-500/40 animate-pulse font-bold',
  };

  const statusBadge: Record<StatusType, string> = {
    Pending: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    'Under Review': 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
    Resolved: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    Rejected: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Welcome Banner */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl pointer-events-none -z-0" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-semibold backdrop-blur border border-white/15 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Citizen Portal Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Track your filed complaints and automated Gemini AI resolution status in real-time.
            </p>
          </div>

          <button
            onClick={onNavigateSubmit}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition-all flex items-center gap-2 shrink-0 backdrop-blur-md"
          >
            <PlusCircle className="w-4 h-4 text-emerald-300" />
            File New Complaint
          </button>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 backdrop-blur-md p-5 rounded-2xl shadow-xl glass-panel-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Total Filed</span>
            <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white mt-2">{total}</p>
        </div>

        <div className="bg-white/5 border border-white/10 backdrop-blur-md p-5 rounded-2xl shadow-xl glass-panel-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Under Review</span>
            <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-indigo-300 mt-2">{underReview}</p>
        </div>

        <div className="bg-white/5 border border-white/10 backdrop-blur-md p-5 rounded-2xl shadow-xl glass-panel-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Resolved</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-400 mt-2">{resolved}</p>
        </div>

        <div className="bg-white/5 border border-white/10 backdrop-blur-md p-5 rounded-2xl shadow-xl glass-panel-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Pending</span>
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-amber-300 mt-2">{pending}</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ticket # or keyword..."
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white/5 border border-white/10 text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:border-indigo-500/80"
            />
          </div>

          {/* Category & Status Filter dropdowns */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs bg-slate-900/80 border border-white/15 text-slate-200 backdrop-blur-md focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Electricity">Electricity</option>
              <option value="Roads">Roads</option>
              <option value="Garbage">Garbage</option>
              <option value="Street Lights">Street Lights</option>
              <option value="Internet">Internet</option>
              <option value="Education">Education</option>
              <option value="Health">Health</option>
              <option value="Pollution">Pollution</option>
              <option value="Public Transport">Public Transport</option>
              <option value="Others">Others</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs bg-slate-900/80 border border-white/15 text-slate-200 backdrop-blur-md focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>

            <button
              onClick={fetchUserComplaints}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Complaints Table / List */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading complaints...</div>
          ) : complaints.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-500 mx-auto" />
              <p className="text-xs text-slate-400">No complaints found under current filters.</p>
              <button
                onClick={onNavigateSubmit}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md border border-indigo-400/30"
              >
                File Your First Complaint
              </button>
            </div>
          ) : (
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/5 text-slate-300 font-bold uppercase text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-4">Ticket</th>
                  <th className="py-3.5 px-4">Complaint Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Assigned Dept</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {c.ticketNumber}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate font-medium text-white">
                      {c.title}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{c.category}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${priorityBadge[c.priority]}`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusBadge[c.status]}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 line-clamp-1">{c.assignedDepartment}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectComplaint(c)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 font-semibold text-[11px] transition-colors inline-flex items-center gap-1 backdrop-blur-md"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
