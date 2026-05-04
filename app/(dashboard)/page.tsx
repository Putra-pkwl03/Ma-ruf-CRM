import { createServerSupabase } from "../lib/supabase";
import { cookies } from "next/headers";
import Link from "next/link"; // Tambahkan ini
import { Users, Package, Briefcase, UserCheck, ArrowRight, Calendar } from "lucide-react";
import { StatCard } from "../components/ui/dashboard/StatCard";
import PipelineChart from "../components/ui/dashboard/PipelineChart";

export default async function HomePage() {
  const cookieStore = await cookies(); 
  const supabase = createServerSupabase(cookieStore);

  // LOGIKA TANGGAL DINAMIS
  const today = new Date();
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
  const dateRange = `${dateFormatter.format(firstDayOfYear)} - ${dateFormatter.format(today)}`;

  // 1. Fetch data untuk statistik utama
  const { count: totalLeads } = await supabase.from("leads").select("*", { count: "exact", head: true });
  const { count: totalProducts } = await supabase.from("products").select("*", { count: "exact", head: true });
  const { count: activeCustomers } = await supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "Active");
  const { count: totalProjects } = await supabase.from("projects").select("*", { count: "exact", head: true });

  // 2. Fetch data untuk Pipeline
  const { data: pipelineData } = await supabase
    .from("projects")
    .select("created_at, status_approval");

  // 3. Proses data untuk Chart
  const months = ["Jan", "Feb", "Mar", "Apr", "May"];
  const chartData = months.map((month, index) => {
    const monthProjects = pipelineData?.filter(p => new Date(p.created_at).getMonth() === index) || [];
    return {
      name: month,
      created: monthProjects.length,
      approved: monthProjects.filter(p => p.status_approval === 'approved').length,
    };
  });

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <nav className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
            Reports &nbsp; / &nbsp; <span className="text-blue-600">Sales & Growth</span>
          </nav>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Sales & Growth Report</h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-slate-400 text-xs font-medium">Viewing: All Sales Data • <span className="italic">Updated just now</span></p>
          </div>
        </div>

        <div className="flex gap-3">
          {/* TANGGAL DINAMIS */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 shadow-sm">
            <Calendar size={16} /> {dateRange}
          </div>
          
          {/* TOMBOL GO TO LEADS */}
          <Link 
            href="/leads"
            className="flex items-center gap-2 bg-[#0F172A] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            Go to Leads <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          name="Total Revenue (MRR)" 
          value={`$${(totalProjects || 0) * 1200}`} 
          icon={Briefcase} 
          trend="+12%" 
          isUp={true} 
          percentage={78}
          color="text-blue-600"
        />
        <StatCard 
          name="Conversion Rate" 
          value="24.8%" 
          icon={Users} 
          trend="-3.1%" 
          isUp={false} 
          percentage={45}
          color="text-indigo-600"
        />
        <StatCard 
          name="Sales Performance" 
          value={`${totalProjects || 0} / 160`} 
          icon={Package} 
          trend="+8%" 
          isUp={true} 
          percentage={62}
          color="text-amber-600"
        />
        <StatCard 
          name="Active Customers" 
          value={activeCustomers || 0} 
          icon={UserCheck} 
          trend="+0.4%" 
          isUp={true} 
          percentage={92}
          color="text-emerald-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Pipeline Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-black text-slate-800">Sales Pipeline</h3>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Deals Created vs. Deals Approved</p>
            </div>
            <div className="flex gap-4">
               <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                 <div className="w-2 h-2 rounded-full bg-blue-200"></div> Created
               </div>
               <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                 <div className="w-2 h-2 rounded-full bg-blue-600"></div> Approved
               </div>
            </div>
          </div>
          
          <div className="h-72 w-full">
            <PipelineChart data={chartData} />
          </div>
        </div>

        {/* Product Distribution */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm">
          <h3 className="font-black text-slate-800 mb-8">Product Distribution</h3>
          <div className="relative flex justify-center mb-8">
            <div className="w-48 h-48 rounded-full border-[12px] border-blue-600 border-t-blue-100 flex items-center justify-center">
               <div className="text-center">
                 <p className="text-2xl font-black text-slate-800">{totalProducts}</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase">Categories</p>
               </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500">ISP Ultra High Speed</span>
              <span className="text-xs font-black text-slate-800">60%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500">Corporate Dedicated</span>
              <span className="text-xs font-black text-slate-800">25%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}