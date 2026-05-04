"use client";

import { ReactNode } from "react";
import { Activity } from "lucide-react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  trend?: string;
  trendColor?: string;
  subLabel?: string;
}

export default function StatCard({ 
  icon, 
  label, 
  value, 
  trend, 
  trendColor = "text-green-500", 
  subLabel 
}: StatCardProps) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group hover:border-blue-100 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-wider ${trendColor}`}>
            <Activity size={12} /> {trend}
          </div>
        )}
      </div>
      <p className="text-[#94A3B8] text-[11px] font-black uppercase tracking-[0.1em] ">{label}</p>
      <h3 className="text-[24px] font-black text-[#1E293B] tracking-tight">{value}</h3>
      <p className="text-[#64748B] text-xs font-medium">{subLabel}</p>
    </div>
  );
}