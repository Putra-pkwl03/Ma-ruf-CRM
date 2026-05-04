"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import { createClient } from "../../../lib/supabase";

interface LeadsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LeadsForm({ isOpen, onClose, onSuccess }: LeadsFormProps) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  if (!isOpen) return null;

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  const formElement = e.currentTarget; 
  
  setLoading(true);

  // Panggil user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    Swal.fire("Error", "Sesi berakhir, silakan login kembali", "error");
    setLoading(false);
    return;
  }

  const formData = new FormData(formElement);
  
  const payload = {
    nama: formData.get("nama"),
    kontak: `+62${formData.get("kontak")}`,
    email: formData.get("email"),
    kebutuhan: formData.get("kebutuhan"),
    status: formData.get("status"),
    alamat: formData.get("alamat"),
    sales_id: user.id, 
  };

  // 3. Eksekusi Insert
  const { error } = await supabase.from("leads").insert([payload]);

  if (error) {
    Swal.fire("Error", error.message, "error");
  } else {
    Swal.fire({
      title: "Success!",
      text: "Lead baru berhasil ditambahkan",
      icon: "success",
      timer: 2000,
      showConfirmButton: false
    });
    onSuccess(); 
    onClose();
  }
  setLoading(false);
};

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Add New Prospect</h2>
            <p className="text-xs text-slate-500">Fill in the details to create a new lead in the system</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">Lead Name</label>
            <input 
              required name="nama" type="text" placeholder="e.g. John Doe"
              className="text-gray-500 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Contact Number</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 bg-slate-100 border border-r-0 border-slate-200 rounded-l-lg text-slate-500 text-sm">+62</span>
                <input 
                  required name="kontak" type="tel" placeholder="812 3456 7890"
                  className="text-gray-500 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-r-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Email Address</label>
              <input 
                required name="email" type="email" placeholder="example@company.com"
                className="text-gray-500 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Service Requirement</label>
              <select name="kebutuhan" className="text-gray-500 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm appearance-none">
                <option>50Mbps Home</option>
                <option>100Mbps Business</option>
                <option>Dedicated Fiber</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Status Initial</label>
              <div className="flex items-center gap-4 py-2.5">
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input type="radio" name="status" value="New" defaultChecked className="text-gray-500 w-4 h-4 text-blue-600 focus:ring-blue-500" /> New
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input type="radio" name="status" value="Contacted" className="text-gray-500 w-4 h-4 text-blue-600 focus:ring-blue-500" /> Contacted
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">Address</label>
            <textarea 
              name="alamat" rows={3} placeholder="Enter complete installation address..."
              className="text-gray-500 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm resize-none"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" onClick={onClose}
              className="px-6 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" disabled={loading}
              className="px-6 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}