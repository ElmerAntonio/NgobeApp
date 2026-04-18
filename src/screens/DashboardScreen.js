import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { theme } from '../utils/theme';
import NgobeTriangle from '../components/NgobeTriangle';

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.greeting}>¡Ñagare!</Text>
          <Text style={styles.subtitle}>Bienvenido al portal de preservación</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <NgobeTriangle color={theme.colors.accent} size={30} style={styles.icon} />
            <Text style={styles.statValue}>124</Text>
            <Text style={styles.statLabel}>Aportes tuyos</Text>
          </View>
          <View style={styles.statCard}>
            <NgobeTriangle color={theme.colors.primary} size={30} style={styles.icon} />
            <Text style={styles.statValue}>45</Text>
            <Text style={styles.statLabel}>Audios pendientes</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Últimas Actividades</Text>
          <View style={styles.activityItem}>
            <Text style={styles.activityText}>Agregaste la palabra "Kri" (Árbol)</Text>
            <Text style={styles.activityDate}>Hoy, 10:30 AM</Text>
          </View>
          <View style={styles.activityItem}>
            <Text style={styles.activityText}>Subiste un cuento en dialecto Nedrini</Text>
            <Text style={styles.activityDate}>Ayer, 4:15 PM</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.m,
  },
  header: {
    marginVertical: theme.spacing.l,
    alignItems: 'center',
  },
  greeting: {
    ...theme.typography.header,
    color: theme.colors.primary,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  statCard: {
    backgroundColor: theme.colors.surface,
    flex: 1,
    marginHorizontal: theme.spacing.xs,
    padding: theme.spacing.m,
    borderRadius: theme.borders.radius,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    marginBottom: theme.spacing.s,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statLabel: {
    ...theme.typography.caption,
    marginTop: theme.spacing.xs,
  },
  section: {
    marginTop: theme.spacing.l,
  },
  sectionTitle: {
    ...theme.typography.title,
    marginBottom: theme.spacing.m,
  },
  activityItem: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borders.radius,
    marginBottom: theme.spacing.s,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.secondary,
  },
  activityText: {
    ...theme.typography.body,
    fontWeight: '500',
  },
  activityDate: {
    ...theme.typography.caption,
    marginTop: theme.spacing.xs,
  }
});
