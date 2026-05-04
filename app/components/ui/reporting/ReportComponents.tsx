import { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";

// Definisi Tipe untuk Warna Kartu
type StatColor = 'blue' | 'emerald' | 'amber' | 'rose' | 'gray';

interface MiniStatCardProps {
  label: string;
  value: string;
  subValue?: string;
  icon: ReactNode; 
  color?: StatColor; 
  trend?: 'up' | 'down'; 
}

// Map warna Tailwind berdasarkan prop color
const colorMap: Record<StatColor, { bg: string; text: string; iconBg: string }> = {
  blue: { bg: 'bg-blue-50/50', text: 'text-blue-700', iconBg: 'bg-blue-100' },
  emerald: { bg: 'bg-emerald-50/50', text: 'text-emerald-700', iconBg: 'bg-emerald-100' },
  amber: { bg: 'bg-amber-50/50', text: 'text-amber-700', iconBg: 'bg-amber-100' },
  rose: { bg: 'bg-rose-50/50', text: 'text-rose-700', iconBg: 'bg-rose-100' },
  gray: { bg: 'bg-slate-50/50', text: 'text-slate-700', iconBg: 'bg-slate-100' },
};

// Stat Card Modern & Hidup
export function MiniStatCard({ label, value, subValue, icon, color = 'gray', trend }: MiniStatCardProps) {
  const selectedColor = colorMap[color];

  return (
    <div className={`bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group`}>
      <div className="flex justify-between items-start mb-5">
        {/* Kontainer Ikon dengan Background Warna */}
        <div className={`p-3 rounded-2xl ${selectedColor.iconBg} ${selectedColor.text} transition-transform group-hover:scale-110 duration-300`}>
          {icon}
        </div>
        
        {/* SubValue / Tren */}
        {subValue && (
          <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${selectedColor.bg} ${selectedColor.text}`}>
            {trend === 'up' && <TrendingUp size={14} />}
            {subValue}
          </div>
        )}
      </div>

      {/* Label Kategori */}
      <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.15em] mb-1.5">{label}</p>
      
      {/* Nilai Utama */}
      <h3 className="text-[24px] font-black text-slate-900 tracking-tight">{value}</h3>
    </div>
  );
}

// Badge Status untuk Tabel (Tetap seperti sebelumnya, sudah cukup bagus)
export function StatusBadge({ status }: { status: string }) {
  const s = status?.toLowerCase() || "";
  
  let baseClass = "text-[9px] font-black uppercase px-2.5 py-1 rounded-md border tracking-wider";
  
  if (s.includes("approved")) {
    return <span className={`${baseClass} bg-emerald-50 text-emerald-700 border-emerald-100`}>Approved</span>;
  }
  if (s.includes("waiting")) {
    return <span className={`${baseClass} bg-amber-50 text-amber-700 border-amber-100`}>Waiting Approval</span>;
  }
  if (s.includes("rejected")) {
    return <span className={`${baseClass} bg-rose-50 text-rose-700 border-rose-100`}>Rejected</span>;
  }
  
  return <span className={`${baseClass} bg-slate-50 text-slate-600 border-slate-100`}>{status}</span>;
}