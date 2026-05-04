"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "../../lib/supabase"; 
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Briefcase, 
  UserCheck, 
  BarChart3,
  UserPlus 
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, role: "all" },
  { name: "Leads", href: "/leads", icon: Users, role: "all" },
  { name: "Products", href: "/products", icon: Package, role: "all" },
  { name: "Projects", href: "/projects", icon: Briefcase, role: "all" },
  { name: "Active Customers", href: "/customers", icon: UserCheck, role: "all" },
  { name: "Reports", href: "/reports", icon: BarChart3, role: "all" },
  { name: "Manage Users", href: "/users", icon: UserPlus, role: "manager" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<{full_name: string, role: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', user.id)
          .single();

        if (!error && data) {
          setProfile(data);
        }
      }
      setLoading(false);
    }
    getProfile();
  }, []);

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen border-r border-slate-800">
      <div className="p-6">
        <h2 className="text-xl font-bold tracking-wider text-blue-400">PT. SMART CRM</h2>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">ISP Management System</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {!loading && menuItems.map((item) => {
          // RBAC: Cek akses berdasarkan role dari tabel Profiles
          if (item.role === "manager" && profile?.role !== "manager") {
            return null;
          }

          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
        {loading && (
          <div className="p-4 text-slate-500 text-xs animate-pulse">Loading menu...</div>
        )}
      </nav>
      
      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        <div className="flex flex-col gap-1">
           <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              <p className="text-xs font-semibold text-slate-200">
                {profile?.full_name || "Guest"}
              </p>
           </div>
           <p className="text-[10px] text-slate-400 font-mono">
             Role: <span className={profile?.role === 'manager' ? 'text-amber-400' : 'text-blue-400'}>
               {profile?.role?.toUpperCase() || '---'}
             </span>
           </p>
           <p className="text-[10px] text-slate-600 mt-2">v1.0.0 - Project Magang</p>
        </div>
      </div>
    </aside>
  );
}