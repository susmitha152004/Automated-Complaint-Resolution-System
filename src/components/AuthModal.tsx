import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, loginWithGoogle, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const target = email.trim() || 'sumisumi891988@gmail.com';
      await loginWithGoogle(target, 'Sumi');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google Sign-In failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    const cleanEmail = email.trim();

    try {
      if (mode === 'login') {
        await login(cleanEmail, password || 'user123');
        onClose();
      } else if (mode === 'register') {
        await register(name || 'Citizen', cleanEmail, password || 'user123', phone, role);
        onClose();
      } else if (mode === 'forgot') {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to request reset');
        setSuccessMsg(data.message);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = (type: 'admin' | 'user' | 'sumi') => {
    if (type === 'admin') {
      setEmail('admin@gov.org');
      setPassword('admin123');
      setMode('login');
    } else if (type === 'sumi') {
      setEmail('sumisumi891988@gmail.com');
      setPassword('user123');
      setMode('login');
    } else {
      setEmail('sarah@example.com');
      setPassword('user123');
      setMode('login');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-950/80 border border-white/15 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 text-indigo-300 mx-auto flex items-center justify-center mb-3 backdrop-blur-md shadow-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            {mode === 'login' && 'Sign In to Account'}
            {mode === 'register' && 'Create Citizen Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Access the Automated AI Complaint Resolution Portal
          </p>
        </div>

        {/* Quick Demo Credentials Banner */}
        <div className="mb-6 p-3 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-200 mb-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Instant Demo Sign-In:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillQuickDemo('sumi')}
              className="col-span-2 px-2.5 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-[11px] font-medium text-white hover:border-indigo-300 transition-all text-left shadow-sm backdrop-blur-md flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-indigo-300 block">Your Account (Sumi)</span>
                sumisumi891988@gmail.com
              </div>
              <span className="text-[10px] font-bold text-indigo-200 bg-indigo-600/40 px-2 py-0.5 rounded-md border border-indigo-400/30">Click to Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('user')}
              className="px-2.5 py-1.5 rounded-xl bg-white/5 text-[11px] font-medium text-slate-200 border border-white/10 hover:border-indigo-400 transition-all text-left shadow-sm backdrop-blur-md"
            >
              <span className="font-semibold text-indigo-300 block">Sarah (Citizen)</span>
              sarah@example.com
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('admin')}
              className="px-2.5 py-1.5 rounded-xl bg-white/5 text-[11px] font-medium text-slate-200 border border-white/10 hover:border-amber-400 transition-all text-left shadow-sm backdrop-blur-md"
            >
              <span className="font-semibold text-amber-300 block">Admin Account</span>
              admin@gov.org
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-xs font-medium text-rose-300 backdrop-blur-md">
            {error}
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-xs font-medium text-emerald-300 backdrop-blur-md">
            {successMsg}
          </div>
        )}

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full mb-4 py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-lg border border-slate-200 transition-all flex items-center justify-center gap-3 backdrop-blur-md active:scale-[0.99]"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center justify-center mb-4">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-slate-950 px-3 text-[10px] text-slate-400 uppercase font-bold shrink-0 tracking-wider">
            Or continue with email
          </span>
          <div className="border-t border-white/10 w-full" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-white/5 border border-white/10 text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:border-indigo-500/80"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Phone Number
                </label>
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

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Select Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('user')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      role === 'user'
                        ? 'bg-indigo-600 text-white border-indigo-400/40 shadow-lg shadow-indigo-600/30'
                        : 'bg-white/5 text-slate-300 border-white/10'
                    }`}
                  >
                    Citizen User
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      role === 'admin'
                        ? 'bg-amber-600 text-white border-amber-400/40 shadow-lg shadow-amber-600/30'
                        : 'bg-white/5 text-slate-300 border-white/10'
                    }`}
                  >
                    System Admin
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@example.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-white/5 border border-white/10 text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:border-indigo-500/80"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-indigo-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-white/5 border border-white/10 text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:border-indigo-500/80"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2 backdrop-blur-md"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <span>
                  {mode === 'login' && 'Sign In'}
                  {mode === 'register' && 'Create Account'}
                  {mode === 'forgot' && 'Send Reset Email'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Mode Switch Footers */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-slate-400">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setMode('register')}
                className="font-semibold text-indigo-400 hover:underline"
              >
                Sign Up Now
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                onClick={() => setMode('login')}
                className="font-semibold text-indigo-400 hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
