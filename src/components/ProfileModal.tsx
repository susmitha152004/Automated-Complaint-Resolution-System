import React, { useState } from 'react';
import { X, User as UserIcon, Mail, Phone, Building2, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');

    try {
      await updateProfile({ name, phone, department });
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-950/80 border border-white/15 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative p-6 sm:p-8">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-700 text-white font-extrabold text-xl flex items-center justify-center mx-auto mb-3 uppercase shadow-lg border border-indigo-400/30">
            {user.name.charAt(0)}
          </div>
          <h2 className="text-xl font-bold text-white">User Profile</h2>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 capitalize inline-block mt-1 backdrop-blur-md">
            Role: {user.role}
          </span>
        </div>

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-xs font-semibold text-emerald-300 backdrop-blur-md">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email (Read Only)</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-white/5 text-slate-400 border border-white/5 cursor-not-allowed backdrop-blur-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-white/5 border border-white/10 text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:border-indigo-500/80"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 019 2831"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-white/5 border border-white/10 text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:border-indigo-500/80"
              />
            </div>
          </div>

          {user.role === 'admin' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Central Grievance Commission"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-white/5 border border-white/10 text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:border-indigo-500/80"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2 backdrop-blur-md"
          >
            {saving ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Updates</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
