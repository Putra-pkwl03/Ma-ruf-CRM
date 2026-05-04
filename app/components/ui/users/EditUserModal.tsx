"use client";

import { useState, useEffect } from "react";
import { X, Pencil, Mail, User, Loader2, Shield, ChevronDown } from "lucide-react";
// Ganti dengan action update yang sesuai nanti
import { updateSalesUser } from "../../../actions/users"; 
import Swal from "sweetalert2";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: any; // Data user yang akan diedit
}

export default function EditUserModal({ isOpen, onClose, userData }: EditUserModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !userData) return null;

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    
    // Kirim ID user bersama data form
    const result = await updateSalesUser(userData.id, formData);

    if (result?.error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Memperbarui", 
        text: result.error,         
        confirmButtonColor: "#1e293b",
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data pengguna telah diperbarui.",
        timer: 1500,
        showConfirmButton: false,
      });
      onClose();
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300 border border-slate-100">
        
        <div className="h-2 bg-gradient-to-r from-emerald-500 to-blue-500" />

        <button onClick={onClose} className="absolute right-6 top-8 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-all">
          <X size={20} />
        </button>

        <div className="p-10">
          <div className="space-y-2 mb-8">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 border border-emerald-100">
              <Pencil size={24} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Edit Pengguna</h2>
            <p className="text-sm text-slate-500 font-medium">Perbarui informasi profil pengguna yang dipilih.</p>
          </div>

          <form action={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Nama Lengkap</label>
              <div className="group relative">
                <User className="absolute left-4 top-3 text-slate-400 group-focus-within:text-blue-500" size={18} />
                <input 
                  name="fullName" 
                  defaultValue={userData.full_name}
                  required 
                  className="text-gray-500 w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Role Jabatan</label>
              <div className="group relative">
                <Shield className="absolute left-4 top-3 text-slate-400 group-focus-within:text-blue-500" size={18} />
                <select 
                  name="role" 
                  defaultValue={userData.role?.toLowerCase()}
                  className="text-gray-500 w-full pl-12 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none appearance-none cursor-pointer focus:bg-white focus:border-blue-500"
                >
                  <option value="sales">Sales Representative</option>
                  <option value="manager">Manager / Leader</option>
                </select>
                <ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Alamat Email (Read Only)</label>
              <div className="group relative">
                <Mail className="absolute left-4 top-3 text-slate-300" size={18} />
                <input 
                  name="email" 
                  defaultValue={userData.email}
                  readOnly
                  className="text-gray-400 w-full pl-12 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-sm outline-none cursor-not-allowed" 
                />
              </div>
            </div>

            <button 
              disabled={loading} 
              className="w-full bg-slate-800 text-white py-4 rounded-2xl font-bold text-sm hover:bg-slate-900 transition-all flex justify-center items-center gap-2 mt-6 shadow-xl shadow-slate-200 active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Simpan Perubahan"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}