"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// Inisialisasi Supabase Admin dengan Service Role Key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * CREATE: Membuat user baru di Auth dan Profile
 */
export async function createSalesUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const role = formData.get("role") as string;

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName }
  });

  if (authError) {
    if (authError.message.includes("already registered")) {
      return { error: "Email ini sudah terdaftar di sistem." };
    }
    return { error: authError.message };
  }

  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .upsert([
      { 
        id: authData.user.id, 
        full_name: fullName, 
        role: role || "sales",
        email: email 
      }
    ], { onConflict: 'id' }); 

  if (profileError) return { error: "Gagal membuat profil: " + profileError.message };

  revalidatePath("/users");
  return { success: "Pengguna berhasil dibuat!" };
}

/**
 * UPDATE: Memperbarui data profil pengguna
 */
export async function updateSalesUser(userId: string, formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const role = formData.get("role") as string;

  // 1. Update di tabel profiles
  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .update({ 
      full_name: fullName, 
      role: role 
    })
    .eq("id", userId);

  if (profileError) return { error: "Gagal memperbarui profil: " + profileError.message };

  // 2. Update metadata di Auth (opsional, agar konsisten)
  await supabaseAdmin.auth.admin.updateUserById(userId, {
    user_metadata: { full_name: fullName }
  });

  revalidatePath("/users");
  return { success: "Data pengguna berhasil diperbarui!" };
}

/**
 * DELETE: Menghapus user dari Auth dan database
 */
export async function deleteSalesUser(userId: string) {


  // 1. Hapus dari tabel profiles
  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (profileError) return { error: "Gagal menghapus profil: " + profileError.message };

  // 2. Hapus dari Supabase Auth (User tidak akan bisa login lagi)
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (authError) return { error: "Gagal menghapus akun autentikasi: " + authError.message };

  revalidatePath("/users");
  return { success: "Pengguna telah berhasil dihapus." };
}