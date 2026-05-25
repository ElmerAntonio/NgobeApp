import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { supabase } from '../services/supabaseClient';
import { getApiUrl } from '../services/api';
import { theme } from '../utils/theme';

export default function ApproveUsersScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchPendingUsers = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No hay sesión activa.');

      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/users/account/pending-approvals`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Error al obtener usuarios pendientes.');

      setUsers(result || []);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.message || 'No se pudieron cargar los usuarios pendientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleApproveUser = async (id, chosenRole) => {
    setActionLoadingId(id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const apiUrl = getApiUrl();

      const response = await fetch(`${apiUrl}/users/account/${id}/approve-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ rol: chosenRole }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Error al aprobar usuario.');

      Alert.alert('Aprobado', `Usuario aprobado con rol ${chosenRole}.`);
      fetchPendingUsers();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.message || 'No se pudo aprobar al usuario.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleBlockUser = async (id) => {
    Alert.alert(
      '¿Bloquear usuario?',
      'Esta acción impedirá que el usuario inicie sesión o interactúe con el sistema.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar Bloqueo',
          style: 'destructive',
          onPress: async () => {
            setActionLoadingId(id);
            try {
              const { data: { session } } = await supabase.auth.getSession();
              const apiUrl = getApiUrl();

              const response = await fetch(`${apiUrl}/users/account/${id}/block-profile`, {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${session.access_token}`,
                },
              });

              if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Error al bloquear usuario.');
              }

              Alert.alert('Bloqueado', 'Usuario bloqueado exitosamente.');
              fetchPendingUsers();
            } catch (err) {
              console.error(err);
              Alert.alert('Error', err.message);
            } finally {
              setActionLoadingId(null);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.nameText}>{item.nombre_completo || 'Usuario sin Nombre'}</Text>
        <Text style={styles.emailText}>{item.comunidad || 'Sin comunidad registrada'}</Text>
      </View>
      <Text style={styles.roleText}>Rol solicitado: {item.rol}</Text>
      <Text style={styles.dateText}>Registrado el: {new Date(item.created_at).toLocaleDateString()}</Text>

      {actionLoadingId === item.id ? (
        <ActivityIndicator style={styles.loader} size="small" color={theme.colors.primary} />
      ) : (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.blockBtn}
            onPress={() => handleBlockUser(item.id)}
          >
            <Text style={styles.blockText}>Bloquear</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.approveBtn, styles.colabColor]}
            onPress={() => handleApproveUser(item.id, 'colaborador')}
          >
            <Text style={styles.approveBtnText}>Aprobar Colaborador</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.approveBtn, styles.maestroColor]}
            onPress={() => handleApproveUser(item.id, 'maestro')}
          >
            <Text style={styles.approveBtnText}>Aprobar Maestro</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Aprobar Usuarios</Text>
        <Text style={styles.subtitle}>Panel Administrativo para Gestión y Activación de Cuentas</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : users.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyIcon}>🛡️</Text>
          <Text style={styles.emptyText}>No hay usuarios pendientes de aprobación en este momento.</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.m,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    marginBottom: theme.spacing.s,
  },
  backText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  title: {
    ...theme.typography.header,
    color: theme.colors.primary,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  list: {
    padding: theme.spacing.m,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borders.radius,
    marginBottom: theme.spacing.m,
    borderLeftWidth: 5,
    borderLeftColor: theme.colors.accent,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: theme.spacing.s,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  emailText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  roleText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 2,
  },
  dateText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.m,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  blockBtn: {
    flex: 1,
    backgroundColor: '#FFEBEE',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginRight: 6,
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  blockText: {
    color: theme.colors.error,
    fontWeight: 'bold',
    fontSize: 11,
  },
  approveBtn: {
    flex: 1.5,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginRight: 6,
  },
  colabColor: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
  maestroColor: {
    backgroundColor: theme.colors.accent,
  },
  approveBtnText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 11,
    textAlign: 'center',
  },
  loader: {
    marginTop: theme.spacing.s,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.m,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
