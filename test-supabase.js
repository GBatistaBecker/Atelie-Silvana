const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      name,
      email,
      addresses!inner(street)
    `)
    .limit(1);

  console.log('Error:', JSON.stringify(error, null, 2));
  console.log('Data:', data);
}

test();
