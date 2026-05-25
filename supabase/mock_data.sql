-- Mock Data for NgobeApp
INSERT INTO public.profiles (id, rol, estado, nombre_completo, comunidad)
VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'colaborador', 'aprobado', 'Juan Atencio', 'Soloy (Nedrini)'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'maestro', 'aprobado', 'Maestra María Bejerano', 'Kankintú (Ñö Kribo)')
ON CONFLICT (id) DO NOTHING;
