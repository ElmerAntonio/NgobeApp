import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { theme } from '../utils/theme';

export default function ProfileScreen({ navigation }) {
  const handleLogout = () => {
    // Aquí iría el signout de Supabase
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>M</Text>
        </View>
        <Text style={styles.name}>Maestro Autorizado</Text>
        <Text style={styles.role}>Comunidad de Ñö Kribo</Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Mis Aportes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Configuración de Audio</Text>
        </TouchableOpacity>

        {/* Esta sección sería solo visible si el role === 'superadmin' */}
        <View style={styles.adminSection}>
          <Text style={styles.adminTitle}>Superadmin Panel</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Aprobar Usuarios Nuevos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Revisar Calidad de Datos (IA)</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.menuItem, styles.logoutBtn]} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  }
});
