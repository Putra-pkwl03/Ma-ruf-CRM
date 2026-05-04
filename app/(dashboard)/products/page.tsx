"use client";
import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import ProductForm from "../../components/ui/products/ProductForm";
import ProductCard from "../../components/ui/products/ProductCard";
import PricingCalculator from "../../components/ui/products/PricingCalculator";
import ProductStats from "../../components/ui/products/ProductStats"; 
import EditProductForm from "../../components/ui/products/EditProductForm";
import Swal from "sweetalert2";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filter, setFilter] = useState("All Packages");
  
  // State Modal Terpisah
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  // State untuk Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const supabase = createClient();

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (!error) setProducts(data || []);
  };

useEffect(() => { 
  fetchInitialData(); 
}, []);

  // Filter & Pagination Logic
  const filteredProducts = products.filter((p) => 
    filter === "All Packages" || p.name.toLowerCase().includes(filter.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => { setCurrentPage(1); }, [filter]);

  // Fungsi Hapus Produk
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Apakah anda yakin?',
      text: "Data produk akan dihapus permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (!error) {
        Swal.fire('Terhapus!', 'Produk telah dihapus.', 'success');
        fetchProducts();
      }
    }
  };

  const fetchInitialData = async () => {
    // 1. Ambil User & Role
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      setUserRole(profile?.role || 'sales');
    }

    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (!error) setProducts(data || []);
  };

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen flex flex-col">
      <div className="flex flex-col lg:flex-row gap-8 flex-1">
        
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Service Catalog</h1>
              <p className="text-slate-500">Manage internet packages, pricing, and profit margins.</p>
            </div>
            {userRole?.toLowerCase() === 'sales' && (
              <div className="flex-shrink-0 -mt-12">
                <ProductStats products={products} userRole={userRole} />
              </div>
            )}
            {userRole === 'manager' && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="cursor-pointer flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-100"
              >
                <Plus size={20} /> Create Product
              </button>
            )}
          </div>

          {/* Tabs Filter */}
          <div className="flex gap-2 p-1 bg-slate-200/50 rounded-xl w-fit">
            {["All Packages", "Home", "Business", "Dedicated"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                  filter === tab ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

        {/* Grid Products */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300 ${
          userRole?.toLowerCase() === 'manager' 
            ? "lg:grid-cols-2" 
            : "lg:grid-cols-3" 
        }`}>
          {currentItems.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              userRole={userRole}
              onEdit={(p: any) => { 
                setSelectedProduct(p); 
                setIsEditModalOpen(true); 
              }}
              onDelete={handleDelete} 
            />
          ))}
        </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft size={20} className="text-slate-600" />
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                      currentPage === i + 1 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                      : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  <ChevronRight size={20} className="text-slate-600" />
                </button>
              </div>
              <p className="text-sm text-slate-500 font-medium">
                Showing <span className="text-slate-800">{indexOfFirstItem + 1}</span> to <span className="text-slate-800">{Math.min(indexOfLastItem, filteredProducts.length)}</span> of <span className="text-slate-800">{filteredProducts.length}</span> products
              </p>
            </div>
          )}
        </div>

        {/* Sidebar Calculator */}
        {userRole?.toLowerCase() === 'manager' && (
        <div className="w-full lg:w-80 xl:w-96">
          <PricingCalculator />
        </div>
      )}
      </div>

      {/* Jika Manager, tampilkan stats di bawah grid (Gaya Dashboard) */}
          {userRole?.toLowerCase() === 'manager' && (
            <ProductStats products={products} userRole={userRole} />
          )}

      {/* MODAL TAMBAH */}
      <ProductForm 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={fetchProducts}
      />

      {/* MODAL EDIT */}
      <EditProductForm 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }} 
        onSuccess={fetchProducts} 
        productData={selectedProduct} 
      />
    </div>
  );
}