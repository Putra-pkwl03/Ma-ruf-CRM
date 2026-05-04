"use client";

import { useState } from "react";
import {
  Mail,
  Lock,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Network,
  Eye,
} from "lucide-react";

interface LoginFormProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  onSubmit,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    /* 
       Optimasi Responsif: 
       - Menambahkan padding yang menyesuaikan layar (px-6 untuk mobile, sm:px-10 untuk tablet ke atas).
       - Mengatur lebar maksimal agar tidak terlalu lebar di desktop (max-w-md).
    */
    <div className="flex flex-col h-full justify-between w-full max-w-md mx-auto px-4 sm:px-0">
      
      {/* Header & Form Section */}
      <div className="w-full">
        <div className="flex items-center gap-2 mb-6 sm:mb-8 text-blue-700 font-bold justify-center sm:justify-start">
          <Network size={24} />
          <span className="text-xl tracking-tight">PT. Smart</span>
        </div>

        {/* Ukuran teks yang menyesuaikan layar (text-2xl di mobile, text-3xl di desktop) */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left">
          Employee Login
        </h1>
        <p className="mt-2 text-gray-500 text-sm text-center sm:text-left">
          Enter your credentials to access the ISP management portal.
        </p>

        <form onSubmit={onSubmit} className="mt-6 sm:mt-8 space-y-4 sm:space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-[10px] sm:text-xs font-bold tracking-wider text-gray-400 uppercase">
              Email or Username
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ptsmart.id"
                required
                className="text-gray-600 w-full py-2.5 sm:py-3 pl-10 pr-4 text-sm bg-gray-50 rounded-lg border border-gray-200 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] sm:text-xs font-bold tracking-wider text-gray-400 uppercase">
                Password
              </label>
              <button
                type="button"
                className="text-[10px] sm:text-xs font-semibold text-blue-600 hover:underline hover:text-blue-700 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock
                size={18}
                className="text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="text-gray-600 w-full py-2.5 sm:py-3 pl-10 pr-10 text-sm bg-gray-50 rounded-lg border border-gray-200 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor="remember"
              className="text-[11px] sm:text-xs text-gray-500 cursor-pointer select-none"
            >
              Keep me logged in for 30 days
            </label>
          </div>

          {/* Submit Button - Padding lebih besar di mobile agar mudah ditekan (touch-friendly) */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full py-3 sm:py-3.5 font-semibold text-white bg-blue-600 rounded-lg transition-all items-center justify-center gap-2 hover:bg-blue-700 active:scale-[0.98] disabled:bg-blue-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg shadow-blue-200"
          >
            {loading ? (
              <span className="flex items-center gap-2 italic">
                Authenticating...
              </span>
            ) : (
              <>
                Login <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer Section - Penyesuaian layout tumpuk (stack) pada layar sangat kecil */}
      <div className="mt-8 pt-6 border-t border-gray-100 mb-4">
        <div className="flex flex-col sm:flex-row gap-4 text-[10px] text-gray-400 tracking-widest font-bold items-center justify-between uppercase">
          <div className="flex items-center gap-1">
            <ShieldCheck size={12} className="text-green-500" /> Secure Enterprise Access
          </div>
          <div className="flex gap-4 capitalize">
            <span className="cursor-pointer hover:text-blue-500 transition-colors">Support</span>
            <span className="cursor-pointer hover:text-blue-500 transition-colors">Privacy</span>
          </div>
        </div>
        <p className="mt-4 text-center text-[9px] sm:text-[10px] text-gray-300 uppercase tracking-tight leading-relaxed">
          © 2026 PT. SMART - ISP Management System.<br className="sm:hidden" /> Internal Use Only.
        </p>
      </div>
    </div>
  );
}