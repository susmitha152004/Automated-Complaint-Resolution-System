import React from 'react';
import { X, BookOpen, Server, Bot, Shield, FileCode2, CheckSquare, Layers } from 'lucide-react';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-950/80 border border-white/15 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative p-6 sm:p-8 space-y-6">
        
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 backdrop-blur-md">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                System Documentation & API Specifications
              </h2>
              <p className="text-xs text-slate-300">Automated Complaint Resolution System Engine</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 text-xs text-slate-300">
          
          {/* Architecture Overview */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              1. System Architecture Overview
            </h3>
            <p className="leading-relaxed">
              The Automated Complaint Resolution System is built on a full-stack Node.js / Express architecture integrated with React 19, Vite, Tailwind CSS, and the Gemini AI API (using the official <code className="bg-white/10 text-indigo-300 px-1.5 py-0.5 rounded font-mono border border-white/10">@google/genai</code> SDK with model <code className="bg-white/10 text-purple-300 px-1.5 py-0.5 rounded font-mono border border-white/10">gemini-3.6-flash</code>).
            </p>
          </div>

          {/* AI Integration & Prompt Pipeline */}
          <div className="space-y-2 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-400" />
              2. Gemini AI Classifier & Auto Response Engine
            </h3>
            <p className="leading-relaxed text-slate-300">
              When a citizen submits a complaint (with optional image evidence), the server passes the text and base64 image payload to Gemini 3.6 Flash using structured JSON schemas (<code className="bg-white/10 px-1 py-0.5 rounded font-mono text-indigo-300">responseSchema</code> with <code className="bg-white/10 px-1 py-0.5 rounded font-mono text-indigo-300">Type.OBJECT</code>).
            </p>
            <div className="bg-slate-900/90 text-slate-200 p-3 rounded-xl font-mono text-[11px] space-y-1 border border-white/10 shadow-inner">
              <p className="text-indigo-400">// AI Output JSON Schema:</p>
              <p className="text-emerald-300">&#123;</p>
              <p className="pl-4">"category": "Water Supply | Electricity | Roads | Garbage | Street Lights...",</p>
              <p className="pl-4">"priority": "Low | Medium | High | Emergency",</p>
              <p className="pl-4">"summary": "1-2 sentence concise summary",</p>
              <p className="pl-4">"automatedResponse": "Official citizen response acknowledgment",</p>
              <p className="pl-4">"suggestedDepartment": "Responsible municipal department",</p>
              <p className="pl-4">"estimatedResolutionTime": "Expected resolution timeframe (e.g. 12 Hours)",</p>
              <p className="pl-4">"possibleSolution": "Recommended initial action or workaround"</p>
              <p className="text-emerald-300">&#125;</p>
            </div>
          </div>

          {/* REST API Endpoints */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              3. REST API Endpoint Reference
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="text-emerald-400 font-bold">POST</span> /api/auth/register
                <p className="text-[10px] text-slate-400 font-sans mt-0.5">Register new user/admin with JWT token.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="text-emerald-400 font-bold">POST</span> /api/auth/login
                <p className="text-[10px] text-slate-400 font-sans mt-0.5">Authenticate credentials and return JWT.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="text-emerald-400 font-bold">POST</span> /api/complaints/ai-analyze
                <p className="text-[10px] text-slate-400 font-sans mt-0.5">Live pre-submit Gemini AI analysis.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="text-emerald-400 font-bold">POST</span> /api/complaints
                <p className="text-[10px] text-slate-400 font-sans mt-0.5">Submit complaint + AI classification.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="text-indigo-400 font-bold">GET</span> /api/complaints
                <p className="text-[10px] text-slate-400 font-sans mt-0.5">Fetch complaints with search & filters.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="text-amber-400 font-bold">PATCH</span> /api/complaints/:id/status
                <p className="text-[10px] text-slate-400 font-sans mt-0.5">Admin status update & timeline record.</p>
              </div>
            </div>
          </div>

          {/* Test Cases */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-purple-400" />
              4. Verification & Test Case Suite
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li><strong>TC-01 (AI Multimodal Classification):</strong> Submit a water leakage issue with image. Verify AI detects category "Water Supply", priority "High", and assigns Water Board.</li>
              <li><strong>TC-02 (Emergency Detection):</strong> Submit "Exposed live sparking wire near school bus stop". Verify AI tags priority as "Emergency" with resolution time "2-4 Hours".</li>
              <li><strong>TC-03 (Admin Workflow):</strong> Login as Admin (admin@gov.org / admin123). Change status to "Under Review" and verify citizen receives real-time notification.</li>
              <li><strong>TC-04 (Ticket Tracker):</strong> Enter ticket reference number in the Track Ticket search tab to verify public status timeline.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
