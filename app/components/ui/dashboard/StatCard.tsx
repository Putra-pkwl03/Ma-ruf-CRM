import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  name: string;
  value: string | number;
  icon: LucideIcon;
  trend: string;
  isUp: boolean;
  percentage: number;
  color: string;
}

export function StatCard({ name, value, icon: Icon, trend, isUp, percentage, color }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-[24px] border border-slate-50 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{name}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-slate-800">{value}</h3>
            <span className={`flex items-center text-[10px] font-bold ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
              {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {trend}
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-current`}>
          <Icon size={20} className={color} />
        </div>
      </div>
      
      {/* Progress Bar Mini */}
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${color.replace('text', 'bg')}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-[9px] text-slate-400 mt-2 font-medium">{percentage}% of quarterly target</p>
    </div>
  );
}