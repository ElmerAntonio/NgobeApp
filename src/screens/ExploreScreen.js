import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { theme } from '../utils/theme';

const MOCK_DATA = [
  { id: '1', ngobe: 'Kri', spanish: 'Árbol', region: 'General', type: 'Palabra' },
  { id: '2', ngobe: 'Ti tä kweri', spanish: 'Yo estoy bien', region: 'Ñö Kribo', type: 'Frase' },
  { id: '3', ngobe: 'Ngöbö', spanish: 'Dios / El creador', region: 'General', type: 'Palabra' },
];

export default function ExploreScreen() {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.typeTag}>{item.type}</Text>
        <Text style={styles.regionTag}>{item.region}</Text>
      </View>
      <Text style={styles.ngobeText}>{item.ngobe}</Text>
      <Text style={styles.spanishText}>{item.spanish}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Diccionario y Conocimiento</Text>
        <Text style={styles.subtitle}>Explora lo que otros maestros han aportado</Text>
      </View>

      <FlatList
        data={MOCK_DATA}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
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
  },
  title: {
    ...theme.typography.header,
    color: theme.colors.primary,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  listContainer: {
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.s,
  },
  typeTag: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 'bold',
  },
  regionTag: {
    color: theme.colors.secondary,
    fontSize: 12,
    fontStyle: 'italic',
  },
  ngobeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  spanishText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  }
});
