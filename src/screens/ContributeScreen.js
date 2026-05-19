import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';
import { theme } from '../utils/theme';
import { supabase } from '../services/supabaseClient';
import { CONTRIBUTION_CATEGORIES, validateContribution } from '../utils/validation';

export default function ContributeScreen() {
  const [category, setCategory] = useState('Palabra');
  const [ngobeText, setNgobeText] = useState('');
  const [spanishText, setSpanishText] = useState('');
  const [region, setRegion] = useState('General');
  const [loading, setLoading] = useState(false);

  const [recording, setRecording] = useState(null);
  const [recordings, setRecordings] = useState({ lento: null, rapido: null });

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, []);

  async function startRecording(type) {
    if (recording) return;

    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording({ instance: recording, type });
      } else {
        Alert.alert('Permiso denegado', 'Necesitamos acceso al micrófono para grabar.');
      }
    } catch (err) {
      console.error('Error al iniciar grabación', err);
    }
  }

  async function stopRecording() {
    if (!recording) return;

    try {
      // Obtener el estado para verificar la duración antes de descargar
      const status = await recording.instance.getStatusAsync();
      await recording.instance.stopAndUnloadAsync();

      // Validar duración mínima de 2 segundos (2000 ms)
      if (status.durationMillis < 2000) {
        Alert.alert(
          'Audio muy corto',
          'El audio debe durar al menos 2 segundos. Intenta de nuevo.'
        );
        setRecording(null);
        return;
      }

      const uri = recording.instance.getURI();
      setRecordings((prev) => ({ ...prev, [recording.type]: uri }));
      setRecording(null);
    } catch (error) {
      console.error('Error al detener grabación', error);
    }
  }

  const uploadAudio = async (uri, fileName) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    // Validar el tamaño del archivo (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB en bytes
    if (blob.size > maxSize) {
      throw new Error('El archivo de audio supera el límite de 10MB permitido.');
    }

    const arrayBuffer = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsArrayBuffer(blob);
    });

    // Validar formato de audio verificando bytes mágicos
    const bytes = new Uint8Array(arrayBuffer);

    // Helper para verificar los primeros N bytes
    const checkBytes = (offset, expectedBytes) => {
      if (bytes.length < offset + expectedBytes.length) return false;
      for (let i = 0; i < expectedBytes.length; i++) {
        if (bytes[offset + i] !== expectedBytes[i]) return false;
      }
      return true;
    };

    let isAudioFile = false;

    // Verificar si es M4A / AAC (ftyp box en el offset 4)
    // ftyp = 0x66 0x74 0x79 0x70
    if (checkBytes(4, [0x66, 0x74, 0x79, 0x70])) {
      isAudioFile = true;
    }
    // Verificar si es WAV (empieza con RIFF)
    // RIFF = 0x52 0x49 0x46 0x46
    else if (checkBytes(0, [0x52, 0x49, 0x46, 0x46])) {
      isAudioFile = true;
    }
    // Verificar si es MP3 (empieza con ID3 o 0xFF 0xFB/0xF3/0xF2)
    // ID3 = 0x49 0x44 0x33
    else if (
      checkBytes(0, [0x49, 0x44, 0x33]) ||
      checkBytes(0, [0xff, 0xfb]) ||
      checkBytes(0, [0xff, 0xf3]) ||
      checkBytes(0, [0xff, 0xf2])
    ) {
      isAudioFile = true;
    }

    if (!isAudioFile) {
      throw new Error('El archivo seleccionado no es un formato de audio válido o está corrupto.');
    }

    const { data, error } = await supabase.storage
      .from('audios')
      .upload(`contributions/${fileName}`, arrayBuffer, {
        contentType: 'audio/m4a',
      });

    if (error) throw error;
    return data.path;
  };

  const handleSubmit = async () => {
    const validation = validateContribution({
      category,
      ngobeText,
      spanishText,
      region,
      recordings,
    });

    if (!validation.isValid) {
      Alert.alert(validation.title, validation.message);
      return;
    }

    setLoading(true);
    try {
      let audioLentoPath = null;
      let audioRapidoPath = null;

      const timestamp = Date.now();
      if (recordings.lento) {
        audioLentoPath = await uploadAudio(recordings.lento, `lento_${timestamp}.m4a`);
      }
      if (recordings.rapido) {
        audioRapidoPath = await uploadAudio(recordings.rapido, `rapido_${timestamp}.m4a`);
      }

      const { error } = await supabase.from('contributions').insert([
        {
          category,
          ngobe_text: ngobeText,
          spanish_text: spanishText,
          region,
          audio_lento_url: audioLentoPath,
          audio_rapido_url: audioRapidoPath,
          status: 'pending',
        },
      ]);

      if (error) throw error;

      Alert.alert('¡Éxito!', 'Tu aporte ha sido enviado para revisión.');
      setNgobeText('');
      setSpanishText('');
      setRecordings({ lento: null, rapido: null });
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.headerTitle}>Nuevo Aporte</Text>
        <Text style={styles.description}>
          Comparte tu conocimiento. El audio ayudará a entrenar la IA para reconocer el Ngäbere.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Categoría</Text>
          <View style={styles.categoryRow}>
            {CONTRIBUTION_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategory(cat)}
                style={[styles.catBtn, category === cat && styles.catBtnActive]}
                accessibilityRole="button"
                accessibilityState={{ selected: category === cat }}
                accessibilityLabel={`Categoría ${cat}`}
              >
                <Text style={[styles.catBtnText, category === cat && styles.catBtnTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Región / Dialecto</Text>
          <TextInput
            style={styles.input}
            value={region}
            onChangeText={setRegion}
            placeholder="Ej. Ñö Kribo, Nedrini..."
            accessibilityLabel="Región o dialecto"
          />

          <Text style={styles.label}>Texto en Ngäbe</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={ngobeText}
            onChangeText={setNgobeText}
            placeholder="Escribe cómo se dice..."
            multiline
            numberOfLines={3}
            accessibilityLabel="Texto en Ngäbe"
          />

          <Text style={styles.label}>Traducción al Español</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={spanishText}
            onChangeText={setSpanishText}
            placeholder="Significado exacto..."
            multiline
            numberOfLines={3}
            accessibilityLabel="Traducción al Español"
          />

          <Text style={styles.label}>Audios para IA</Text>
          <View style={styles.audioContainer}>
            <TouchableOpacity
              style={[styles.audioBtn, recording?.type === 'lento' && styles.recordingActive]}
              onPressIn={() => startRecording('lento')}
              onPressOut={stopRecording}
              accessibilityRole="button"
              accessibilityLabel="Mantener presionado para grabar audio lento"
            >
              <Text style={styles.audioBtnText}>
                {recordings.lento ? '✅ Lento Grabado' : '🎙️ Mantén para Lento'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.audioBtn, recording?.type === 'rapido' && styles.recordingActive]}
              onPressIn={() => startRecording('rapido')}
              onPressOut={stopRecording}
              accessibilityRole="button"
              accessibilityLabel="Mantener presionado para grabar audio natural"
            >
              <Text style={styles.audioBtnText}>
                {recordings.rapido ? '✅ Rápido Grabado' : '🎙️ Mantén para Natural'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Subir aporte"
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.submitBtnText}>Subir Aporte</Text>
            )}
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
  recordingActive: {
    backgroundColor: '#FFEBEE',
    borderColor: '#D32F2F',
  },
  audioBtnText: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: 11,
    textAlign: 'center',
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
  },
});
