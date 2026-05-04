"use client";

import { useState, useEffect, useMemo } from "react";
import { X, UserCheck, ShoppingCart, Plus, AlertCircle, Loader2, ChevronDown } from "lucide-react";
import { createClient } from "../../../lib/supabase";
import { useProjectPipeline } from "../../../hooks/useProjectPipeline"; 
import Swal from "sweetalert2";

export default function ProjectModal({ isOpen, onClose, onSuccess }: any) {
  const supabase = createClient();
  const { createProjectDeal } = useProjectPipeline();
  
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const [selectedLead, setSelectedLead] = useState("");
  const [items, setItems] = useState([{ product_id: "", standard_price: 0, negotiated_price: 0 }]);

  useEffect(() => {
    if (isOpen) {
      fetchData();
      setSelectedLead("");
      setItems([{ product_id: "", standard_price: 0, negotiated_price: 0 }]);
    }
  }, [isOpen]);

  const fetchData = async () => {
    const { data: leadsData } = await supabase.from("leads").select("id, nama");
    const { data: productsData } = await supabase.from("products").select("*");
    setLeads(leadsData || []);
    setProducts(productsData || []);
  };

  const addItem = () => {
    setItems([...items, { product_id: "", standard_price: 0, negotiated_price: 0 }]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems: any = [...items];
    if (field === "product_id") {
      const prod = products.find((p) => p.id === value);
      const basePrice = Number(prod?.price_sell || prod?.harga_jual) || 0; 
      newItems[index].standard_price = basePrice;
      newItems[index].negotiated_price = basePrice;
    }
    newItems[index][field] = field === "negotiated_price" ? Number(value) : value;
    setItems(newItems);
  };

  const displayTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.negotiated_price), 0);
  }, [items]);

  const showApprovalAlert = useMemo(() => {
    return items.some(item => 
      item.product_id && Number(item.negotiated_price) < Number(item.standard_price)
    );
  }, [items]);

  const handleSubmit = async () => {
    if (!selectedLead || items.some(i => !i.product_id)) {
      Swal.fire("Error", "Please complete the form", "error");
      return;
    }
    setLoading(true);
    try {
      const { status } = await createProjectDeal(selectedLead, items);
      await Swal.fire({
        title: "Success",
        text: `Deal initiated as: ${status.toUpperCase()}`,
        icon: "success",
        timer: 2000
      });
      onSuccess(); 
      onClose();   
    } catch (err: any) {
      console.error(err);
      Swal.fire("Error", err.message || "Failed to create deal", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-[650px] overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header Section */}
        <div className="px-12 pt-12 pb-6 flex justify-between items-start">
          <div>
            <h2 className="text-[32px] font-bold text-[#1E293B] leading-tight">Initialize New Deal</h2>
            <p className="text-[#64748B] text-base mt-2">Configure lead mapping and product allocation for the sales pipeline.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors group">
            <X size={24} className="text-[#94A3B8] group-hover:text-[#1E293B]" />
          </button>
        </div>

        <div className="px-12 py-6 space-y-10">
          
          {/* STEP 1: STAKEHOLDER */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <UserCheck size={20} className="text-[#0052CC]" />
              <h3 className="text-xs font-black text-[#0052CC] tracking-[0.1em] uppercase">Step 1: Stakeholder Identification</h3>
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#64748B] ml-1">Select Lead/Customer</label>
              <div className="relative group">
                <select 
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-6 py-4 text-base appearance-none focus:ring-2 focus:ring-[#0052CC]/20 focus:border-[#0052CC] outline-none text-[#334155] transition-all cursor-pointer"
                  value={selectedLead}
                  onChange={(e) => setSelectedLead(e.target.value)}
                >
                  <option value="">Choose a lead or existing account...</option>
                  {leads.map(l => <option key={l.id} value={l.id}>{l.nama}</option>)}
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none group-hover:text-[#64748B]" size={20} />
              </div>
            </div>
          </section>

          {/* STEP 2: PRODUCT CONFIGURATION */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <ShoppingCart size={20} className="text-[#0052CC]" />
                <h3 className="text-xs font-black text-[#0052CC] tracking-[0.1em] uppercase">Step 2: Product Configuration</h3>
              </div>
              <button onClick={addItem} className="flex items-center gap-2 text-[#0052CC] font-bold text-sm hover:opacity-70 transition-opacity">
                <Plus size={18} /> Add Product
              </button>
            </div>

            {/* Table Header Labels */}
            <div className="grid grid-cols-12 gap-4 px-4 mb-3 text-[11px] font-black text-[#94A3B8] uppercase tracking-wider">
                <div className="col-span-6">Select Product</div>
                <div className="col-span-3 text-center">Standard Price</div>
                <div className="col-span-3 text-center">Negotiated Price</div>
            </div>

            <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-4 items-center bg-[#F8FAFC]/50 p-2 rounded-2xl border border-transparent hover:border-[#E2E8F0] transition-all">
                  <div className="col-span-6 relative group">
                    <select 
                      className="w-full text-gray-500 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3.5 text-sm appearance-none outline-none focus:border-[#0052CC] transition-all cursor-pointer"
                      value={item.product_id}
                      onChange={(e) => updateItem(idx, "product_id", e.target.value)}
                    >
                      <option value="">Select Product...</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <ChevronDown className="text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" size={16} />
                  </div>
                  
                  <div className="col-span-3">
                    <div className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-4 py-3.5 text-sm text-[#64748B] font-medium text-center">
                       Rp {item.standard_price.toLocaleString()}
                    </div>
                  </div>

                  <div className="col-span-3">
                    <input 
                      type="number" 
                      className={`w-full bg-white border ${Number(item.negotiated_price) < item.standard_price ? 'border-amber-300 ring-2 ring-amber-50' : 'border-[#CBD5E1]'} rounded-xl px-4 py-3.5 text-sm text-[#0052CC] font-bold text-center focus:ring-2 focus:ring-[#0052CC]/20 outline-none transition-all`} 
                      value={item.negotiated_price}
                      onChange={(e) => updateItem(idx, "negotiated_price", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* RECTIVE ALERT BOX */}
          {showApprovalAlert && (
            <div className="bg-[#FFF1F2]/50 border border-[#FFE4E6] rounded-[20px] p-6 flex gap-4 animate-in slide-in-from-top-4 duration-500">
              <AlertCircle className="text-[#E11D48] shrink-0" size={24} />
              <div>
                <p className="text-[#E11D48] text-sm font-bold">Approval Protocol Required</p>
                <p className="text-[#FB7185] text-xs mt-1 leading-relaxed">
                  This deal requires Leader Approval due to price negotiation. The negotiated price is below the standard corporate threshold.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER SECTION */}
        <div className="px-12 py-10 bg-[#F8FAFC] border-t border-[#F1F5F9] flex items-center justify-between">
          <div className="bg-[#F1F5F9]/50 px-4 py-4 rounded-2xl border border-[#E2E8F0]">
            <p className="text-[11px] font-black text-[#94A3B8] uppercase tracking-widest mb-1">Estimated Deal Magnitude</p>
            <div className="flex items-center gap-3">
              <span className="text-[28px] font-black text-[#1E293B]">
                ${displayTotal.toLocaleString()}
              </span>
              <span className="bg-[#DCFCE7] text-[#166534] text-[8px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                Verified Total
              </span>
            </div>
          </div>
          
          <div className="flex gap-6 items-center">
            <button onClick={onClose} className="text-[#64748B] font-bold text-base hover:text-[#1E293B] transition-colors">Cancel</button>
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#0052CC] hover:bg-[#0747A6]  disabled:bg-slate-300 text-white px-8 py-2 rounded-2xl font-black text-base shadow-xl shadow-blue-900/10 hover:shadow-blue-900/20 active:scale-95 transition-all flex items-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin text-[18px]" size={20} /> : "Initialize Deal"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}