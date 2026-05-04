"use client";

import { useState, useEffect } from "react";
import { X, Settings, Info, Pencil, Save } from "lucide-react";
import { createClient } from "../../../lib/supabase";
import Swal from "sweetalert2";

export default function EditProductForm({ isOpen, onClose, onSuccess, productData }: any) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    hpp: 0,
    margin_percent: 0,
  });

  const supabase = createClient();

  // Sinkronisasi data saat modal edit dibuka
  useEffect(() => {
    if (productData && isOpen) {
      setFormData({
        name: productData.name || "",
        hpp: productData.hpp || 0,
        margin_percent: productData.margin_percent || 0,
      });
    }
  }, [productData, isOpen]);

  // Kalkulasi Live Preview Harga Jual
  const pricePreview = (formData.hpp || 0) + ((formData.hpp || 0) * (formData.margin_percent || 0) / 100);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productData?.id) return;
    
    setLoading(true);

    const payload = {
      name: formData.name,
      hpp: formData.hpp,
      margin_percent: formData.margin_percent,
    };

    const { error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", productData.id);

    if (error) {
      Swal.fire("Update Failed", error.message, "error");
    } else {
      Swal.fire({
        icon: "success",
        title: "Product Updated",
        text: "Perubahan telah disimpan. Database akan menghitung ulang harga jual otomatis.",
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
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-xl rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header - Konsisten dengan Form Tambah */}
        <div className="p-8 pb-6 flex justify-between items-start">
          <div className="flex gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
              <Settings size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Edit Configuration</h2>
              <p className="text-sm text-slate-500 font-medium">Modify existing product parameters</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
          
          {/* Input: Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Product Name</label>
            <div className="relative">
              <input 
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
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

          {/* Pricing Preview Panel - Highlighting Changes */}
          <div className="py-10 px-6 bg-[#FFF9F2] rounded-[20px] border border-amber-50 text-center space-y-2">
            <p className="text-[10px] font-extrabold text-amber-600 uppercase tracking-[0.2em]">Updated Selling Price</p>
            <h3 className="text-4xl font-black text-[#92400E] tracking-tight">
              Rp {pricePreview.toLocaleString('id-ID')}
            </h3>
            <p className="text-[10px] text-amber-500/70 font-medium italic">
              New price will take effect immediately after saving
            </p>
          </div>

          {/* Info Box */}
          <div className="flex gap-4 p-5 bg-slate-50/80 rounded-xl border border-slate-100">
            <div className="p-1.5 h-fit bg-white text-blue-500 rounded-full shadow-sm border border-blue-50">
              <Info size={14} />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              You are currently editing <span className="text-slate-800 font-bold">"{productData?.name}"</span>. 
              Ensure the HPP and Margin are correct to maintain profitability.
            </p>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end items-center gap-6 pt-4">
            <button type="button" onClick={onClose} className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
              Discard
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center gap-3 px-10 py-3 bg-[#0B57D0] text-white rounded-xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? "Updating..." : "Update Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}