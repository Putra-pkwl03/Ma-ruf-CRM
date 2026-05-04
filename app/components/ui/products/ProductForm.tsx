"use client";

import { useState, useEffect } from "react";
import { X, Settings, Info, Pencil } from "lucide-react";
import { createClient } from "../../../lib/supabase";
import Swal from "sweetalert2";

export default function ProductForm({ isOpen, onClose, onSuccess, initialData }: any) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    hpp: 0,
    margin_percent: 0,
  });

  const supabase = createClient();

  // Sync data saat edit
  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        name: initialData.name || "",
        hpp: initialData.hpp || 0,
        margin_percent: initialData.margin_percent || 0,
      });
    } else if (!initialData && isOpen) {
      setFormData({ name: "", hpp: 0, margin_percent: 0 });
    }
  }, [initialData, isOpen]);

  // Kalkulasi Live Preview - Pastikan tidak NaN jika input kosong
  const pricePreview = (formData.hpp || 0) + ((formData.hpp || 0) * (formData.margin_percent || 0) / 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name,
      hpp: formData.hpp,
      margin_percent: formData.margin_percent,
    };

    let error;
    if (initialData) {
      const { error: err } = await supabase.from("products").update(payload).eq("id", initialData.id);
      error = err;
    } else {
      const { error: err } = await supabase.from("products").insert([payload]);
      error = err;
    }

    if (error) {
      Swal.fire("Error", error.message, "error");
    } else {
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Konfigurasi produk telah disimpan",
        timer: 1500,
        showConfirmButton: false,
      });
      onSuccess();
      onClose();
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-xl rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-8 pb-6 flex justify-between items-start">
          <div className="flex gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
              <Settings size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Product Configuration</h2>
              <p className="text-sm text-slate-500 font-medium">Update pricing and service parameters</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
          
          {/* Input: Product Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Product Name</label>
            <div className="relative">
              <input 
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Fiber Home 50Mbps"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-slate-700 font-medium transition-all"
              />
              <Pencil size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" />
            </div>
          </div>

          {/* Row: HPP & Margin */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Base Cost (HPP)</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-medium">Rp</span>
                <input 
                  required
                  type="number"
                  value={formData.hpp || ''} 
                  onChange={(e) => setFormData({...formData, hpp: e.target.value === '' ? 0 : Number(e.target.value)})}
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-500 text-slate-700 font-bold transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Margin (%)</label>
              <div className="relative">
                <input 
                  required
                  type="number"
                  value={formData.margin_percent || ''}
                  onChange={(e) => setFormData({...formData, margin_percent: e.target.value === '' ? 0 : Number(e.target.value)})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-500 text-slate-700 font-bold transition-all"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-medium">%</span>
              </div>
            </div>
          </div>

          {/* Pricing Preview Panel */}
          <div className="py-10 px-6 bg-[#F3F8FF] rounded-[20px] border border-blue-50 text-center space-y-2">
            <p className="text-[10px] font-extrabold text-blue-500 uppercase tracking-[0.2em]">Selling Price Preview</p>
            <h3 className="text-4xl font-black text-[#1E40AF] tracking-tight">
              Rp {pricePreview.toLocaleString('id-ID')}
            </h3>
            <p className="text-[10px] text-blue-400 font-medium italic">
              Calculated automatically based on HPP + Margin
            </p>
          </div>

          {/* Info Box */}
          <div className="flex gap-4 p-5 bg-slate-50/80 rounded-xl border border-slate-100">
            <div className="p-1.5 h-fit bg-white text-blue-500 rounded-full shadow-sm border border-blue-50">
              <Info size={14} />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Changes will apply to new deals. Existing subscriptions will maintain their current pricing.
            </p>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end items-center gap-6 pt-4">
            <button type="button" onClick={onClose} className="text-sm font-bold text-slate-500 hover:text-slate-800">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center gap-3 px-8 py-3 bg-[#0B57D0] text-white rounded-xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}