import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { theme } from '../utils/theme';

export default function ContributeScreen() {
  const [category, setCategory] = useState('word'); // word, phrase, story, song
  const [ngobeText, setNgobeText] = useState('');
  const [spanishText, setSpanishText] = useState('');
  const [region, setRegion] = useState('General');

  const handleRecordAudio = (speed) => {
    // Aquí iría la integración con react-native-audio
    alert(`Iniciando grabación ${speed}...`);
  };

  const handleSubmit = () => {
    // Aquí iría la subida a Supabase
    alert('Aporte guardado exitosamente');
    setNgobeText('');
    setSpanishText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.headerTitle}>Nuevo Aporte</Text>
        <Text style={styles.description}>
          Comparte tu conocimiento. Si vas a grabar un audio, asegúrate de estar en un lugar silencioso.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Categoría</Text>
          <View style={styles.categoryRow}>
            {['Palabra', 'Frase', 'Cuento', 'Canción'].map((cat, idx) => (
              <TouchableOpacity key={idx} style={[styles.catBtn, idx === 0 && styles.catBtnActive]}>
                <Text style={[styles.catBtnText, idx === 0 && styles.catBtnTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Región / Dialecto</Text>
          <TextInput
            style={styles.input}
            value={region}
            onChangeText={setRegion}
            placeholder="Ej. Ñö Kribo, Nedrini..."
          />

          <Text style={styles.label}>Texto en Ngäbe</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={ngobeText}
            onChangeText={setNgobeText}
            placeholder="Escribe cómo se dice..."
            multiline
            numberOfLines={3}
          />

          <Text style={styles.label}>Traducción al Español</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={spanishText}
            onChangeText={setSpanishText}
            placeholder="Significado exacto..."
            multiline
            numberOfLines={3}
          />

          <Text style={styles.label}>Audios para IA</Text>
          <View style={styles.audioContainer}>
            <TouchableOpacity style={styles.audioBtn} onPress={() => handleRecordAudio('lento')}>
              <Text style={styles.audioBtnText}>🎙️ Grabar Lento</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.audioBtn} onPress={() => handleRecordAudio('rapido')}>
              <Text style={styles.audioBtnText}>🎙️ Grabar Rápido (Natural)</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>Subir Aporte</Text>
          </TouchableOpacity>
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
  headerTitle: {
    ...theme.typography.header,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.l,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borders.radiusLarge,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    ...theme.typography.title,
    fontSize: 16,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.m,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borders.radius,
    padding: theme.spacing.s,
    backgroundColor: '#FAFAFA',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
  },
  catBtn: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.s,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  catBtnActive: {
    backgroundColor: theme.colors.primary,
  },
  catBtnText: {
    color: theme.colors.primary,
    fontSize: 12,
  },
  catBtnTextActive: {
    color: theme.colors.surface,
  },
  audioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.s,
  },
  audioBtn: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    padding: theme.spacing.m,
    borderRadius: theme.borders.radius,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  audioBtnText: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  submitBtn: {
    backgroundColor: theme.colors.accent,
    padding: theme.spacing.m,
    borderRadius: theme.borders.radius,
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  submitBtnText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
