-- Tabla de perfiles
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    rol TEXT NOT NULL DEFAULT 'colaborador' CHECK (rol IN ('superadmin', 'maestro', 'colaborador', 'aprendiz')),
    estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobado', 'bloqueado')),
    comunidad TEXT,
    nombre_completo TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Función auxiliar para verificar si el usuario actual es superadmin
-- Usa SECURITY DEFINER para evitar recursión infinita en las políticas RLS
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN AS $$
DECLARE
    is_admin BOOLEAN;
BEGIN
    SELECT (rol = 'superadmin') INTO is_admin FROM public.profiles WHERE id = auth.uid();
    RETURN COALESCE(is_admin, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Políticas de lectura
-- Los usuarios pueden leer su propio perfil. Los superadmin pueden leer todos.
CREATE POLICY "Usuarios pueden leer su propio perfil y superadmins todos" ON public.profiles
    FOR SELECT
    USING (auth.uid() = id OR public.is_superadmin());

-- Políticas de actualización
-- Los usuarios pueden actualizar su propio perfil. Los superadmin pueden actualizar todos.
CREATE POLICY "Usuarios pueden actualizar su perfil y superadmins todos" ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id OR public.is_superadmin());

-- Trigger para proteger los campos 'rol' y 'estado' de modificaciones por usuarios no superadmin
CREATE OR REPLACE FUNCTION public.protect_profile_fields()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT public.is_superadmin() THEN
        -- Revertir cualquier intento de cambiar 'rol' o 'estado'
        IF NEW.rol IS DISTINCT FROM OLD.rol THEN
            NEW.rol = OLD.rol;
        END IF;
        IF NEW.estado IS DISTINCT FROM OLD.estado THEN
            NEW.estado = OLD.estado;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER ensure_protected_profile_fields
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.protect_profile_fields();

-- Trigger para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, rol, estado, nombre_completo, comunidad)
    VALUES (NEW.id, 'colaborador', 'pendiente', NULL, NULL);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
