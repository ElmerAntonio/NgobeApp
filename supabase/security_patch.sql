-- Warning 1: Drop over-permissive policy on storage.objects
DROP POLICY IF EXISTS "Allow public access to audios" ON storage.objects;

-- Warnings 2 and 3: Revoke execute permissions on rls_auto_enable function from public roles
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM authenticated;
