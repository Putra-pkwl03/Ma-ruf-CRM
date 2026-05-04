"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase";
import { Plus, Search, Filter, Download, ChevronLeft, ChevronRight } from "lucide-react";
import LeadTableRow from "../../components/ui/leads/LeadTableRow";
import LeadStats from "../../components/ui/leads/LeadStats";
import LeadsForm from "../../components/ui/leads/LeadsForm"; 

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const supabase = createClient();
  
  // State untuk Pagination, Search, dan Filter
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const pageSize = 5; 

  // Fetch data setiap kali halaman, pencarian, atau filter berubah
  useEffect(() => {
    fetchLeads();
  }, [currentPage, searchQuery, statusFilter]);

  async function fetchLeads() {
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user?.id)
      .single();

    const from = (currentPage - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("leads")
      .select("*", { count: 'exact' });

    // 1. Role Security Filter
    if (profile?.role !== 'manager') {
      query = query.eq('sales_id', user?.id);
    }

    // 2. Search Filter (berdasarkan nama atau email)
    if (searchQuery) {
      query = query.or(`nama.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
    }

    // 3. Status Filter
    if (statusFilter !== "All") {
      query = query.eq('status', statusFilter);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);
    
    if (!error) {
      setLeads(data || []);
      setTotalCount(count || 0);
    }
    setLoading(false);
  }

  return (
    <div className="p-8 bg-[#F9FAFB] min-h-screen">
      <LeadsForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchLeads} 
      />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Leads Management</h1>
          <p className="text-sm text-slate-500">Overview of potential customers and acquisition pipeline.</p>
        </div>
        <div className="flex items-center gap-3">
           {/* Filter Select */}
           <div className="relative">
             <select 
               value={statusFilter}
               onChange={(e) => {
                 setStatusFilter(e.target.value);
                 setCurrentPage(1); // Reset ke hal 1 saat filter berubah
               }}
               className="appearance-none pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 outline-none transition-all cursor-pointer"
             >
               <option value="All">All Status</option>
               <option value="New">New</option>
               <option value="Contacted">Contacted</option>
               <option value="Qualified">Qualified</option>
             </select>
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
           </div>

           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all">
             <Download size={16} /> Export
           </button>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
           >
             <Plus size={18} /> Add Lead
           </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex justify-between items-center">
            <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                    type="text" 
                    placeholder="Search by name or email..." 
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1); 
                    }}
                    className="text-gray-500 w-full bg-white pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                />
            </div>
            <div className="text-xs text-slate-400 font-medium italic">
                {loading ? "Searching..." : `Found ${totalCount} results`}
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] uppercase tracking-widest text-slate-400 font-bold bg-slate-50/30">
                <th className="px-6 py-4 text-gray-500">Lead Name</th>
                <th className="px-6 py-4 text-gray-500">Contact Details</th>
                <th className="px-6 py-4 text-gray-500">Address</th>
                <th className="px-6 py-4 text-gray-500">Requirement</th>
                <th className="px-6 py-4 text-gray-500">Status</th>
                <th className="px-6 py-4 text-center text-gray-500">Action</th>
                <th className="px-6 py-4 text-right text-gray-500"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="py-20 text-center text-slate-400 animate-pulse">Loading secure data...</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan={6} className="py-20 text-center text-slate-400">No leads found.</td></tr>
              ) : (
                leads.map((lead: any) => (
                  <LeadTableRow key={lead.id} lead={lead} refreshData={fetchLeads} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/20">
            <div className="flex items-center gap-2">
                <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="p-2 border border-slate-200 rounded bg-white text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft size={16}/>
                </button>

                <div className="flex items-center gap-1">
                    <span className="px-3 py-1 border border-blue-600 bg-blue-600 text-white rounded text-sm font-medium">
                        {currentPage}
                    </span>
                    <span className="text-sm text-slate-400 px-1 text-gray-500">of</span>
                    <span className="px-3 py-1 border border-slate-200 bg-white text-slate-600 rounded text-sm text-gray-500">
                        {Math.ceil(totalCount / pageSize) || 1}
                    </span>
                </div>

                <button 
                    disabled={currentPage >= Math.ceil(totalCount / pageSize)}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="p-2 border border-slate-200 rounded bg-white text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight size={16}/>
                </button>
            </div>
            
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                Showing <span className="text-slate-600">{leads.length}</span> of <span className="text-slate-600">{totalCount}</span> Leads
            </div>
        </div>
      </div>

      <LeadStats />
    </div>
  );
}