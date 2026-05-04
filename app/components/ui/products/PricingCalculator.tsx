"use client";
import { useState } from "react";
import { Calculator, Info } from "lucide-react";

export default function PricingCalculator() {
  const [hpp, setHpp] = useState(1000000);
  const [margin, setMargin] = useState(25);

  const sellingPrice = hpp + (hpp * margin / 100);
  const profit = sellingPrice - hpp;
  const tax = sellingPrice * 0.11; // PPN 11%

  return (
    <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl text-white sticky top-8">
      <div className="p-6 bg-slate-800/50 border-b border-slate-700 flex items-center gap-3">
        <div className="p-2 bg-blue-500 rounded-lg"><Calculator size={20}/></div>
        <div>
          <h3 className="font-bold text-sm">Pricing Calculator</h3>
          <p className="text-[10px] text-slate-400">Instant Quote Tool</p>
        </div>
      </div>

      <div className="p-6 space-y-6 bg-white text-slate-800">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Base Cost (HPP)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">Rp</span>
            <input 
              type="number" value={hpp} onChange={(e) => setHpp(Number(e.target.value))}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Margin Percentage</label>
            <span className="text-sm font-bold text-blue-600">{margin}%</span>
          </div>
          <input 
            type="range" min="5" max="100" value={margin} onChange={(e) => setMargin(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-bold">
            <span>5% (MIN)</span>
            <span>100% (MAX)</span>
          </div>
        </div>

        <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 text-center space-y-1">
          <p className="text-[10px] font-bold text-blue-500 uppercase">Recommended Selling Price</p>
          <p className="text-3xl font-black text-blue-700 tracking-tighter">
            Rp {sellingPrice.toLocaleString('id-ID')}
          </p>
          <div className="flex justify-center gap-4 pt-4 border-t border-blue-100 mt-4">
            <div className="text-left">
              <p className="text-[9px] font-bold text-slate-400 uppercase">Profit</p>
              <p className="text-xs font-bold text-green-600">Rp {profit.toLocaleString('id-ID')}</p>
            </div>
            <div className="text-left">
              <p className="text-[9px] font-bold text-slate-400 uppercase">Tax (11%)</p>
              <p className="text-xs font-bold text-slate-500">Rp {tax.toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>

        <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
          Apply to Package
        </button>
      </div>
      
      <div className="p-4 bg-slate-50 flex gap-3 items-start">
        <div className="p-1.5 bg-green-100 text-green-600 rounded-lg"><Info size={14}/></div>
        <p className="text-[10px] text-slate-500 leading-relaxed italic">
          "Business packages typically maintain a 40%+ margin for sustainable SLA support."
        </p>
      </div>
    </div>
  );
}