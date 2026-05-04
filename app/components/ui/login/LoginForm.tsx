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
    <div className="flex flex-col h-full justify-between">
      {/* Header & Form Section */}
      <div>
        <div className="flex items-center gap-2 mb-8 text-blue-700 font-bold">
          <Network size={24} />
          <span className="text-xl tracking-tight">PT. Smart</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-800">Employee Login</h1>
        <p className="mt-2 text-gray-500 text-sm">
          Enter your credentials to access the ISP management portal.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-wider text-gray-400 uppercase">
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
                placeholder="e.g. admin@ptsmart.id"
                required
                className="text-gray-500 w-full py-2.5 pl-10 pr-4 text-sm bg-gray-50 rounded-lg border border-gray-200 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                Password
              </label>
              <button
                type="button"
                className="text-xs font-semibold text-blue-600 hover:underline hover:text-blue-700 transition-colors"
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
                className="text-gray-500 w-full py-2.5 pl-10 pr-10 text-sm bg-gray-50 rounded-lg border border-gray-200 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor="remember"
              className="text-xs text-gray-500 cursor-pointer select-none"
            >
              Keep me logged in for 30 days
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full py-3 font-semibold text-white bg-blue-600 rounded-lg transition-all items-center justify-center gap-2 hover:bg-blue-700 active:scale-[0.98] disabled:bg-blue-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg shadow-blue-200"
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

      {/* Footer Section */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="flex text-[10px] text-gray-400 tracking-widest font-bold items-center justify-between uppercase">
          <div className="flex items-center gap-1">
            <ShieldCheck size={12} className="text-green-500" /> Secure Enterprise Access
          </div>
          <div className="flex gap-3 capitalize">
            <span className="cursor-pointer hover:text-blue-500 transition-colors">Support</span>
            <span className="cursor-pointer hover:text-blue-500 transition-colors">Privacy</span>
          </div>
        </div>
        <p className="mt-4 text-center text-[10px] text-gray-300 uppercase tracking-tight">
          © 2026 PT. SMART - ISP Management System. Internal Use Only.
        </p>
      </div>
    </div>
  );
}