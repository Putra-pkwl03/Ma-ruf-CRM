"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation"; 
import { createClient } from "../../lib/supabase";
import LogoutButton from "./LogoutButton";
import { UserCircle } from "lucide-react";

export default function Navbar() {
  const [userName, setUserName] = useState<string>("User");
  const [role, setRole] = useState<string>("Sales");
  const pathname = usePathname(); 
  const supabase = createClient();

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", user.id)
          .single();
        
        if (profile) {
          setUserName(profile.full_name);
          setRole(profile.role);
        }
      }
    };
    getUserData();
  }, [supabase]);

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Overview";
    
    const segment = pathname.split("/").pop() || "Overview";
    return segment
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      <div className="text-sm text-gray-500">
        Main Dashboard / <span className="text-gray-900 font-medium">{getPageTitle()}</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 border-r pr-6">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900 leading-none">{userName}</p>
            <p className="text-xs text-blue-600 capitalize">{role}</p>
          </div>
          <UserCircle className="text-gray-400" size={32} />
        </div>
        
        <LogoutButton />
      </div>
    </header>
  );
}