const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const adminSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  const { data: order } = await adminSupabase.from('orders').select('id').limit(1).single();
  if (!order) return console.log("No orders");
  
  for (const st of ['pending', 'paid', 'sent', 'received', 'canceled', 'enviado', 'entregue']) {
    const { error } = await adminSupabase.from('orders').update({ status: st }).eq('id', order.id);
    console.log(`Setting ${st}:`, error ? error.message : 'SUCCESS');
  }
}
test();
