-- Warning 1: Drop over-permissive policy on storage.objects
DROP POLICY IF EXISTS "Allow public access to audios" ON storage.objects;

-- Harden contribution access
DROP POLICY IF EXISTS "Allow public read access" ON contributions;
DROP POLICY IF EXISTS "Allow authenticated insert" ON contributions;
DROP POLICY IF EXISTS "Users can read approved contributions" ON contributions;
DROP POLICY IF EXISTS "Users can read own contributions" ON contributions;
DROP POLICY IF EXISTS "Users can insert own contributions" ON contributions;

ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();
ALTER TABLE contributions ALTER COLUMN user_id SET DEFAULT auth.uid();

CREATE POLICY "Users can read approved contributions" ON contributions
    FOR SELECT
    USING (auth.role() = 'authenticated' AND status = 'approved');

CREATE POLICY "Users can read own contributions" ON contributions
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own contributions" ON contributions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Keep audio storage private to authenticated users
UPDATE storage.buckets SET public = false WHERE id = 'audios';
DROP POLICY IF EXISTS "Allow authenticated read from audios" ON storage.objects;
CREATE POLICY "Allow authenticated read from audios" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'audios' AND auth.role() = 'authenticated');

-- Warnings 2 and 3: Revoke execute permissions on rls_auto_enable function from public roles
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM authenticated;
