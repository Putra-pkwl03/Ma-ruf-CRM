"use client";

import { useState } from "react";
import { Edit2, Trash2, ArrowUpRight, Loader2 } from "lucide-react";
import EditLeadForm from "./EditLeadForm"; 
import { createClient } from "../../../lib/supabase";
import Swal from "sweetalert2";

export default function LeadTableRow({ lead, refreshData }: { lead: any, refreshData: () => void }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClient();

  // Fungsi Konfirmasi & Hapus
  const handleDelete = async () => {
    Swal.fire({
      title: "Hapus Lead?",
      text: `Apakah Anda yakin ingin menghapus ${lead.nama}? Data yang dihapus tidak dapat dikembalikan.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444", 
      cancelButtonColor: "#64748b", 
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsDeleting(true);
        
        const { error } = await supabase
          .from("leads")
          .delete()
          .eq("id", lead.id);

        if (error) {
          Swal.fire("Gagal!", "Gagal menghapus data: " + error.message, "error");
        } else {
          Swal.fire({
            title: "Dihapus!",
            text: "Lead berhasil dihapus dari sistem.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
          });
          refreshData(); 
        }
        setIsDeleting(false);
      }
    });
  };

  const getAvatarColor = (name: string) => {
    const colors = ["bg-blue-100 text-blue-600", 
      "bg-purple-100 text-purple-600", 
      "bg-pink-100 text-pink-600", 
      "bg-indigo-100 text-indigo-600", 
      "bg-teal-100 text-teal-600", 
      "bg-orange-100 text-orange-600"];
    const charCode = name?.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  const statusColors: any = {
    New: "bg-blue-50 text-blue-600 border-blue-100",
    Contacted: "bg-orange-50 text-orange-600 border-orange-100",
    Qualified: "bg-purple-50 text-purple-600 border-purple-100",
    Lost: "bg-red-50 text-red-600 border-red-100",
    Active: "bg-green-50 text-green-600 border-green-100",
  };

  return (
    <>
      <tr className="group hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-xs ${getAvatarColor(lead.nama)}`}>
              {lead.nama?.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-slate-800">{lead.nama}</div>
              <div className="text-[10px] text-slate-400 font-mono tracking-tighter">ID: LD-{lead.id.substring(0, 5)}</div>
            </div>
          </div>
        </td>

        <td className="px-6 py-4">
          <div className="text-sm text-slate-600">{lead.kontak}</div>
          <div className="text-xs text-slate-400 truncate max-w-[150px]">{lead.email}</div>
        </td>

        <td className="px-6 py-4">
          <div className="relative group/address">
            <div className="text-sm text-slate-600 truncate max-w-[180px]">{lead.alamat}</div>
          </div>
        </td>

        <td className="px-6 py-4">
          <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600 border border-slate-200">
            {lead.kebutuhan}
          </span>
        </td>

        <td className="px-6 py-4">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${statusColors[lead.status] || "bg-slate-100 text-slate-600"}`}>
            {lead.status}
          </span>
        </td>

        <td className="px-6 py-4 text-center">
          <button className="text-blue-600 hover:text-blue-800 font-semibold text-xs flex items-center gap-1 mx-auto">
            Convert <ArrowUpRight size={14} />
          </button>
        </td>

        <td className="px-6 py-4 text-right">
          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => setIsEditOpen(true)}
              className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
            >
              <Edit2 size={16} />
            </button>
           <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-30"
            >
              {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            </button>
          </div>
        </td>
      </tr>

      {/* Panggil Modal Edit Di Sini */}
      <EditLeadForm 
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={refreshData}
        lead={lead}
      />
    </>
  );
}