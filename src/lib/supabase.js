import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    realtime: {
      // Automatically reconnect when network is restored
      reconnectOnNetworkChange: true,
      // Custom error handler for realtime errors
      onError: (err) => {
        console.error('[supabase] Realtime error:', err);
      },
    },
  }
);
