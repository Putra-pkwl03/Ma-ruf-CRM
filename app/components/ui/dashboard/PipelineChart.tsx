"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function PipelineChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={-25}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 900 }}
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 900 }}
        />
        <Tooltip 
          cursor={{ fill: '#F8FAFC' }}
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
        />
        {/* Bar Background (Created) */}
        <Bar 
          dataKey="created" 
          fill="#DBEAFE" 
          radius={[10, 10, 10, 10]} 
          barSize={32} 
        />
        {/* Bar Foreground (Approved) */}
        <Bar 
          dataKey="approved" 
          fill="#2563EB" 
          radius={[10, 10, 10, 10]} 
          barSize={32} 
        />
      </BarChart>
    </ResponsiveContainer>
  );
}