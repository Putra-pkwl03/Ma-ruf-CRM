export interface Product {
  id: string;
  name: string;
  hpp: number;
  margin_percent: number;
  price_sell: number;
}

export interface Lead {
  id: string;
  sales_id: string;
  name: string;
  contact: string;
  address: string;
  requirement: string;
  status: 'lead' | 'customer';
  created_at: string;
}

export interface Project {
  id: string;
  lead_id: string;
  sales_id: string;
  total_amount: number;
  status_approval: 'waiting approval' | 'approved' | 'rejected';
}