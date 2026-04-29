import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// TODO: Reemplaza estos valores con tus credenciales de Supabase
const supabaseUrl = 'https://TU_PROYECTO.supabase.co';
const supabaseKey = 'TU_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);
