-- FASE 2 MIGRATION
ALTER TABLE contributions ADD COLUMN IF NOT EXISTS transcripcion_fonetica TEXT;
ALTER TABLE contributions ADD COLUMN IF NOT EXISTS metadatos_linguisticos JSONB;

CREATE OR REPLACE FUNCTION public.is_maestro_or_admin()
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
    user_status TEXT;
BEGIN
    SELECT rol, estado INTO user_role, user_status FROM public.profiles WHERE id = auth.uid();
    RETURN COALESCE(user_role IN ('maestro', 'superadmin') AND user_status = 'aprobado', FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE POLICY "Maestros and admins can update contributions" ON contributions
    FOR UPDATE USING (public.is_maestro_or_admin()) WITH CHECK (public.is_maestro_or_admin());

CREATE POLICY "Maestros and admins can read all contributions" ON contributions
    FOR SELECT USING (public.is_maestro_or_admin());
