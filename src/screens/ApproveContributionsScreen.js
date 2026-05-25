import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { Audio } from 'expo-av';
import { supabase } from '../services/supabaseClient';
import { getApiUrl } from '../services/api';
import { theme } from '../utils/theme';

export default function ApproveContributionsScreen({ navigation }) {
  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  // Form de aprobación
  const [phonetic, setPhonetic] = useState('');
  const [grammaticalCategory, setGrammaticalCategory] = useState('sustantivo');
  const [acousticQuality, setAcousticQuality] = useState('buena');
  const [hasBackgroundNoise, setHasBackgroundNoise] = useState('no');
  const [submitting, setSubmitting] = useState(false);

  // Audio player states
  const [sound, setSound] = useState(null);
  const [playingType, setPlayingType] = useState(null); // 'lento' | 'rapido' | null
  const [loadingAudio, setLoadingAudio] = useState(false);

  const fetchPending = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No hay sesión activa.');

      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/contributions/pending`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Error al obtener aportes pendientes.');

      setPendingList(result || []);
      setSelectedItem(null);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.message || 'No se pudieron cargar las aportaciones pendientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const handlePlayAudio = async (url, type) => {
    try {
      if (playingType === type) {
        if (sound) {
          await sound.stopAsync();
          setPlayingType(null);
        }
        return;
      }

      if (sound) {
        await sound.unloadAsync();
      }

      setLoadingAudio(true);
      let audioUrl = url;
      if (!url.startsWith('http')) {
        const { data } = supabase.storage.from('audios').getPublicUrl(url);
        audioUrl = data.publicUrl;
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );

      setSound(newSound);
      setPlayingType(type);
      setLoadingAudio(false);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setPlayingType(null);
        }
      });
    } catch (err) {
      console.error(err);
      setLoadingAudio(false);
      setPlayingType(null);
      Alert.alert('Error de Reproducción', 'No se pudo cargar o reproducir el audio.');
    }
  };

  const handleApprove = async () => {
    if (!phonetic.trim()) {
      Alert.alert('Falta Información', 'Por favor ingresa la transcripción fonética antes de aprobar.');
      return;
    }

    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const apiUrl = getApiUrl();

      const response = await fetch(`${apiUrl}/contributions/${selectedItem.id}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          transcripcion_fonetica: phonetic,
          metadatos_linguisticos: {
            duracion_segundos: 2.0, // Duración aproximada por defecto
            formato: 'm4a',
            tipo_audio: 'lento',
            categoria_gramatical: grammaticalCategory,
            detalles_acusticos: {
              calidad_estimada: acousticQuality,
              ruido_fondo: hasBackgroundNoise,
            },
          },
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Error al aprobar aportación.');

      Alert.alert('¡Aprobado!', 'El aporte ha sido integrado al corpus de la IA con éxito.');
      setSelectedItem(null);
      fetchPending();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.message || 'No se pudo completar la aprobación.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async (id) => {
    Alert.alert(
      '¿Rechazar aporte?',
      'Esta aportación será marcada como rechazada y no se utilizará en el corpus.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar Rechazo',
          style: 'destructive',
          onPress: async () => {
            setSubmitting(true);
            try {
              const { data: { session } } = await supabase.auth.getSession();
              const apiUrl = getApiUrl();

              const response = await fetch(`${apiUrl}/contributions/${id}/reject`, {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${session.access_token}`,
                },
              });

              if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Error al rechazar aportación.');
              }

              Alert.alert('Rechazado', 'Aporte marcado como rechazado.');
              setSelectedItem(null);
              fetchPending();
            } catch (err) {
              console.error(err);
              Alert.alert('Error', err.message);
            } finally {
              setSubmitting(false);
            }
          },
        },
      ]
    );
  };

  const renderPendingItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, selectedItem?.id === item.id && styles.cardSelected]}
      onPress={() => {
        setSelectedItem(item);
        setPhonetic(item.transcripcion_fonetica || '');
      }}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.categoryTag}>{item.category}</Text>
        <Text style={styles.regionTag}>{item.region || 'General'}</Text>
      </View>
      <Text style={styles.ngobeText}>{item.ngobe_text}</Text>
      <Text style={styles.spanishText}>{item.spanish_text}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Aprobación de Aportes</Text>
        <Text style={styles.subtitle}>Panel para Maestros y Administradores de la Comarca</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.listSection}>
            <Text style={styles.sectionTitle}>Aportes Pendientes ({pendingList.length})</Text>
            {pendingList.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>🎉 No hay aportes pendientes de revisión.</Text>
              </View>
            ) : (
              <FlatList
                data={pendingList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderPendingItem}
                contentContainerStyle={styles.list}
              />
            )}
          </View>

          {selectedItem && (
            <View style={styles.reviewSection}>
              <ScrollView contentContainerStyle={styles.scrollForm}>
                <Text style={styles.reviewTitle}>Revisión Detallada</Text>
                
                <Text style={styles.reviewNgobe}>{selectedItem.ngobe_text}</Text>
                <Text style={styles.reviewSpanish}>{selectedItem.spanish_text}</Text>

                {/* Audios */}
                <Text style={styles.label}>Grabaciones de Voz</Text>
                <View style={styles.audioRow}>
                  {selectedItem.audio_lento_url && (
                    <TouchableOpacity
                      style={[styles.audioButton, playingType === 'lento' && styles.audioPlaying]}
                      onPress={() => handlePlayAudio(selectedItem.audio_lento_url, 'lento')}
                      disabled={loadingAudio}
                    >
                      <Text style={styles.audioButtonText}>
                        {playingType === 'lento' ? '⏸ Detener Lento' : '▶ Reproducir Lento'}
                      </Text>
                    </TouchableOpacity>
                  )}
                  {selectedItem.audio_rapido_url && (
                    <TouchableOpacity
                      style={[styles.audioButton, playingType === 'rapido' && styles.audioPlaying]}
                      onPress={() => handlePlayAudio(selectedItem.audio_rapido_url, 'rapido')}
                      disabled={loadingAudio}
                    >
                      <Text style={styles.audioButtonText}>
                        {playingType === 'rapido' ? '⏸ Detener Natural' : '▶ Reproducir Natural'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Fonética Input */}
                <Text style={styles.label}>Transcripción Fonética (Obligatorio para IA)</Text>
                <TextInput
                  style={styles.input}
                  value={phonetic}
                  onChangeText={setPhonetic}
                  placeholder="Ej. /kɔ.βɔ.rɛ/..."
                />

                {/* Categoria Gramatical */}
                <Text style={styles.label}>Categoría Gramatical</Text>
                <View style={styles.optionRow}>
                  {['sustantivo', 'verbo', 'adjetivo', 'frase', 'otro'].map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.optionBtn, grammaticalCategory === cat && styles.optionBtnActive]}
                      onPress={() => setGrammaticalCategory(cat)}
                    >
                      <Text style={[styles.optionText, grammaticalCategory === cat && styles.optionTextActive]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Calidad Acústica */}
                <Text style={styles.label}>Calidad del Audio</Text>
                <View style={styles.optionRow}>
                  {['buena', 'regular', 'baja'].map((qual) => (
                    <TouchableOpacity
                      key={qual}
                      style={[styles.optionBtn, acousticQuality === qual && styles.optionBtnActive]}
                      onPress={() => setAcousticQuality(qual)}
                    >
                      <Text style={[styles.optionText, acousticQuality === qual && styles.optionTextActive]}>
                        {qual}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Ruido de Fondo */}
                <Text style={styles.label}>¿Tiene Ruido de Fondo?</Text>
                <View style={styles.optionRow}>
                  {['si', 'no'].map((noise) => (
                    <TouchableOpacity
                      key={noise}
                      style={[styles.optionBtn, hasBackgroundNoise === noise && styles.optionBtnActive]}
                      onPress={() => setHasBackgroundNoise(noise)}
                    >
                      <Text style={[styles.optionText, hasBackgroundNoise === noise && styles.optionTextActive]}>
                        {noise}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Actions */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[styles.rejectBtn, submitting && { opacity: 0.5 }]}
                    onPress={() => handleReject(selectedItem.id)}
                    disabled={submitting}
                  >
                    <Text style={styles.rejectBtnText}>Rechazar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.approveBtn, submitting && { opacity: 0.5 }]}
                    onPress={handleApprove}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <ActivityIndicator color="#000" />
                    ) : (
                      <Text style={styles.approveBtnText}>Validar y Aprobar</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          )}
        </View>
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
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  listSection: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
    padding: theme.spacing.m,
  },
  sectionTitle: {
    ...theme.typography.title,
    marginBottom: theme.spacing.m,
  },
  emptyContainer: {
    padding: theme.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borders.radius,
    marginBottom: theme.spacing.m,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.border,
  },
  cardSelected: {
    borderLeftColor: theme.colors.primary,
    backgroundColor: '#F1F8E9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  categoryTag: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.surface,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    fontSize: 10,
    fontWeight: 'bold',
  },
  regionTag: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  ngobeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  spanishText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  reviewSection: {
    flex: 1.2,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
  },
  scrollForm: {
    paddingBottom: 40,
  },
  reviewTitle: {
    ...theme.typography.title,
    color: theme.colors.primary,
    marginBottom: theme.spacing.m,
  },
  reviewNgobe: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  reviewSpanish: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.m,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.m,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  audioRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.s,
  },
  audioButton: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginRight: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  audioPlaying: {
    backgroundColor: '#A5D6A7',
  },
  audioButtonText: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: 11,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borders.radius,
    padding: theme.spacing.s,
    backgroundColor: '#FAFAFA',
    fontSize: 16,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  optionBtn: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 6,
    marginBottom: 6,
  },
  optionBtnActive: {
    backgroundColor: theme.colors.primary,
  },
  optionText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  optionTextActive: {
    color: theme.colors.surface,
    fontWeight: 'bold',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: theme.spacing.xl,
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: '#FFEBEE',
    paddingVertical: 12,
    borderRadius: theme.borders.radius,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  rejectBtnText: {
    color: theme.colors.error,
    fontWeight: 'bold',
  },
  approveBtn: {
    flex: 1.5,
    backgroundColor: theme.colors.accent,
    paddingVertical: 12,
    borderRadius: theme.borders.radius,
    alignItems: 'center',
  },
  approveBtnText: {
    color: '#000',
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
