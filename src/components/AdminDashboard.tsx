import React, { useState, useEffect } from 'react';
import {
  Users,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Siren,
  Search,
  Filter,
  Eye,
  Trash2,
  UserCheck,
  ShieldAlert,
  BarChart2,
  PieChart as PieIcon,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { AnalyticsData, Complaint, PriorityType, StatusType } from '../types';

interface AdminDashboardProps {
  onSelectComplaint: (complaint: Complaint) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSelectComplaint }) => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('app_auth_token');

      // Fetch analytics
      const analyticsRes = await fetch('/api/admin/analytics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setAnalytics(data.analytics);
      }

      // Fetch all complaints
      const query = new URLSearchParams();
      if (categoryFilter !== 'All') query.append('category', categoryFilter);
      if (priorityFilter !== 'All') query.append('priority', priorityFilter);
      if (statusFilter !== 'All') query.append('status', statusFilter);
      if (searchTerm) query.append('search', searchTerm);

      const complaintsRes = await fetch(`/api/complaints?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (complaintsRes.ok) {
        const cData = await complaintsRes.json();
        setComplaints(cData.complaints || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [categoryFilter, priorityFilter, statusFilter, searchTerm]);

  const handleDeleteComplaint = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this complaint?')) return;

    try {
      const token = localStorage.getItem('app_auth_token');
      const res = await fetch(`/api/complaints/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setComplaints((prev) => prev.filter((c) => c.id !== id));
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const priorityBadge: Record<PriorityType, string> = {
    Low: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    Medium: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    High: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
    Emergency: 'bg-rose-500/25 text-rose-300 border border-rose-500/40 font-bold animate-pulse',
  };

  const statusBadge: Record<StatusType, string> = {
    Pending: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    'Under Review': 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
    Resolved: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    Rejected: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
  };

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#a855f7', '#ec4899', '#06b6d4'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Admin Top Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2 backdrop-blur-md">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            Administrative Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Grievance Analytics & Management
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Monitor municipal complaints, inspect AI classifications, assign departments, and track resolution velocity.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white hover:bg-white/15 font-semibold text-xs transition-colors flex items-center gap-2 backdrop-blur-md"
        >
          <RefreshCw className="w-4 h-4 text-indigo-400" />
          Refresh Live Data
        </button>
      </div>

      {/* Analytics Metric Cards (6 cards) */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl shadow-xl glass-panel-hover">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300">Total Users</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-xl font-extrabold text-white mt-1">
              {analytics.stats.totalUsers}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl shadow-xl glass-panel-hover">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300">Total Complaints</span>
              <FileText className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-xl font-extrabold text-white mt-1">
              {analytics.stats.totalComplaints}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl shadow-xl glass-panel-hover">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300">Resolved</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xl font-extrabold text-emerald-400 mt-1">
              {analytics.stats.resolvedComplaints}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl shadow-xl glass-panel-hover">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300">Pending</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xl font-extrabold text-amber-300 mt-1">
              {analytics.stats.pendingComplaints}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl shadow-xl glass-panel-hover">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300">High Priority</span>
              <AlertTriangle className="w-4 h-4 text-orange-400" />
            </div>
            <p className="text-xl font-extrabold text-orange-300 mt-1">
              {analytics.stats.highPriorityComplaints}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl shadow-xl glass-panel-hover">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300">Emergency</span>
              <Siren className="w-4 h-4 text-rose-400 animate-bounce" />
            </div>
            <p className="text-xl font-extrabold text-rose-300 mt-1">
              {analytics.stats.emergencyComplaints}
            </p>
          </div>
        </div>
      )}

      {/* Analytics Charts Grid */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Complaints by Category Bar Chart */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-5 rounded-3xl shadow-2xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-400" />
              Complaints by Category
            </h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.categoryDistribution}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '11px', borderRadius: '12px' }} />
                  <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Trend Line Chart */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-5 rounded-3xl shadow-2xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Monthly Complaints & Resolution
            </h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.monthlyTrend}>
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '11px', borderRadius: '12px' }} />
                  <Line type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2} name="Total Filed" />
                  <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} name="Resolved" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Distribution Pie Chart */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-5 rounded-3xl shadow-2xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-purple-400" />
              Status Distribution
            </h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analytics.statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '11px', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Admin Complaints Manager Table */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-base font-bold text-white">
            All System Complaints ({complaints.length})
          </h2>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ticket, citizen, location..."
                className="w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-white/5 border border-white/10 text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:border-indigo-500/80"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-2 rounded-xl text-xs bg-slate-900/80 border border-white/15 text-slate-200 backdrop-blur-md focus:outline-none"
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
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-2 rounded-xl text-xs bg-slate-900/80 border border-white/15 text-slate-200 backdrop-blur-md focus:outline-none"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Emergency">Emergency</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-2 rounded-xl text-xs bg-slate-900/80 border border-white/15 text-slate-200 backdrop-blur-md focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading admin complaints...</div>
          ) : complaints.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">No complaints found matching filters.</div>
          ) : (
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/5 text-slate-300 font-bold uppercase text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-4">Ticket</th>
                  <th className="py-3.5 px-4">Citizen</th>
                  <th className="py-3.5 px-4">Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {c.ticketNumber}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white">
                      {c.userName}
                      <span className="block text-[10px] text-slate-400">{c.userEmail}</span>
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
                    <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">{c.assignedDepartment}</td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => onSelectComplaint(c)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 font-semibold text-[11px] transition-colors inline-flex items-center gap-1 backdrop-blur-md"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Manage
                      </button>
                      <button
                        onClick={() => handleDeleteComplaint(c.id)}
                        className="px-2.5 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-colors inline-flex items-center backdrop-blur-md"
                        title="Delete Complaint"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
