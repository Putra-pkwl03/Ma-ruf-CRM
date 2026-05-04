import { 
  Package, Wifi, Globe, Trash2, Edit3, TrendingUp, 
  Zap, Database, Shield, Radio, Activity, Cpu 
} from "lucide-react";

export default function ProductCard({ product, onEdit, onDelete, userRole }: any) {
  const icons = [Wifi, Globe, Zap, Database, Shield, Radio, Activity, Cpu];
  const isManager = userRole === 'manager';

  const getIcon = () => {
    const seed = product.id ? product.id.length : product.name.length;
    const charCodeSum = (product.name || "").split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), seed);
    const IconComponent = icons[charCodeSum % icons.length];
    return <IconComponent size={24} />;
  };

  const formatIDR = (val: number) => 
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${
          product.status === 'ARCHIVED' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
        }`}>
          {getIcon()}
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className={`text-[10px] font-bold px-2 py-1 rounded-md tracking-wider ${
            product.status === 'ARCHIVED' ? 'bg-slate-100 text-slate-500' : 'bg-green-100 text-green-700'
          }`}>
            {product.status || 'ACTIVE'}
          </span>
          
          {/* Tombol Edit & Delete hanya muncul untuk Manager */}
          {isManager && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onEdit(product)} className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors">
                <Edit3 size={16}/>
              </button>
              <button onClick={() => onDelete(product.id)} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors">
                <Trash2 size={16}/>
              </button>
            </div>
          )}
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-1">{product.name}</h3>
      <p className="text-xs text-slate-400 mb-6 flex items-center gap-1">
        <Package size={12} /> {product.description || 'Standard Fiber Package'}
      </p>

      <div className="space-y-3 pt-4 border-t border-slate-50">
        <div className="flex justify-between items-end">
          {/* HPP Hanya muncul untuk Manager */}
          <div>
            {isManager && (
              <>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">HPP (Base Cost)</p>
                <p className="text-sm font-medium text-slate-600">{formatIDR(product.hpp)}</p>
              </>
            )}
          </div>

          <div className="text-right">
            {/* Margin Hanya muncul untuk Manager */}
            {isManager && (
              <p className="text-[10px] font-bold text-green-600 flex items-center justify-end gap-1">
                <TrendingUp size={10}/> +{product.margin_percent}% Margin
              </p>
            )}
            
            {/* Harga Jual muncul untuk semua */}
            <p className="text-xl font-black text-blue-700 tracking-tight">
              <span className="text-sm mr-1">Rp</span>
              {((product.price_sell || 0) / 1000).toLocaleString('id-ID')}K
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}