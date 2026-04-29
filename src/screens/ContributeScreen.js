import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { theme } from '../utils/theme';
import { supabase } from '../services/supabaseClient';

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
      await recording.instance.stopAndUnloadAsync();
      const uri = recording.instance.getURI();
      setRecordings(prev => ({ ...prev, [recording.type]: uri }));
      setRecording(null);
    } catch (error) {
      console.error('Error al detener grabación', error);
    }
  }

  const uploadAudio = async (uri, fileName) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const arrayBuffer = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsArrayBuffer(blob);
    });

    const { data, error } = await supabase.storage
      .from('audios')
      .upload(`contributions/${fileName}`, arrayBuffer, {
        contentType: 'audio/m4a',
      });

    if (error) throw error;
    return data.path;
  };

  const handleSubmit = async () => {
    if (!ngobeText || !spanishText) {
      Alert.alert('Faltan datos', 'Por favor completa los campos de texto.');
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
          status: 'pending'
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
            {['Palabra', 'Frase', 'Cuento', 'Canción'].map((cat) => (
              <TouchableOpacity 
                key={cat} 
                onPress={() => setCategory(cat)}
                style={[styles.catBtn, category === cat && styles.catBtnActive]}
              >
                <Text style={[styles.catBtnText, category === cat && styles.catBtnTextActive]}>{cat}</Text>
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
            <TouchableOpacity 
              style={[styles.audioBtn, recording?.type === 'lento' && styles.recordingActive]} 
              onPressIn={() => startRecording('lento')}
              onPressOut={stopRecording}
            >
              <Text style={styles.audioBtnText}>
                {recordings.lento ? '✅ Lento Grabado' : '🎙️ Mantén para Lento'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.audioBtn, recording?.type === 'rapido' && styles.recordingActive]} 
              onPressIn={() => startRecording('rapido')}
              onPressOut={stopRecording}
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
          >
            {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.submitBtnText}>Subir Aporte</Text>}
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
    textAlign: 'center'
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
