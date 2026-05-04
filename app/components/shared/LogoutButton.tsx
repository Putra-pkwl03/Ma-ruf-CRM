"use client";

import { createClient } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
      Logout
    </button>
  );
}