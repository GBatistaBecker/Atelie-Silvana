const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseAnon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function test() {
  console.log('Testing Anon Client...');
  const { data: anonData, error: anonError } = await supabaseAnon.from('products').select('*');
  console.log('Anon Data:', anonData?.length);
  console.log('Anon Error:', anonError);

  console.log('\nTesting Admin Client...');
  const { data: adminData, error: adminError } = await supabaseAdmin.from('products').select('*');
  console.log('Admin Data:', adminData?.length);
  console.log('Admin Error:', adminError);
}

test();
