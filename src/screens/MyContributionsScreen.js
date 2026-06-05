import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { supabase } from '../services/supabaseClient';
import { getApiUrl } from '../services/api';
import { theme } from '../utils/theme';

export default function MyContributionsScreen({ navigation }) {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyContributions = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('No se pudo obtener la sesión actual.');
      }

      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/contributions/my-contributions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Error al obtener aportaciones.');
      }

      setContributions(result || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al cargar tus aportes.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const loadContributions = async () => {
      await fetchMyContributions();
    };
    loadContributions();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMyContributions();
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved':
        return styles.statusApproved;
      case 'rejected':
        return styles.statusRejected;
      default:
        return styles.statusPending;
    }
  };

  const translateStatus = (status) => {
    switch (status) {
      case 'approved':
        return 'Aprobado';
      case 'rejected':
        return 'Rechazado';
      default:
        return 'Pendiente';
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.categoryTag}>{item.category}</Text>
        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
          <Text style={styles.statusText}>{translateStatus(item.status)}</Text>
        </View>
      </View>
      <Text style={styles.ngobeText}>{item.ngobe_text}</Text>
      <Text style={styles.spanishText}>{item.spanish_text}</Text>
      {item.region && <Text style={styles.regionText}>📍 Región: {item.region}</Text>}
      {item.status === 'approved' && item.transcripcion_fonetica && (
        <View style={styles.phoneticContainer}>
          <Text style={styles.phoneticLabel}>Transcripción Fonética:</Text>
          <Text style={styles.phoneticText}>[{item.transcripcion_fonetica}]</Text>
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
        <Text style={styles.title}>Mis Aportes</Text>
        <Text style={styles.subtitle}>Historial de tus contribuciones culturales y lingüísticas</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchMyContributions}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : contributions.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyIcon}>✍️</Text>
          <Text style={styles.emptyText}>Aún no has enviado ningún aporte.</Text>
          <TouchableOpacity style={styles.contributeButton} onPress={() => navigation.navigate('Contribute')}>
            <Text style={styles.contributeButtonText}>Hacer mi primer aporte</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={contributions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
          }
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
    fontSize: 13,
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
    borderLeftColor: theme.colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  categoryTag: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 11,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusApproved: {
    backgroundColor: '#E8F5E9',
  },
  statusRejected: {
    backgroundColor: '#FFEBEE',
  },
  statusPending: {
    backgroundColor: '#FFF8E1',
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333',
  },
  ngobeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  spanishText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  regionText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  phoneticContainer: {
    marginTop: theme.spacing.s,
    padding: theme.spacing.s,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    borderLeftWidth: 2,
    borderLeftColor: theme.colors.accent,
  },
  phoneticLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: theme.colors.textSecondary,
  },
  phoneticText: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: theme.spacing.m,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borders.radius,
  },
  retryText: {
    color: theme.colors.surface,
    fontWeight: 'bold',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.m,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.l,
  },
  contributeButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: theme.borders.radius,
  },
  contributeButtonText: {
    color: theme.colors.surface,
    fontWeight: 'bold',
  },
});
