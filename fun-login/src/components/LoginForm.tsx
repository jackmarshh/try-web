import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, Loader2, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import LoginCharacter from './LoginCharacter';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isTypingUsername, setIsTypingUsername] = useState(false);
  const [isTypingPassword, setIsTypingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);

  useEffect(() => {
    let timer: number;
    if (lockoutTime > 0) {
      timer = window.setInterval(() => {
        setLockoutTime((prev) => prev - 1);
      }, 1000);
    } else if (lockoutTime === 0 && failedAttempts >= 3) {
      setFailedAttempts(0);
    }
    return () => clearInterval(timer);
  }, [lockoutTime, failedAttempts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTime > 0) return;
    setIsLoading(true);
    setStatus('idle');

    // Simulate validation
    setTimeout(() => {
      setIsLoading(false);
      if (username === 'admin' && password === '123456') {
        setStatus('success');
        setFailedAttempts(0);
      } else {
        setStatus('error');
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        if (newAttempts >= 3) {
          setLockoutTime(10); // 10 seconds lockout
        }
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white rounded-[2rem] shadow-xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden relative z-10 min-h-[600px]"
      >
        {/* Left Section - Character */}
        <div className="md:w-1/2 relative bg-[#7B51F4]">
          <LoginCharacter
            isTypingUsername={isTypingUsername}
            isTypingPassword={isTypingPassword}
            isPasswordVisible={showPassword}
            status={status}
          />
        </div>

        {/* Right Section - Form */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
            <p className="text-gray-500">Please enter your details</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto w-full">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="anna@gmail.com"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-[#7B51F4] focus:ring-2 focus:ring-[#7B51F4]/20 transition-all outline-none disabled:bg-gray-100 disabled:text-gray-400 placeholder:text-gray-400"
                  onFocus={() => setIsTypingUsername(true)}
                  onBlur={() => setIsTypingUsername(false)}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={lockoutTime > 0}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-[#7B51F4] focus:ring-2 focus:ring-[#7B51F4]/20 transition-all outline-none pr-12 disabled:bg-gray-100 disabled:text-gray-400 placeholder:text-gray-400"
                  onFocus={() => setIsTypingPassword(true)}
                  onBlur={() => setIsTypingPassword(false)}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={lockoutTime > 0}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={lockoutTime > 0}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm mt-2 mb-6">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 text-[#7B51F4] focus:ring-[#7B51F4] transition-colors cursor-pointer accent-[#7B51F4]" 
                  disabled={lockoutTime > 0}
                />
                <span className="text-gray-600 font-medium">Remember for 30 days</span>
              </label>
              <a href="#" className="text-[#7B51F4] hover:text-[#5f3dc4] font-semibold transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading || lockoutTime > 0}
              className={`w-full ${lockoutTime > 0 ? 'bg-red-500 hover:bg-red-600' : 'bg-[#7B51F4] hover:bg-[#6A41E5]'} text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : lockoutTime > 0 ? (
                `Locked (${lockoutTime}s)`
              ) : (
                "Log in"
              )}
            </button>

            <button
              type="button"
              disabled={lockoutTime > 0}
              className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-4"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Log in with Google
            </button>

            <div className="text-center mt-8">
              <p className="text-gray-600 text-sm">
                Don't have an account? <a href="#" className="text-gray-900 font-bold hover:underline">Sign Up</a>
              </p>
            </div>

            {status === 'error' && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm text-center"
              >
                {lockoutTime > 0 
                  ? `Too many failed attempts. Try again in ${lockoutTime}s.` 
                  : `Invalid username or password. ${3 - failedAttempts} attempts left.`}
              </motion.p>
            )}
            {status === 'success' && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-600 text-sm text-center font-medium"
              >
                ✨ Login Successful! Welcome home.
              </motion.p>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;
