import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });

  const client = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', { global: { headers: { Authorization: authHeader } } });
  const { data: { user } } = await client.auth.getUser();
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
  const { data: caller } = await client.from('profiles').select('role').eq('id', user.id).single();
  if (caller?.role !== 'admin') return new Response(JSON.stringify({ error: 'Admin access required' }), { status: 403, headers: corsHeaders });

  const { email, password, displayName } = await request.json();
  if (!email || !password || password.length < 6) return new Response(JSON.stringify({ error: 'Email and a 6-character password are required' }), { status: 400, headers: corsHeaders });

  const admin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
  const { data, error } = await admin.auth.admin.createUser({
    email: String(email).trim().toLowerCase(), password, email_confirm: true,
    user_metadata: { username: String(email).split('@')[0], display_name: displayName || String(email).split('@')[0] }
  });
  if (error || !data.user) return new Response(JSON.stringify({ error: error?.message || 'Could not create user' }), { status: 400, headers: corsHeaders });
  const { error: profileError } = await admin.from('profiles').update({ role: 'admin' }).eq('id', data.user.id);
  if (profileError) return new Response(JSON.stringify({ error: profileError.message }), { status: 400, headers: corsHeaders });
  return new Response(JSON.stringify({ id: data.user.id }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
});
