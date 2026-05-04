"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import { createClient } from "../../../lib/supabase";

interface EditLeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lead: any; // Data awal yang akan diedit
}

export default function EditLeadForm({ isOpen, onClose, onSuccess, lead }: EditLeadFormProps) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  if (!isOpen) return null;

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const rawKontak = formData.get("kontak")?.toString() || "";
    
    const payload = {
      nama: formData.get("nama"),
      kontak: rawKontak.startsWith('+62') ? rawKontak : `+62${rawKontak}`,
      email: formData.get("email"),
      kebutuhan: formData.get("kebutuhan"),
      status: formData.get("status"),
      alamat: formData.get("alamat"),
    };

    const { error } = await supabase
      .from("leads")
      .update(payload)
      .eq("id", lead.id);

    if (error) {
      Swal.fire("Error", error.message, "error");
    } else {
      Swal.fire({
        title: "Updated!",
        text: "Data prospek berhasil diperbarui",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });
      onSuccess();
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Edit Prospect</h2>
            <p className="text-xs text-slate-500">ID: {lead.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleUpdate} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">Lead Name</label>
            <input 
              required name="nama" type="text" defaultValue={lead.nama}
              className="text-gray-600 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Contact Number</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 bg-slate-100 border border-r-0 border-slate-200 rounded-l-lg text-slate-500 text-sm">+62</span>
                <input 
                  required name="kontak" type="tel" 
                  defaultValue={String(lead.kontak ?? "").replace("+62", "")}
                  className="text-gray-600 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-r-lg outline-none focus:border-blue-500 text-sm"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Email Address</label>
              <input 
                required name="email" type="email" defaultValue={lead.email}
                className="text-gray-600 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Requirement</label>
              <select name="kebutuhan" defaultValue={lead.kebutuhan} className="text-gray-600 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-sm">
                <option>50Mbps Home</option>
                <option>100Mbps Business</option>
                <option>Dedicated Fiber</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Status</label>
              <select name="status" defaultValue={lead.status} className="text-gray-600 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-sm">
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">Address</label>
            <textarea 
              name="alamat" rows={3} defaultValue={lead.alamat}
              className="text-gray-600 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-sm resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-6 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {loading ? "Updating..." : "Update Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}