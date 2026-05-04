"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase";
import {
  Search,
  Download,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import CustomerTable from "../../components/ui/customers/CustomerTable";
import CustomerStats from "../../components/ui/customers/CustomerStats";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // --- STATE PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const supabase = createClient();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select(
        `
        *,
        projects!inner (
          id,
          status_approval,
          project_items (
            negotiated_price,
            products (
              name,
              price_sell  
            )
          )
        )
      `,
      )
      .eq("status", "Active")
      .eq("projects.status_approval", "approved")
      .order("created_at", { ascending: false });

    if (!error) {
      setCustomers(data || []);
    }
    setLoading(false);
  };

  // --- LOGIKA FILTER & PAGINATION ---
  const filtered = customers.filter(
    (c) =>
      c.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  // Reset ke halaman 1 saat mencari
  const handleSearch = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  return (
    <div className="p-10 bg-[#F8FAFC] min-h-screen font-sans">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
          Customer Management
        </h1>
        <p className="text-slate-500 text-sm font-medium">
          Track and manage your active customer base.
        </p>
      </div>

      <CustomerStats customers={customers} />

      {/* FILTER & SEARCH */}
      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 mb-4 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="text-slate-600 w-full pl-12 pr-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-medium outline-none"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <select className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 outline-none cursor-pointer hover:border-slate-300">
            <option>All Services</option>
            <option>Home</option>
            <option>Business</option>
          </select>
          <button className="bg-[#0052CC] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
            Apply Filters
          </button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden relative mb-10">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              Active Customers List
            </h2>
            <p className="text-slate-400 text-[12px] mt-1 font-bold uppercase tracking-wider">
              Showing {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, filtered.length)} of {filtered.length}{" "}
              Customers
            </p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-all">
              <Download size={20} />
            </button>
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-all">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        <CustomerTable customers={currentItems} loading={loading} />

        {/* MODERN PAGINATION FOOTER */}
        {!loading && filtered.length > itemsPerPage && (
          <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex justify-end items-center gap-6 -mt-20">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={18} /> Prev
            </button>

            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200 scale-110"
                      : "bg-white text-slate-400 border border-slate-200 hover:border-blue-400 hover:text-blue-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
