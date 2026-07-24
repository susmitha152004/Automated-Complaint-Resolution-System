import React, { useState } from 'react';
import {
  Sparkles,
  Upload,
  MapPin,
  FileText,
  AlertTriangle,
  Clock,
  Building2,
  CheckCircle2,
  Send,
  X,
  Image as ImageIcon,
  Bot,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AIAnalysis, Complaint } from '../types';

interface SubmitComplaintFormProps {
  onSubmitted: (complaint: Complaint) => void;
  openAuthModal: () => void;
}

export const SubmitComplaintForm: React.FC<SubmitComplaintFormProps> = ({
  onSubmitted,
  openAuthModal,
}) => {
  const { user, isAuthenticated } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysis | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Handle Image Upload & Conversion
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Run Live Gemini AI Auto-Analyzer
  const triggerAiAnalysis = async () => {
    if (!title.trim() || !description.trim()) {
      setError('Please provide a Complaint Title and Description before running AI analysis.');
      return;
    }

    setError('');
    setIsAnalyzing(true);

    try {
      let imageBase64 = '';
      let imageMimeType = '';

      if (imagePreview) {
        const parts = imagePreview.split(';');
        imageMimeType = parts[0].replace('data:', '');
        imageBase64 = parts[1].replace('base64,', '');
      }

      const res = await fetch('/api/complaints/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          imageBase64,
          imageMimeType,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI analysis failed');

      setAiResult(data.analysis);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'AI Analysis failed. You can still submit your complaint.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    if (!title.trim() || !description.trim() || !location.trim()) {
      setError('Please fill in Title, Description, and Location.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const token = localStorage.getItem('app_auth_token');
      
      let imageBase64 = '';
      let imageMimeType = '';

      if (imagePreview) {
        const parts = imagePreview.split(';');
        imageMimeType = parts[0].replace('data:', '');
        imageBase64 = parts[1].replace('base64,', '');
      }

      const payload = {
        title,
        description,
        location,
        address,
        phone,
        imageBase64,
        imageMimeType,
        imageUrl: imagePreview,
      };

      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit complaint');

      onSubmitted(data.complaint);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  const priorityColors = {
    Low: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    Medium: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    High: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    Emergency: 'bg-rose-500/25 text-rose-300 border-rose-500/40 animate-pulse font-bold',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-slate-200 text-xs font-semibold mb-3 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          Powered by Gemini 3.6 Multimodal AI Engine
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Submit Citizen Grievance
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-xl mx-auto">
          Fill in the details below. Our Gemini AI system will automatically classify your complaint, evaluate priority, generate an automated response, and assign the appropriate department.
        </p>
      </div>

      {!isAuthenticated && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 backdrop-blur-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-amber-200">You are currently viewing as Guest</p>
              <p className="text-[11px] text-amber-300/80">You can test the AI Classifier live below, or sign in to track ticket history.</p>
            </div>
          </div>
          <button
            onClick={openAuthModal}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors shrink-0 shadow-md border border-amber-400/30"
          >
            Sign In Now
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-xs font-semibold text-rose-300 backdrop-blur-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Personal & Location Info Grid */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <MapPin className="w-4 h-4 text-indigo-400" />
            Citizen Contact & Location Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Name</label>
              <input
                type="text"
                value={name || user?.name || ''}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Full Name"
                className="w-full px-3 py-2.5 rounded-xl text-xs bg-white/5 border border-white/10 text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:border-indigo-500/80"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={email || user?.email || ''}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@example.com"
                className="w-full px-3 py-2.5 rounded-xl text-xs bg-white/5 border border-white/10 text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:border-indigo-500/80"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone || user?.phone || ''}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 019 2831"
                className="w-full px-3 py-2.5 rounded-xl text-xs bg-white/5 border border-white/10 text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:border-indigo-500/80"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Location / Ward *</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Green Valley Ward 4, Downtown Market"
                className="w-full px-3 py-2.5 rounded-xl text-xs bg-white/5 border border-white/10 text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:border-indigo-500/80"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Street Address / Landmark</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 742 Evergreen Terrace, near Post Office"
                className="w-full px-3 py-2.5 rounded-xl text-xs bg-white/5 border border-white/10 text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:border-indigo-500/80"
              />
            </div>
          </div>
        </div>

        {/* Complaint Details & AI Live Classification Trigger */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              Complaint Description & Media
            </h2>
            <button
              type="button"
              onClick={triggerAiAnalysis}
              disabled={isAnalyzing || !title || !description}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition-all flex items-center gap-1.5 disabled:opacity-50 backdrop-blur-md"
            >
              {isAnalyzing ? (
                <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              )}
              <span>Analyze with Gemini AI</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Complaint Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Water supply completely cut off for 3 days in our colony"
              className="w-full px-3 py-2.5 rounded-xl text-xs bg-white/5 border border-white/10 text-white font-medium placeholder-slate-400 backdrop-blur-md focus:outline-none focus:border-indigo-500/80"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Detailed Description *</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide complete details (e.g. when the issue started, severity, how many people affected)..."
              className="w-full px-3 py-2.5 rounded-xl text-xs bg-white/5 border border-white/10 text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:border-indigo-500/80"
            />
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Upload Photo / Image Evidence (Optional)
            </label>
            {imagePreview ? (
              <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-white/20 group shadow-xl">
                <img src={imagePreview} alt="Evidence Preview" className="w-full h-48 object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview('');
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors border border-white/20"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/15 hover:border-indigo-500/60 rounded-2xl cursor-pointer bg-white/5 backdrop-blur-md transition-colors">
                <Upload className="w-8 h-8 text-indigo-400 mb-2" />
                <span className="text-xs font-semibold text-slate-200">
                  Click to upload or drag & drop evidence image
                </span>
                <span className="text-[10px] text-slate-400 mt-1">PNG, JPG, WEBP up to 10MB</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* AI Live Analysis Result Card */}
        {aiResult && (
          <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900/90 to-purple-950/80 text-white rounded-3xl p-6 shadow-2xl border border-indigo-500/30 space-y-4 animate-fadeIn backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    Gemini AI Real-time Classification
                  </h3>
                  <p className="text-[11px] text-indigo-300">
                    Confidence Score: {(aiResult.confidenceScore * 100).toFixed(0)}%
                  </p>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${priorityColors[aiResult.priority]}`}>
                {aiResult.priority} Priority
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-md">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Detected Category</span>
                <p className="text-xs font-bold text-indigo-300 mt-0.5">{aiResult.category}</p>
              </div>

              <div className="bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-md">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Suggested Dept</span>
                <p className="text-xs font-bold text-purple-300 mt-0.5">{aiResult.suggestedDepartment}</p>
              </div>

              <div className="bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-md">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Est. Resolution Time</span>
                <p className="text-xs font-bold text-emerald-300 mt-0.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {aiResult.estimatedResolutionTime}
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-3 backdrop-blur-md">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">AI Generated Summary</span>
                <p className="text-xs text-slate-200 mt-0.5">{aiResult.summary}</p>
              </div>

              <div className="border-t border-white/10 pt-2">
                <span className="text-[10px] text-indigo-300 uppercase font-bold tracking-wider">Automated Citizen Response</span>
                <p className="text-xs text-slate-100 italic mt-0.5">"{aiResult.automatedResponse}"</p>
              </div>

              <div className="border-t border-white/10 pt-2">
                <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">Recommended Immediate Solution</span>
                <p className="text-xs text-slate-200 mt-0.5">{aiResult.possibleSolution}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting || !title || !description || !location}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 backdrop-blur-md"
          >
            {submitting ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Grievance to Portal</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
