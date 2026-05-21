import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useState, useEffect } from 'react';
import { theme } from '../utils/theme';
import { supabase } from '../services/supabaseClient';
import { deleteUserAccount } from '../services/userService';

export default function ProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProfile = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) throw authError;

      setUserEmail(user.email || '');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'No se pudo cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAvatarLetter = () => {
    if (profile?.nombre_completo) {
      return profile.nombre_completo.charAt(0).toUpperCase();
    }
    if (userEmail) {
      return userEmail.charAt(0).toUpperCase();
    }
    return '?';
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    navigation.replace('Login');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '¿Estás seguro?',
      'Esta acción eliminará tu cuenta, todos tus audios, aportes y perfil de forma permanente.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Continuar',
          style: 'destructive',
          onPress: () => {
            // Segunda confirmación requerida por Ley 81 de Panamá
            Alert.prompt(
              'Confirmación Definitiva',
              'Por favor escribe "ELIMINAR" para confirmar la eliminación total de tus datos según el Art. 16 de la Ley 81 de Protección de Datos Personales.',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Confirmar',
                  style: 'destructive',
                  onPress: async (text) => {
                    if (text !== 'ELIMINAR') {
                      Alert.alert('Error', 'Debe escribir la palabra "ELIMINAR" exactamente.');
                      return;
                    }

                    setIsDeleting(true);
                    const result = await deleteUserAccount();
                    setIsDeleting(false);

                    if (result.success) {
                      Alert.alert(
                        'Datos Eliminados',
                        'Tu cuenta y todos tus datos han sido eliminados de nuestros sistemas, en cumplimiento con el Art. 16 de la Ley 81 de Protección de Datos Personales de Panamá.',
                        [
                          {
                            text: 'OK',
                            onPress: () => navigation.replace('Login'),
                          },
                        ]
                      );
                    } else {
                      Alert.alert('Error', result.error);
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  if (loading || isDeleting) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  const isSuperadmin = profile?.rol === 'superadmin';
  const roleName = profile?.rol
    ? profile.rol.charAt(0).toUpperCase() + profile.rol.slice(1)
    : 'Colaborador';
  const communityName = profile?.comunidad || 'Comunidad no especificada';
  const userName = profile?.nombre_completo || 'Usuario';
  const status = profile?.estado || 'pendiente';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getAvatarLetter()}</Text>
        </View>
        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.role}>
          {roleName} - {communityName}
        </Text>

        <View style={[styles.statusBadge, styles[`status_${status}`]]}>
          <Text style={[styles.statusText, styles[`statusText_${status}`]]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.menuContainer}></View>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          accessibilityRole="button"
          accessibilityLabel="Ver mis aportes"
        >
          <Text style={styles.menuText}>Mis Aportes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          accessibilityRole="button"
          accessibilityLabel="Configurar audio"
        >
          <Text style={styles.menuText}>Configuración de Audio</Text>
        </TouchableOpacity>

        {/* Esta sección sería solo visible si el role === 'superadmin' */}
        {isSuperadmin && (
          <View style={styles.adminSection}>
            <Text style={styles.adminTitle}>Superadmin Panel</Text>
            <TouchableOpacity
              style={styles.menuItem}
              accessibilityRole="button"
              accessibilityLabel="Aprobar usuarios nuevos"
            >
              <Text style={styles.menuText}>Aprobar Usuarios Nuevos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              accessibilityRole="button"
              accessibilityLabel="Revisar calidad de datos para IA"
            >
              <Text style={styles.menuText}>Revisar Calidad de Datos (IA)</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[styles.menuItem, styles.logoutBtn]}
          onPress={handleLogout}
          accessibilityRole="button"
          accessibilityLabel="Cerrar sesión"
        >
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        {/* Implementación del Derecho al Olvido (Art. 16 de la Ley 81 de Protección de Datos Personales de Panamá) */}
        <TouchableOpacity
          style={[styles.menuItem, styles.deleteBtn]}
          onPress={handleDeleteAccount}
          accessibilityRole="button"
          accessibilityLabel="Eliminar mi cuenta y todos mis datos"
        >
          <Text style={styles.deleteText}>Eliminar mi cuenta y todos mis datos</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    marginTop: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: 4,
    borderRadius: 12,
  },
  status_aprobado: {
    backgroundColor: '#E8F5E9',
  },
  statusText_aprobado: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: 'bold',
  },
  status_pendiente: {
    backgroundColor: '#FFF8E1',
  },
  statusText_pendiente: {
    color: '#F57F17',
    fontSize: 12,
    fontWeight: 'bold',
  },
  status_bloqueado: {
    backgroundColor: '#FFEBEE',
  },
  statusText_bloqueado: {
    color: '#D32F2F',
    fontSize: 12,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  name: {
    ...theme.typography.header,
    color: theme.colors.surface,
  },
  role: {
    ...theme.typography.body,
    color: theme.colors.surface,
    opacity: 0.8,
  },
  menuContainer: {
    padding: theme.spacing.m,
    marginTop: theme.spacing.m,
  },
  menuItem: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borders.radius,
    marginBottom: theme.spacing.s,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  menuText: {
    ...theme.typography.body,
    fontWeight: '500',
  },
  adminSection: {
    marginTop: theme.spacing.l,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.m,
  },
  adminTitle: {
    ...theme.typography.title,
    fontSize: 14,
    color: theme.colors.error, // Usamos rojo para destacar que es de admin
    marginBottom: theme.spacing.s,
    textTransform: 'uppercase',
  },
  logoutBtn: {
    marginTop: theme.spacing.xl,
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  logoutText: {
    color: theme.colors.error,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  deleteBtn: {
    marginTop: theme.spacing.s,
    backgroundColor: '#D32F2F',
    borderWidth: 0,
  },
  deleteText: {
    color: theme.colors.surface,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
