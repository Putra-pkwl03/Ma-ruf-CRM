"use client";

import React, { useState } from "react"; // Tambahkan import React
import { ChevronLeft, ChevronRight, Package, MapPin, Mail, Info, Tag, Phone  } from "lucide-react";

export default function CustomerTable({ customers, loading }: { customers: any[], loading: boolean }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-slate-400 font-bold uppercase tracking-widest text-xs">Synchronizing Nodes...</div>;

  return (
    <div className="w-full">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-50 text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">
            <th className="px-8 py-6">Customer Name</th>
            <th className="px-4 py-6">Current Package</th>
            <th className="px-4 py-6 text-center">Items</th>
            <th className="px-4 py-6">Status</th>
            <th className="px-4 py-6 text-right">Revenue</th>
            <th className="px-4 py-6">Installed At</th>
            <th className="px-8 py-6 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => {
            const activeProject = c.projects?.[0];
            const projectItems = activeProject?.project_items || [];
            const firstItem = projectItems[0];
            const isExpanded = expandedId === c.id;

            const totalRevenue = projectItems.reduce(
              (acc: number, item: any) => acc + (Number(item.negotiated_price) || 0), 0
            ) || 0;

            return (
              <React.Fragment key={c.id}> 
                <tr className={`border-b border-slate-50 hover:bg-[#F8FAFC]/50 transition-all group ${isExpanded ? 'bg-blue-50/40' : ''}`}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 uppercase">
                        {c.nama.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{c.nama}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ID: {c.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight border border-blue-100">
                      {firstItem?.products?.name || "No Product"}
                    </span>
                  </td>
                  <td className="px-4 py-5 text-center">
                    <div className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-slate-100 text-[10px] font-black text-slate-600 border border-slate-200">
                      {projectItems.length} Pcs
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[11px] font-black text-green-600 uppercase">{c.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-5 text-right font-bold text-slate-700 text-sm font-mono">
                    Rp {totalRevenue.toLocaleString('id-ID')}
                  </td>
                  <td className="px-4 py-5 text-xs font-bold text-slate-500">
                    {new Date(c.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => toggleRow(c.id)}
                      className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase transition-all ${isExpanded ? 'bg-slate-800 text-white' : 'text-[#0052CC] border border-blue-100 bg-blue-50/50 hover:bg-blue-600 hover:text-white'}`}
                    >
                      {isExpanded ? "Close" : "Details"}
                    </button>
                  </td>
                </tr>

                {isExpanded && (
                  <tr className="bg-slate-50/30">
                    <td colSpan={7} className="px-8 py-8 border-b border-slate-200">
                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-top-1 duration-300">
                        <div className="space-y-3">
                        {/* Label Section */}
                        <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                            <Info size={14} className="text-blue-500" /> Customer Information
                        </h4>

                        {/* Main Single Card */}
                        <div className="bg-blue-50/40 rounded-md overflow-hidden hover:bg-slate-50">
                            {/* Contact Row */}
                            <div className="p-4 border-b border-slate-100 space-y-4">
                            <div className="grid grid-cols-2 gap-6">
                                {/* Phone Section */}
                                <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 rounded-xl shrink-0">
                                    <Phone size={16} className="text-green-600" />
                                </div>
                                <div>
                                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">No Telp</p>
                                    <p className="text-[13px] font-bold text-slate-700 whitespace-nowrap">+62{c.kontak || "N/A"}</p>
                                </div>
                                </div>

                                {/* Email Section */}
                                <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-xl shrink-0">
                                    <Mail size={16} className="text-blue-600" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Email</p>
                                    <p className="text-[13px] font-bold text-slate-700 truncate">{c.email || "N/A"}</p>
                                </div>
                                </div>
                            </div>
                            </div>

                            {/* Address Row */}
                            <div className="flex items-center gap-4 p-4 bg-[#F8FAFC]/30">
                            <div className="p-2.5 bg-orange-50 rounded-xl shrink-0">
                                <MapPin size={18} className="text-orange-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Installation Address</p>
                                <p className="text-[13px] font-bold text-slate-700 leading-relaxed">{c.alamat || "No address provided"}</p>
                            </div>
                            </div>
                        </div>
                        </div>

                        <div className="space-y-6">
                          <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            <Tag size={14} className="text-emerald-500" /> Product & Pricing Analysis
                          </h4>
                          <div className="space-y-3">
                            {projectItems.map((item: any, idx: number) => {
                              const priceSell = Number(item.products?.price_sell) || 0;
                              const negoPrice = Number(item.negotiated_price) || 0;
                              const diff = priceSell - negoPrice;

                              return (
                                <div key={idx} className="bg-blue-50/40 rounded-md overflow-hidden hover:bg-slate-50">
                                  <div className="bg-slate-50/50 px-5 py-3 border-b border-slate-50 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                      <Package size={14} className="text-slate-400" />
                                      <span className="text-xs font-black text-slate-700 uppercase">{item.products?.name}</span>
                                    </div>
                                    {diff > 0 && (
                                      <span className="text-[9px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase">
                                        Negotiated
                                      </span>
                                    )}
                                  </div>
                                  
                                  <div className="p-5 grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-[9px] text-slate-400 font-black uppercase mb-1">Market Price (Incl. Margin)</p>
                                      <p className={`text-sm font-bold ${diff > 0 ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                        Rp {priceSell.toLocaleString('id-ID')}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-[9px] text-blue-600 font-black uppercase mb-1">Deal Price</p>
                                      <p className="text-lg font-mono font-black text-slate-900">
                                        Rp {negoPrice.toLocaleString('id-ID')}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  {diff > 0 && (
                                    <div className="px-5 py-2 bg-emerald-50/30 border-t border-emerald-50 flex justify-between items-center">
                                      <span className="text-[9px] font-bold text-emerald-600 uppercase">Customer Discount</span>
                                      <span className="text-[11px] font-black text-emerald-600">- Rp {diff.toLocaleString('id-ID')}</span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      {/* Pagination Placeholder */}
      <div className="p-8 flex justify-between items-center border-t border-slate-50 bg-slate-50/20">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Showing <span className="text-slate-900">{customers.length}</span> Results
        </p>
        <div className="flex gap-2">
          
                  </div>
      </div>
    </div>
  );
}