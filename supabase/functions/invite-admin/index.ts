import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const jsonHeaders = {
  'Content-Type': 'application/json',
};

Deno.serve(async (request) => {
  const origin = request.headers.get('origin') || '';
  const corsHeaders = {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, ...jsonHeaders },
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const configuredAppUrl = Deno.env.get('APP_URL');
    const appUrl = (configuredAppUrl || origin).replace(/\/$/, '');
    const authorization = request.headers.get('Authorization');

    if (!supabaseUrl || !serviceRoleKey || !appUrl || !authorization) {
      throw new Error('Missing server configuration');
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const token = authorization.replace(/^Bearer\s+/i, '');
    const { data: authData, error: authError } = await adminClient.auth.getUser(token);

    if (authError || !authData.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, ...jsonHeaders },
      });
    }

    const { data: callerProfile, error: profileError } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single();

    if (profileError || callerProfile?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, ...jsonHeaders },
      });
    }

    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 320) {
      return new Response(JSON.stringify({ error: 'Invalid email' }), {
        status: 400,
        headers: { ...corsHeaders, ...jsonHeaders },
      });
    }

    const { data: invitation, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(
      email,
      { redirectTo: `${appUrl}/reset-password` },
    );

    if (inviteError || !invitation.user) {
      return new Response(JSON.stringify({
        error: inviteError?.message || 'Could not invite admin',
      }), {
        status: 400,
        headers: { ...corsHeaders, ...jsonHeaders },
      });
    }

    const { error: roleError } = await adminClient
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', invitation.user.id)
      .select('id')
      .single();

    if (roleError) {
      await adminClient.auth.admin.deleteUser(invitation.user.id);
      throw roleError;
    }

    return new Response(JSON.stringify({ email }), {
      status: 200,
      headers: { ...corsHeaders, ...jsonHeaders },
    });
  } catch (error) {
    console.error('invite-admin failed', error);
    return new Response(JSON.stringify({ error: 'Admin invitation failed' }), {
      status: 500,
      headers: { ...corsHeaders, ...jsonHeaders },
    });
  }
});
