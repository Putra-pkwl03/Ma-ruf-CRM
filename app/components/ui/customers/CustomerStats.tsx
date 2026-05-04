"use client";

import { Users, UserPlus, Activity, DollarSign } from "lucide-react"; // Tambah DollarSign
import StatCard from "./StatCard";

export default function CustomerStats({ customers }: { customers: any[] }) {
  const totalActive = customers.length;
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newThisMonth = customers.filter(c => new Date(c.created_at) > thirtyDaysAgo).length;

  // KALKULASI TOTAL REVENUE DINAMIS
  const totalRevenue = customers.reduce((acc, customer) => {
    // Ambil semua project, lalu jumlahkan semua negotiated_price di project_items
    const customerTotal = customer.projects?.reduce((pAcc: number, project: any) => {
      const itemsTotal = project.project_items?.reduce((iAcc: number, item: any) => {
        return iAcc + (item.negotiated_price || 0);
      }, 0) || 0;
      return pAcc + itemsTotal;
    }, 0) || 0;
    
    return acc + customerTotal;
  }, 0);

  return (
    // Ubah md:grid-cols-3 menjadi md:grid-cols-4
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <StatCard 
        icon={<Users className="text-blue-600" size={20} />}
        label="Total Active Customers"
        value={totalActive.toLocaleString()}
        trend="+ 12%"
        subLabel="Versus last month"
      />
      
      <StatCard 
        icon={<DollarSign className="text-amber-500" size={20} />}
        label="Monthly Revenue"
        value={`Rp ${(totalRevenue / 1000000).toFixed(1)}M`} 
        subLabel={`Total: Rp ${totalRevenue.toLocaleString('id-ID')}`}
      />

      <StatCard 
        icon={<UserPlus className="text-green-600" size={20} />}
        label="New This Month"
        value={newThisMonth}
        subLabel="Automated from created_at"
      />
      <StatCard 
        icon={<Activity className="text-red-500" size={20} />}
        label="Churn Rate"
        value="0.8%"
        trend="- 0.2%"
        trendColor="text-green-500"
        subLabel="Industry benchmark: 1.2%"
      />
    </div>
  );
}