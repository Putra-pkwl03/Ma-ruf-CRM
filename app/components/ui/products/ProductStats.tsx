import { Box, TrendingUp, AlertTriangle, Clock } from "lucide-react";

export default function ProductStats({ products, userRole }: { products: any[], userRole: string | null }) {
  const isManager = userRole?.toLowerCase() === 'manager';

  // Logika perhitungan statistik
  const totalServices = products.length;
  const avgMargin = totalServices 
    ? (products.reduce((acc, p) => acc + (p.margin_percent || 0), 0) / totalServices).toFixed(1) 
    : 0;
  const lowMarginAlerts = products.filter(p => (p.margin_percent || 0) < 20).length;

  // Data statistik lengkap
  const allStats = [
    {
      id: "total",
      label: "Total Services",
      value: totalServices,
      icon: Box,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      show: true // Selalu tampil
    },
    {
      id: "margin",
      label: "Avg. Margin",
      value: `${avgMargin}%`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      show: isManager // Hanya Manager
    },
    {
      id: "alert",
      label: "Low Margin Alerts",
      value: lowMarginAlerts,
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      show: isManager // Hanya Manager
    },
    {
      id: "updated",
      label: "Last Updated",
      value: "Today, 09:41 AM",
      icon: Clock,
      color: "text-slate-600",
      bgColor: "bg-slate-50",
      show: true // Selalu tampil
    }
  ];

  // Filter data berdasarkan role
  const filteredStats = allStats.filter(stat => stat.show);

  return (
    <div className={`
      grid gap-4 pt-8  border-slate-200
      ${isManager 
        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t" 
        : "grid-cols-1 md:grid-cols-2 lg:flex lg:justify-end mt-4 " 
      }
    `}>
      {filteredStats.map((stat) => (
        <div 
          key={stat.id} 
          className={`
            bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm hover:shadow-md transition-all
            ${!isManager ? "lg:w-64" : ""} 
          `}
        >
          <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.color}`}>
            <stat.icon size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
            <p className="text-lg font-black text-slate-800">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}