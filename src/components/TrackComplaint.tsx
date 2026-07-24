import React, { useState } from 'react';
import { Search, ShieldAlert, Clock, MapPin, CheckCircle2, Bot, FileText, ArrowRight } from 'lucide-react';
import { Complaint, PriorityType, StatusType } from '../types';

interface TrackComplaintProps {
  onSelectComplaint: (complaint: Complaint) => void;
}

export const TrackComplaint: React.FC<TrackComplaintProps> = ({ onSelectComplaint }) => {
  const [ticketInput, setTicketInput] = useState('');
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;

    setError('');
    setLoading(true);
    setComplaint(null);

    try {
      const res = await fetch(`/api/complaints/${encodeURIComponent(ticketInput.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Complaint not found with this Ticket Number or ID.');
      }

      setComplaint(data.complaint);
    } catch (err: any) {
      setError(err.message || 'Ticket not found.');
    } finally {
      setLoading(false);
    }
  };

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
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 animate-fadeIn">
      
      {/* Search Banner */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 text-indigo-300 mx-auto flex items-center justify-center backdrop-blur-md shadow-lg">
          <Search className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Track Grievance Ticket Status
        </h1>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          Enter your Ticket Reference Number (e.g., <span className="font-mono font-bold text-indigo-400">CMP-2026-8812</span>) to instantly check status, assigned department, and official AI resolution timeline.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex max-w-lg mx-auto gap-2 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              required
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              placeholder="e.g. CMP-2026-8812"
              className="w-full pl-10 pr-4 py-3 rounded-2xl text-xs bg-white/5 border border-white/10 text-white placeholder-slate-400 font-mono font-semibold backdrop-blur-md focus:outline-none focus:border-indigo-500/80"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition-all flex items-center gap-1.5 shrink-0 backdrop-blur-md"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-xs font-semibold text-rose-300 text-center backdrop-blur-md">
          {error}
        </div>
      )}

      {/* Ticket Result Display */}
      {complaint && (
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono font-bold text-sm text-indigo-400">
                  {complaint.ticketNumber}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusBadge[complaint.status]}`}>
                  {complaint.status}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${priorityBadge[complaint.priority]}`}>
                  {complaint.priority} Priority
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">
                {complaint.title}
              </h2>
            </div>

            <button
              onClick={() => onSelectComplaint(complaint)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 border border-indigo-400/30 transition-colors shrink-0 backdrop-blur-md"
            >
              Open Full Detail & Thread
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1 backdrop-blur-md">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Category</span>
              <p className="text-xs font-bold text-white">{complaint.category}</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1 backdrop-blur-md">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Assigned Department</span>
              <p className="text-xs font-bold text-indigo-300">{complaint.assignedDepartment}</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1 backdrop-blur-md">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Location</span>
              <p className="text-xs font-bold text-white flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                {complaint.location}
              </p>
            </div>
          </div>

          {/* AI Response Card */}
          {complaint.aiAnalysis && (
            <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900/90 to-purple-950/80 text-white p-5 rounded-2xl border border-indigo-500/30 space-y-3 backdrop-blur-xl shadow-xl">
              <div className="flex items-center gap-2 border-b border-indigo-500/20 pb-2">
                <Bot className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-indigo-300">Automated AI Response</span>
              </div>
              <p className="text-xs italic text-slate-200">"{complaint.aiAnalysis.automatedResponse}"</p>
              <p className="text-[11px] text-emerald-400 font-medium">
                Estimated Resolution Timeframe: {complaint.aiAnalysis.estimatedResolutionTime}
              </p>
            </div>
          )}

          {/* Status Timeline Progress */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Resolution Progress History
            </h3>

            <div className="relative pl-4 space-y-3 border-l-2 border-indigo-500/40">
              {complaint.statusTimeline.map((tl, i) => (
                <div key={tl.id || i} className="relative">
                  <span className="absolute -left-[21px] top-0 w-2.5 h-2.5 rounded-full bg-indigo-400 ring-4 ring-slate-900" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      {tl.status}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(tl.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">{tl.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
