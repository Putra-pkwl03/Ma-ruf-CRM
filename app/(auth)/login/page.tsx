"use client";

import { useState } from "react";
import { createClient } from "../../lib/supabase"; // Sesuaikan path alias Anda
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import LoginHero from "../../components/ui/login/LoginHero";
import LoginForm from "../../components/ui/login/LoginForm";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: error.message,
        confirmButtonColor: "#0052cc",
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Selamat datang di Smart CRM",
        timer: 1500,
        showConfirmButton: false,
      });
      router.push("/");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 p-4">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Left Side: Hero Section */}
        <LoginHero />

        {/* Right Side: Form Section */}
        <div className="w-full p-8 md:w-1/2 lg:p-12">
          <LoginForm 
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            loading={loading}
            onSubmit={handleLogin}
          />
        </div>
      </div>
    </div>
  );
}