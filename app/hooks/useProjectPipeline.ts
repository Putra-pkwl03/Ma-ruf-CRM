import { createClient } from "../lib/supabase";

export const useProjectPipeline = () => {
  const supabase = createClient();

  const createProjectDeal = async (leadId: string, items: any[]) => {
    const totalAmount = items.reduce((sum, item) => sum + Number(item.negotiated_price), 0);
    
    const needsApproval = items.some(item => {
        const nego = Number(item.negotiated_price);
        const std = Number(item.standard_price);
        return std > 0 && nego < std;
    });
    
    const status = needsApproval ? 'waiting approval' : 'approved';

    const { data: project, error: pError } = await supabase
      .from('projects')
      .insert([{ 
        lead_id: leadId, 
        total_amount: totalAmount,
        status_approval: status,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (pError) throw pError;

    if (status === 'approved') {
      const { error: lError } = await supabase
        .from('leads')
        .update({ status: 'Active' }) 
        .eq('id', leadId);
      
      if (lError) console.error("Gagal mengupdate status lead:", lError.message);
    }

    // 3. Insert ke tabel project_items
    const itemPayload = items.map(item => ({
      project_id: project.id,
      product_id: item.product_id,
      negotiated_price: Number(item.negotiated_price)
    }));

    const { error: iError } = await supabase.from('project_items').insert(itemPayload);
    if (iError) throw iError;

    return { project, status };
  };

  return { createProjectDeal };
};