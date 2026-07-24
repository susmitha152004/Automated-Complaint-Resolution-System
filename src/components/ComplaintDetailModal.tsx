import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Clock,
  Building2,
  AlertTriangle,
  Send,
  User as UserIcon,
  Bot,
  CheckCircle2,
  FileText,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { Complaint, ComplaintResponse, PriorityType, StatusType } from '../types';
import { useAuth } from '../context/AuthContext';

interface ComplaintDetailModalProps {
  complaint: Complaint | null;
  onClose: () => void;
  onComplaintUpdated?: (updated: Complaint) => void;
}

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({
  complaint,
  onClose,
  onComplaintUpdated,
}) => {
  const { user } = useAuth();
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(complaint);
  const [responses, setResponses] = useState<ComplaintResponse[]>([]);
  const [newReply, setNewReply] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  // Admin Controls
  const [newStatus, setNewStatus] = useState<StatusType>('Pending');
  const [statusNote, setStatusNote] = useState('');
  const [assignedDept, setAssignedDept] = useState('');
  const [assignedStaff, setAssignedStaff] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    setActiveComplaint(complaint);
    if (complaint) {
      setNewStatus(complaint.status);
      setAssignedDept(complaint.assignedDepartment || '');
      setAssignedStaff(complaint.assignedStaff || '');
      fetchResponses(complaint.id);
    }
  }, [complaint]);

  const fetchResponses = async (id: string) => {
    try {
      const token = localStorage.getItem('app_auth_token');
      const res = await fetch(`/api/complaints/${id}/responses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setResponses(data.responses || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeComplaint || !newReply.trim()) return;

    setSendingReply(true);
    try {
      const token = localStorage.getItem('app_auth_token');
      const res = await fetch(`/api/complaints/${activeComplaint.id}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: newReply }),
      });

      if (res.ok) {
        const data = await res.json();
        setResponses((prev) => [...prev, data.response]);
        setNewReply('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSendingReply(false);
    }
  };

  const handleUpdateStatus = async (statusToSet: StatusType) => {
    if (!activeComplaint) return;
    setUpdatingStatus(true);

    try {
      const token = localStorage.getItem('app_auth_token');
      const res = await fetch(`/api/complaints/${activeComplaint.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: statusToSet, note: statusNote }),
      });

      if (res.ok) {
        const data = await res.json();
        setActiveComplaint(data.complaint);
        setStatusNote('');
        if (onComplaintUpdated) onComplaintUpdated(data.complaint);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAssignDept = async () => {
    if (!activeComplaint || !assignedDept) return;
    setUpdatingStatus(true);

    try {
      const token = localStorage.getItem('app_auth_token');
      const res = await fetch(`/api/complaints/${activeComplaint.id}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ department: assignedDept, staff: assignedStaff }),
      });

      if (res.ok) {
        const data = await res.json();
        setActiveComplaint(data.complaint);
        if (onComplaintUpdated) onComplaintUpdated(data.complaint);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (!activeComplaint) return null;

  const priorityStyles: Record<PriorityType, string> = {
    Low: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    Medium: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    High: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    Emergency: 'bg-rose-500/25 text-rose-300 border-rose-500/40 animate-pulse font-bold',
  };

  const statusStyles: Record<StatusType, string> = {
    Pending: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    'Under Review': 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
    Resolved: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    Rejected: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-950/80 border border-white/15 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative p-6 sm:p-8 space-y-6">
        
        {/* Modal Top Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-white/10 text-indigo-300 border border-white/10">
                {activeComplaint.ticketNumber}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusStyles[activeComplaint.status]}`}>
                {activeComplaint.status}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${priorityStyles[activeComplaint.priority]}`}>
                {activeComplaint.priority} Priority
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">
              {activeComplaint.title}
            </h2>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              {activeComplaint.location} • {activeComplaint.address}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Complaint Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Info column (2 cols) */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Description & Evidence */}
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-3 backdrop-blur-md">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Grievance Description
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                {activeComplaint.description}
              </p>

              {activeComplaint.imageUrl && (
                <div className="pt-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Uploaded Evidence Photo</span>
                  <img
                    src={activeComplaint.imageUrl}
                    alt="Evidence"
                    className="w-full max-h-64 object-cover rounded-xl border border-white/10"
                  />
                </div>
              )}
            </div>

            {/* AI Auto Resolution Card */}
            {activeComplaint.aiAnalysis && (
              <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900/90 to-purple-950/80 text-white p-5 rounded-2xl border border-indigo-500/30 space-y-3 shadow-xl backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-indigo-400" />
                    Gemini AI Resolution Analysis
                  </span>
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Est: {activeComplaint.aiAnalysis.estimatedResolutionTime}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Category:</span>
                    <span className="font-semibold text-indigo-200">{activeComplaint.category}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Suggested Department:</span>
                    <span className="font-semibold text-indigo-200">{activeComplaint.assignedDepartment}</span>
                  </div>
                </div>

                <div className="text-xs bg-slate-900/80 p-3 rounded-xl border border-white/10 space-y-1">
                  <span className="text-[10px] text-indigo-300 font-bold uppercase block">Automated System Response:</span>
                  <p className="text-slate-200 italic">"{activeComplaint.aiAnalysis.automatedResponse}"</p>
                </div>

                {activeComplaint.aiAnalysis.possibleSolution && (
                  <div className="text-xs">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase block">Action Recommendation:</span>
                    <p className="text-slate-200 mt-0.5">{activeComplaint.aiAnalysis.possibleSolution}</p>
                  </div>
                )}
              </div>
            )}

            {/* Official Response & Discussion Thread */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                Response & Update Thread ({responses.length})
              </h3>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {responses.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">No responses added yet.</p>
                ) : (
                  responses.map((r) => (
                    <div
                      key={r.id}
                      className={`p-3 rounded-xl text-xs space-y-1 border backdrop-blur-md ${
                        r.senderRole === 'admin'
                          ? 'bg-amber-500/15 border-amber-500/30 text-amber-200'
                          : r.senderRole === 'system'
                          ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-200'
                          : 'bg-white/5 border-white/10 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          {r.senderRole === 'system' ? <Bot className="w-3.5 h-3.5 text-indigo-400" /> : <UserIcon className="w-3.5 h-3.5 text-slate-300" />}
                          {r.senderName}
                          <span className="text-[10px] font-normal text-slate-400 capitalize">({r.senderRole})</span>
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-200">{r.message}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Reply Input Box */}
              <form onSubmit={handleSendReply} className="flex gap-2">
                <input
                  type="text"
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  placeholder="Type a response or update note..."
                  className="flex-1 px-3 py-2 rounded-xl text-xs bg-white/5 border border-white/10 text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:border-indigo-500/80"
                />
                <button
                  type="submit"
                  disabled={sendingReply || !newReply.trim()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 border border-indigo-400/30 shadow-lg shadow-indigo-600/30 disabled:opacity-50 transition-all backdrop-blur-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar Timeline & Admin Controls (1 col) */}
          <div className="space-y-6">
            
            {/* Status Timeline */}
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-3 backdrop-blur-md">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                Status Timeline
              </h3>

              <div className="relative pl-4 space-y-4 border-l-2 border-indigo-500/40">
                {activeComplaint.statusTimeline.map((tl, i) => (
                  <div key={tl.id || i} className="relative">
                    <span className="absolute -left-[21px] top-0 w-2.5 h-2.5 rounded-full bg-indigo-400 ring-4 ring-slate-900" />
                    <span className="text-[11px] font-bold text-white block">
                      {tl.status}
                    </span>
                    <p className="text-[10px] text-slate-300">{tl.note}</p>
                    <span className="text-[9px] text-slate-400 block mt-0.5">
                      {new Date(tl.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Controls Panel */}
            {user?.role === 'admin' && (
              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl space-y-4 backdrop-blur-md">
                <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  Admin Actions
                </h3>

                {/* Status Change */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold text-amber-200">
                    Update Complaint Status
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['Pending', 'Under Review', 'Resolved', 'Rejected'] as StatusType[]).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleUpdateStatus(st)}
                        disabled={updatingStatus}
                        className={`py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all border backdrop-blur-md ${
                          activeComplaint.status === st
                            ? 'bg-amber-600 text-white border-amber-400/50 shadow-md shadow-amber-600/30'
                            : 'bg-white/5 text-slate-300 border-white/10 hover:border-amber-400/50'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Status update note..."
                    className="w-full px-2.5 py-1.5 rounded-lg text-[11px] bg-white/5 border border-white/10 text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:border-amber-400/60"
                  />
                </div>

                {/* Department Assignment */}
                <div className="space-y-2 pt-2 border-t border-amber-500/20">
                  <label className="block text-[11px] font-semibold text-amber-200">
                    Assign Department & Staff
                  </label>
                  <input
                    type="text"
                    value={assignedDept}
                    onChange={(e) => setAssignedDept(e.target.value)}
                    placeholder="Department Name"
                    className="w-full px-2.5 py-1.5 rounded-lg text-[11px] bg-white/5 border border-white/10 text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:border-amber-400/60"
                  />
                  <input
                    type="text"
                    value={assignedStaff}
                    onChange={(e) => setAssignedStaff(e.target.value)}
                    placeholder="Assigned Staff / Officer"
                    className="w-full px-2.5 py-1.5 rounded-lg text-[11px] bg-white/5 border border-white/10 text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:border-amber-400/60"
                  />
                  <button
                    type="button"
                    onClick={handleAssignDept}
                    disabled={updatingStatus}
                    className="w-full py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all border border-amber-400/30 shadow-md shadow-amber-600/20 backdrop-blur-md"
                  >
                    Save Assignment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
