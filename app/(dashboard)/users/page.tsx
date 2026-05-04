"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { UserPlus, Loader2, Pencil, Trash2, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "../../lib/supabase"; 
import AddUserModal from "../../components/ui/users/AddUserModal";
import EditUserModal from "../../components/ui/users/EditUserModal";
import Swal from "sweetalert2";

export default function UserManagementPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // STATE SEARCH, FILTER, & PAGINATION
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const supabase = createClient();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select(`id, full_name, role, email`)
      .order('full_name', { ascending: true });

    if (!error) {
      setUsers(data || []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // LOGIKA FILTER & SEARCH
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = 
        user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = 
        roleFilter === "All Roles" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  // LOGIKA PAGINATION
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handleEdit = (id: string) => {
    const userToEdit = users.find(u => u.id === id);
    if (userToEdit) {
      setSelectedUser(userToEdit);
      setEditModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: 'Apakah anda yakin?',
      text: "Data pengguna akan dihapus permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { error } = await supabase.from("profiles").delete().eq("id", id);
        if (!error) {
          Swal.fire('Berhasil!', 'Pengguna telah dihapus.', 'success');
          fetchUsers();
        }
      }
    })
  };

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Manajemen Pengguna</h1>
          <p className="text-slate-500 font-medium">Kelola tim sales dan akses manager PT. Smart</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 w-fit"
        >
          <UserPlus size={20} />
          Tambah Pengguna
        </button>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Cari nama atau email..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
        <div className="relative w-full md:w-48">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select 
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none appearance-none font-bold text-slate-600"
          >
            <option>All Roles</option>
            <option>Manager</option>
            <option>Sales</option>
            <option>Admin</option>
          </select>
        </div>
        <div className="ml-auto pr-4 hidden md:block">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
             Total: {filteredUsers.length} Pengguna
           </p>
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pengguna</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-blue-500" size={40} />
                    <p className="text-xs font-bold text-slate-400 mt-4 uppercase">Memuat Data...</p>
                  </td>
                </tr>
              ) : currentUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-slate-400 text-sm font-medium">
                    Tidak ada pengguna yang ditemukan.
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <UserRow 
                    key={user.id}
                    id={user.id}
                    name={user.full_name} 
                    email={user.email || "No email"} 
                    role={user.role} 
                    status="Active"
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        {!loading && filteredUsers.length > itemsPerPage && (
          <div className="p-6 bg-slate-50/30 border-t border-slate-50 flex justify-end items-center gap-4">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 text-slate-400 hover:text-blue-600 disabled:opacity-20 transition-all bg-white rounded-xl border border-slate-200 shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-xl text-[11px] font-black transition-all ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "bg-white text-slate-400 border border-slate-200 hover:text-blue-600 hover:border-blue-400"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 text-slate-400 hover:text-blue-600 disabled:opacity-20 transition-all bg-white rounded-xl border border-slate-200 shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      <AddUserModal 
        isOpen={isModalOpen} 
        onClose={() => { setModalOpen(false); fetchUsers(); }} 
      />
      <EditUserModal 
        isOpen={isEditModalOpen}
        userData={selectedUser}
        onClose={() => { setEditModalOpen(false); setSelectedUser(null); fetchUsers(); }}
      />
    </div>
  );
}

// Sub-component UserRow (Tetap sama dengan sedikit penyesuaian gaya)
function UserRow({ id, name, email, role, status, onEdit, onDelete }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-xs">
            {name ? name.charAt(0).toUpperCase() : "?"}
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm">{name}</p>
            <p className="text-xs text-slate-400">{email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
          role?.toLowerCase() === 'manager' 
          ? 'bg-purple-50 text-purple-600 border border-purple-100' 
          : 'bg-blue-50 text-blue-600 border border-blue-100'
        }`}>
          {role || 'Staff'}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          <span className="text-xs font-bold text-slate-600">{status}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end items-center gap-2">
          <button onClick={() => onEdit(id)} className="p-2 hover:bg-blue-50 rounded-xl transition-all text-slate-400 hover:text-blue-600">
            <Pencil size={18} />
          </button>
          <button onClick={() => onDelete(id)} className="p-2 hover:bg-red-50 rounded-xl transition-all text-slate-400 hover:text-red-600">
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}