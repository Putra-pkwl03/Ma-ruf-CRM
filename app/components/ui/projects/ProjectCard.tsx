"use client";

import { AlertTriangle, User, CheckCircle2, XCircle } from "lucide-react";

export default function ProjectCard({ project, userRole, onApprove, onReject }: any) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statusColors: any = {
    'waiting approval': 'border-l-amber-500',
    'approved': 'border-l-green-500',
    'rejected': 'border-l-red-500',
  };

  return (
    <div className={`bg-white p-4 rounded-xl border border-slate-200 border-l-4 ${statusColors[project.status_approval]} shadow-sm hover:shadow-md transition-all group relative`}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-slate-800 text-sm leading-tight group-hover:text-blue-600 transition-colors">
            {project.leads?.nama || "Unknown Lead"}
          </h3>
          <p className="text-[11px] text-slate-400 font-medium">
            {project.leads?.kebutuhan || "Standard Requirement"}
          </p>
        </div>
        {project.status_approval === 'waiting approval' && <AlertTriangle size={16} className="text-amber-500" />}
        {project.status_approval === 'approved' && <CheckCircle2 size={16} className="text-green-500 opacity-50" />}
        {project.status_approval === 'rejected' && <XCircle size={16} className="text-red-500 opacity-50" />}
      </div>

      {/* Product Items */}
      <div className="space-y-2 mb-4">
        {project.project_items?.map((item: any, idx: number) => (
          <div key={idx} className="flex justify-between items-end">
            <p className="text-[11px] text-slate-500 truncate w-32">
              {item.products?.name || "Product Item"}
            </p>
            <p className="text-[11px] font-bold text-slate-700 leading-none">
              {formatCurrency(item.negotiated_price)}
              {project.status_approval === 'waiting approval' && (
                <span className="text-[9px] text-amber-600 ml-1 font-medium">(Nego)</span>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
            <User size={12} className="text-slate-400" />
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            {project.created_at ? new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "-"}
          </span>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">Total Value</p>
          <p className="text-sm font-black text-blue-700 tracking-tight">{formatCurrency(project.total_amount)}</p>
        </div>
      </div>

      {/* Manager Action Buttons */}
      {userRole?.toLowerCase() === "manager" && project.status_approval === "waiting approval" && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-dashed border-slate-100">
          <button 
            onClick={() => onApprove(project.id, project.lead_id)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-[10px] font-bold transition-all"
          >
            APPROVE
          </button>
          <button 
            onClick={() => onReject(project.id)}
            className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 py-2 rounded-lg text-[10px] font-bold transition-all"
          >
            REJECT
          </button>
        </div>
      )}
    </div>
  );
}