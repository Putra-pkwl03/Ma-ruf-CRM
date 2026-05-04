"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "../../lib/supabase";
import { Download, Filter, Users, Calendar, Target, Banknote, Percent, ChevronLeft, ChevronRight } from "lucide-react";
import * as XLSX from "xlsx";
import { MiniStatCard, StatusBadge } from "../../components/ui/reporting/ReportComponents";

export default function ReportingPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [salesFilter, setSalesFilter] = useState("All Representatives");
  const [salesList, setSalesList] = useState<string[]>([]);

  const supabase = createClient();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    await fetchSalesList();
    await fetchReportData();
  };

  const fetchSalesList = async () => {
    const { data: leads } = await supabase.from("leads").select("sales_id");
    if (leads) {
      const uniqueSales = Array.from(new Set(leads.map(l => l.sales_id))).filter(Boolean);
      setSalesList(uniqueSales as string[]);
    }
  };

  const fetchReportData = async () => {
    setLoading(true);
    setCurrentPage(1); // Reset ke halaman 1 setiap filter berubah
    
    let query = supabase.from("projects").select(`
      id, created_at, status_approval,
      leads!inner (
        nama, sales_id, alamat, kontak, email
      ),
      project_items (negotiated_price, products (name, hpp, price_sell))
    `);

    if (startDate) query = query.gte("created_at", `${startDate}T00:00:00`);
    if (endDate) query = query.lte("created_at", `${endDate}T23:59:59`);
    if (statusFilter !== "All Statuses") query = query.eq("status_approval", statusFilter.toLowerCase());
    if (salesFilter !== "All Representatives") query = query.eq("leads.sales_id", salesFilter);

    const { data: res, error } = await query.order('created_at', { ascending: false });
    
    if (!error) setData(res || []);
    setLoading(false);
  };

  // LOGIKA PAGINATION
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Logika Kalkulasi (Tetap menggunakan total 'data' bukan 'currentItems')
  const { totalRevenue, totalHpp, approvedCount } = useMemo(() => {
    const rev = data.reduce((acc, p) => 
      acc + p.project_items.reduce((s: any, i: any) => s + Number(i.negotiated_price || 0), 0), 0
    );
    const hpp = data.reduce((acc, p) => 
      acc + p.project_items.reduce((s: any, i: any) => s + Number(i.products?.hpp || 0), 0), 0
    );
    const approved = data.filter(p => p.status_approval?.toLowerCase() === 'approved').length;
    return { totalRevenue: rev, totalHpp: hpp, approvedCount: approved };
  }, [data]);

  const profitMargin = totalRevenue - totalHpp;

