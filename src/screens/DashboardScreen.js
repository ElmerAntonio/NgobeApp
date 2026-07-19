import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../utils/theme';
import NgobeTriangle from '../components/NgobeTriangle';

export default function DashboardScreen() {
  const getNgobeGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      return { native: 'Köböre Kwen', spanish: '¡Buenos días!' };
    } else if (hour >= 12 && hour < 18) {
      return { native: 'Mene Kwen', spanish: '¡Buenas tardes!' };
    } else {
      return { native: 'De Kwen', spanish: '¡Buenas noches!' };
    }
  };

  const greeting = getNgobeGreeting();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.greeting}>{greeting.native}</Text>
          <Text style={styles.subtitle}>{greeting.spanish} - Bienvenido al portal de preservación</Text>
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
            <View style={styles.activityIconWrap}>
              <Ionicons name="create-outline" size={16} color={theme.colors.primary} />
            </View>
            <View style={styles.activityBody}>
              <Text style={styles.activityText}>Agregaste la palabra {"\""}Kri{"\""} (Árbol)</Text>
              <Text style={styles.activityDate}>Hoy, 10:30 AM</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={styles.activityIconWrap}>
              <Ionicons name="book-outline" size={16} color={theme.colors.secondary} />
            </View>
            <View style={styles.activityBody}>
              <Text style={styles.activityText}>Subiste un cuento en dialecto Nedrini</Text>
              <Text style={styles.activityDate}>Ayer, 4:15 PM</Text>
            </View>
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
    marginHorizontal: -theme.spacing.m,
    marginTop: -theme.spacing.m,
    marginBottom: theme.spacing.l,
    paddingHorizontal: theme.spacing.m,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  greeting: {
    ...theme.typography.header,
    color: theme.colors.textOnPrimary,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textOnPrimary,
    opacity: 0.85,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
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
    borderRadius: theme.borders.radiusLarge,
    alignItems: 'center',
    ...theme.shadows.small,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borders.radiusLarge,
    marginBottom: theme.spacing.s,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.secondary,
  },
  activityIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.s,
  },
  activityBody: {
    flex: 1,
  },
  activityText: {
    ...theme.typography.body,
    fontWeight: '500',
  },
  activityDate: {
    ...theme.typography.caption,
    marginTop: theme.spacing.xs,
  },
});
