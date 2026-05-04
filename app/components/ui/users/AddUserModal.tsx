"use client";

import { useState } from "react";
import { X, UserPlus, Mail, Lock, User, Loader2, Shield, ChevronDown, Eye, EyeOff } from "lucide-react";
import { createSalesUser } from "../../../actions/users";
import Swal from "sweetalert2";

export default function AddUserModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    
    const result = await createSalesUser(formData);

    if (result?.error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Menambahkan", 
        text: result.error,         
        confirmButtonColor: "#1e293b",
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Akun baru telah berhasil didaftarkan ke sistem.",
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      
      setTimeout(() => {
        onClose();
      }, 500);
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm p-4 transition-all">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300 border border-slate-100">
        
        <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

        <button 
          onClick={onClose} 
          className="absolute right-6 top-8 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
        >
          <X size={20} />
        </button>

        <div className="p-10">
          <div className="space-y-2 mb-8">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-blue-100">
              <UserPlus size={24} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Tambah Pengguna</h2>
            <p className="text-sm text-slate-500 font-medium">Daftarkan anggota tim baru ke platform CRM.</p>
          </div>

          <form action={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Nama Lengkap</label>
              <div className="group relative">
                <User className="absolute left-4 top-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  name="fullName" 
                  required 
                  className="text-gray-500 w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-300" 
                  placeholder="Budi Santoso" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Role Jabatan</label>
              <div className="group relative">
                <Shield className="absolute left-4 top-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <select 
                  name="role" 
                  className="text-gray-500 w-full pl-12 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="sales">Sales Representative</option>
                  <option value="manager">Manager / Leader</option>
                </select>
                <ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Alamat Email</label>
              <div className="group relative">
                <Mail className="absolute left-4 top-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  name="email" 
                  type="email" 
                  required 
                  className="text-gray-500 w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-300" 
                  placeholder="budi@smart.com" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Password Default</label>
              <div className="group relative">
                <Lock className="absolute left-4 top-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  required 
                  className="text-gray-500 w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-300" 
                  placeholder="••••••••" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              disabled={loading} 
              className="w-full bg-blue-800 text-white py-4 rounded-2xl font-bold text-sm hover:bg-blue-900 transition-all flex justify-center items-center gap-2 mt-6 shadow-xl shadow-slate-200 active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  <UserPlus size={18} />
                  Daftarkan Pengguna
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}