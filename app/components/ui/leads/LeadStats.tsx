"use client";

import { useEffect, useState } from "react";
import { Users, CheckCircle2, Clock, BarChart3 } from "lucide-react";
import { createClient } from "../../../lib/supabase"; 

export default function LeadStats() {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    total: 0,
    qualified: 0,
    contacted: 0,
    convRate: 0,
  });

  const supabase = createClient();

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Ambil profile untuk cek role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      // Mulai query dasar
      let query = supabase.from("leads").select("status", { count: "exact" });

      // Filter jika bukan manager
      if (profile?.role !== "manager") {
        query = query.eq("sales_id", user.id);
      }

      const { data, count, error } = await query;

      if (error) throw error;

      const total = count || 0;
      const qualified = data?.filter((i) => i.status === "Qualified").length || 0;
      const contacted = data?.filter((i) => i.status === "Contacted").length || 0;
      
      const rate = total > 0 ? (qualified / total) * 100 : 0;

      setCounts({
        total,
        qualified,
        contacted,
        convRate: parseFloat(rate.toFixed(1)),
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }

  const stats = [
    { label: "Total Leads", value: counts.total.toLocaleString(), icon: Users, color: "border-l-blue-500" },
    { label: "Qualified", value: counts.qualified.toLocaleString(), icon: CheckCircle2, color: "border-l-green-500" },
    { label: "Contacted", value: counts.contacted.toLocaleString(), icon: Clock, color: "border-l-orange-500" },
    { label: "Conv. Rate", value: `${counts.convRate}%`, icon: BarChart3, color: "border-l-indigo-500" },
  ];

  if (loading) return <div className="h-24 flex items-center justify-center text-slate-400">Loading stats...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
      {stats.map((stat, i) => (
        <div key={i} className={`bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 ${stat.color}`}>
          <div className="flex items-center justify-between mb-2">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
             <stat.icon size={20} className="text-slate-300" />
          </div>
          <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}