const exportToExcel = () => {
  const excelData = data.map((p) => {
    const productList = p.project_items
      ?.map((item: any) => item.products?.name)
      .filter(Boolean)
      .join(", ");

    const revenue = p.project_items.reduce(
      (s: any, i: any) => s + Number(i.negotiated_price || 0),
      0
    );

    return {
      "TANGGAL": new Date(p.created_at).toLocaleDateString("id-ID"),
      "REF ID": `REF-${p.id.slice(0, 5)}`.toUpperCase(),
      "NAMA PELANGGAN": p.leads?.nama || "-",
      "EMAIL": p.leads?.email || "-",
      "KONTAK": p.leads?.kontak || "-",
      "ALAMAT": p.leads?.alamat || "-",
      "DAFTAR PRODUK": productList || "-", 
      "TOTAL REVENUE": revenue,
      "STATUS": p.status_approval?.toUpperCase() || "WAITING",
    };
  });

  const ws = XLSX.utils.json_to_sheet(excelData);

  const wscols = [
    { wch: 15 }, // Tanggal
    { wch: 12 }, // Ref ID
    { wch: 25 }, // Nama
    { wch: 25 }, // Email
    { wch: 20 }, // Kontak
    { wch: 35 }, // Alamat
    { wch: 40 }, // Produk (dibuat lebar karena list barang bisa panjang)
    { wch: 20 }, // Revenue
    { wch: 15 }, // Status
  ];
  ws["!cols"] = wscols;

  const range = XLSX.utils.decode_range(ws["!ref"] || "A1:A1");
  for (let R = range.s.r; R <= range.e.r; ++R) {
    const contactCell = XLSX.utils.encode_cell({ c: 4, r: R });
    if (ws[contactCell]) ws[contactCell].t = "s";

    if (R > 0) {
      const revCell = XLSX.utils.encode_cell({ c: 7, r: R });
      if (ws[revCell]) ws[revCell].z = '#,##0'; 
    }
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Laporan Penjualan");

  const fileName = `Laporan_ISP_Eksklusif_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, fileName);
};

return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen space-y-8">
      {/* Header & Filter Bar (Sama seperti sebelumnya) */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Reporting & Export</h1>
          <p className="text-slate-500 text-sm">Generate granular ISP performance and sales reports.</p>
        </div>
        <button onClick={exportToExcel} className="flex items-center gap-2 cursor-pointer bg-green-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-green-900 transition-all shadow-md">
          <Download size={18} /> Export to Excel
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2"><Calendar size={12} className="text-blue-500"/> Date Range</label>
          <div className="flex gap-2">
            <input type="date" onChange={e => setStartDate(e.target.value)} className="cursor-pointer text-gray-500 w-full bg-blue-50 border border-slate-200 rounded-lg p-2 text-xs font-bold focus:ring-2 focus:ring-blue-500/20" />
            <input type="date" onChange={e => setEndDate(e.target.value)} className="cursor-pointer text-gray-500 w-full bg-blue-50 border border-slate-200 rounded-lg p-2 text-xs font-bold focus:ring-2 focus:ring-blue-500/20" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2"><Filter size={12} className="text-green-500"/> Status Filter</label>
          <select onChange={e => setStatusFilter(e.target.value)} className="cursor-pointer text-gray-500 w-full bg-blue-50 border border-slate-200 rounded-lg p-2 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 appearance-none outline-none">
            <option>All Statuses</option>
            <option>Approved</option>
            <option>Waiting Approval</option>
            <option>Rejected</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2"><Users size={12} className="text-purple-500"/> Sales Representative</label>
          <select onChange={e => setSalesFilter(e.target.value)} className="cursor-pointer text-gray-500 w-full bg-blue-50 border border-slate-200 rounded-lg p-2 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 appearance-none outline-none">
            <option>All Representatives</option>
            {salesList.map(salesId => <option key={salesId} value={salesId}>{salesId}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <button onClick={fetchReportData} className="cursor-pointer w-full bg-blue-800 text-white h-[38px] rounded-lg font-bold text-xs hover:bg-blue-900 transition-all">Apply Filters</button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MiniStatCard label="Projects Processed" value={loading ? "..." : data.length.toLocaleString()} subValue="Vol." icon={<Target size={22} />} color="gray" />
        <MiniStatCard label="Approved Deals" value={loading ? "..." : approvedCount.toString()} subValue={`${data.length > 0 ? ((approvedCount/data.length)*100).toFixed(0) : 0}% Rate`} icon={<Users size={22} />} color="blue" />
        <MiniStatCard label="Accumulated Revenue" value={loading ? "..." : `Rp ${totalRevenue.toLocaleString('id-ID')}`} icon={<Banknote size={22} />} color="emerald" subValue="+2.1%" trend="up" />
        <MiniStatCard label="Net Profit Margin" value={loading ? "..." : `Rp ${profitMargin.toLocaleString('id-ID')}`} icon={<Percent size={22} />} color="rose" />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h2 className="font-bold text-slate-800">Transaction Ledger</h2>
          <span className="text-[10px] font-black text-slate-400 uppercase">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, data.length)} of {data.length} Results
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4 text-left">Date & Ref ID</th>
                <th className="px-6 py-4 text-left">Customer Name</th>
                <th className="px-6 py-4 text-left">Product(s) Applied</th>
                <th className="px-6 py-4 text-right">HPP (Base Cost)</th>
                <th className="px-6 py-4 text-right">Agreed Selling Price</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={6} className="py-20 text-center text-slate-300 font-black animate-pulse uppercase tracking-tighter">Synchronizing Filtered Data...</td></tr>
              ) : currentItems.length === 0 ? (
                <tr><td colSpan={6} className="py-20 text-center text-slate-400 font-bold">No records found matching these filters.</td></tr>
              ) : currentItems.map((proj) => {
                const rev = proj.project_items.reduce((s:any, i:any) => s + Number(i.negotiated_price), 0);
                const hpp = proj.project_items.reduce((s:any, i:any) => s + Number(i.products?.hpp || 0), 0);
                const isUnderMargin = rev < (hpp * 1.1);

                return (
                  <tr key={proj.id} className={`hover:bg-slate-50 transition-colors ${isUnderMargin ? 'bg-amber-50/30' : ''}`}>
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-slate-700">{new Date(proj.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      <p className="text-[9px] text-slate-400 font-mono uppercase">REF-{proj.id.slice(0,5)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-black text-slate-800">{proj.leads?.nama}</p>
                      <p className="text-[9px] text-slate-400 uppercase font-bold">ISP Enterprise</p>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex flex-wrap gap-1">
                        {proj.project_items.map((it:any, i:number) => (
                          <span key={i} className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{it.products?.name}</span>
                        ))}
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right text-xs font-bold text-slate-500">Rp {hpp.toLocaleString()}</td>
                    <td className={`px-6 py-4 text-right text-xs font-black ${isUnderMargin ? 'text-rose-600' : 'text-slate-800'}`}>
                      Rp {rev.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={proj.status_approval} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER - POSITION RIGHT */}
        {!loading && data.length > itemsPerPage && (
          <div className="p-6 bg-slate-50/30 border-t border-slate-50 flex justify-end items-center gap-4">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 text-slate-400 hover:text-blue-600 disabled:opacity-20 transition-all bg-white rounded-xl border border-slate-200 shadow-sm disabled:shadow-none"
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
              className="p-2 text-slate-400 hover:text-blue-600 disabled:opacity-20 transition-all bg-white rounded-xl border border-slate-200 shadow-sm disabled:shadow-none"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}