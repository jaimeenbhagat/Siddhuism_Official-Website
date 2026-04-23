-- Create the app_config table to store dynamic configuration variables
CREATE TABLE IF NOT EXISTS public.app_config (
    key text PRIMARY KEY,
    value text NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

-- Allow read access for everyone (or you can restrict to authenticated users only if you prefer, but usually for backend reads using service role key, RLS is bypassed anyway)
CREATE POLICY "Allow read access for all" ON public.app_config FOR SELECT USING (true);

-- Allow backend service roles to insert/update (by bypassing RLS via service key, no specific policy needed here)
