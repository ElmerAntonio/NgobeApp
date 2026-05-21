import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  ScrollView,
} from 'react-native';
import { Audio } from 'expo-av';
import { supabase } from '../services/supabaseClient';
import { theme } from '../utils/theme';

const CATEGORIES = ['Todas', 'Palabra', 'Frase', 'Cuento', 'Canción'];
const INITIAL_LIMIT = 20;
const LOAD_MORE_LIMIT = 10;

// Animación Shimmer para el Skeleton Loader
const SkeletonCard = () => {
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [shimmerValue]);

  const backgroundColor = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E0E0E0', '#F5F5F5'],
  });

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Animated.View style={[styles.skeletonTag, { backgroundColor }]} />
        <Animated.View style={[styles.skeletonRegion, { backgroundColor }]} />
      </View>
      <Animated.View style={[styles.skeletonTextLarge, { backgroundColor }]} />
      <Animated.View style={[styles.skeletonTextSmall, { backgroundColor }]} />
    </View>
  );
};

// Componente de Tarjeta Memoizado
const ContributionCard = React.memo(({ item, isPlaying, isLoadingAudio, onPlayAudio }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.typeTag}>{item.category}</Text>
        <Text style={styles.regionTag}>{item.region}</Text>
      </View>
      <Text style={styles.ngobeText}>{item.ngobe_text}</Text>
      <Text style={styles.spanishText}>{item.spanish_text}</Text>

      {item.audio_lento_url && (
        <TouchableOpacity
          style={styles.audioButton}
          onPress={() => onPlayAudio(item.id, item.audio_lento_url)}
          disabled={isLoadingAudio}
        >
          {isLoadingAudio ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <Text style={styles.audioIcon}>{isPlaying ? '⏸' : '▶'}</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
});

export default function ExploreScreen() {
  // Estados de datos y paginación
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState(null);

  // Estados de filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [regionQuery, setRegionQuery] = useState('');
  const [debouncedRegion, setDebouncedRegion] = useState('');
  const [regionSuggestions, setRegionSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [category, setCategory] = useState('Todas');

  // Estados de Audio
  const [sound, setSound] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const [loadingAudioId, setLoadingAudioId] = useState(null);

  // Debounce para la búsqueda principal
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Debounce para el filtro de región
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedRegion(regionQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [regionQuery]);

  // Limpiar recursos de audio al desmontar
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // Consultar sugerencias de región
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedRegion.length > 2) {
        try {
          const { data, error } = await supabase
            .from('contributions')
            .select('region')
            .eq('status', 'approved')
            .ilike('region', `%${debouncedRegion}%`);

          if (error) throw error;

          if (data) {
            // Filtrar valores únicos, ignorar nulos y vacíos, y tomar hasta 5
            const uniqueRegions = [...new Set(data.map((item) => item.region).filter(Boolean))];
            setRegionSuggestions(uniqueRegions.slice(0, 5));
            setShowSuggestions(true);
          }
        } catch (err) {
          console.error('Error obteniendo sugerencias:', err);
        }
      } else {
        setRegionSuggestions([]);
        setShowSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [debouncedRegion]);

  // Resetear paginación al cambiar cualquier filtro
  useEffect(() => {
    setPage(0);
    setHasMore(true);
    fetchData(0, true);
  }, [debouncedSearch, debouncedRegion, category]);

  // Función para obtener datos
  const fetchData = async (currentPage = page, reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      let query = supabase
        .from('contributions')
        .select('id, ngobe_text, spanish_text, category, region, audio_lento_url, created_at')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      // Aplicar filtro de búsqueda general
      if (debouncedSearch) {
        query = query.or(
          `ngobe_text.ilike.%${debouncedSearch}%,spanish_text.ilike.%${debouncedSearch}%`
        );
      }

      // Aplicar filtro de categoría
      if (category !== 'Todas') {
        query = query.eq('category', category);
      }

      // Aplicar filtro de región
      if (debouncedRegion) {
        query = query.ilike('region', `%${debouncedRegion}%`);
      }

      // Paginación
      const start = reset ? 0 : currentPage * LOAD_MORE_LIMIT + (INITIAL_LIMIT - LOAD_MORE_LIMIT);
      const limit = reset ? INITIAL_LIMIT : LOAD_MORE_LIMIT;
      const end = start + limit - 1;

      query = query.range(start, end);

      const { data: fetchResult, error: fetchError } = await query;

      if (fetchError) {
        // Manejar errores de Supabase por separado
        throw new Error(`Error de base de datos: ${fetchError.message}`);
      }

      if (reset) {
        setData(fetchResult || []);
        // Si obtenemos menos resultados que el límite inicial, no hay más
        if (!fetchResult || fetchResult.length < INITIAL_LIMIT) {
          setHasMore(false);
        }
      } else {
        if (fetchResult && fetchResult.length > 0) {
          setData((prev) => [...prev, ...fetchResult]);
          if (fetchResult.length < LOAD_MORE_LIMIT) {
            setHasMore(false);
          }
        } else {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error(err);
      // Diferenciar error de red (TypeError usual en fetch) de error de BD
      if (err instanceof TypeError && err.message === 'Network request failed') {
        setError('Error de conexión a internet. Verifica tu red.');
      } else {
        setError(err.message || 'Ocurrió un error al cargar los datos.');
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchData(nextPage, false);
    }
  }, [loading, loadingMore, hasMore, page, fetchData]);

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setDebouncedSearch('');
    setRegionQuery('');
    setDebouncedRegion('');
    setCategory('Todas');
    setRegionSuggestions([]);
    setShowSuggestions(false);
  }, []);

  const handleRegionSuggestionPress = useCallback((suggestion) => {
    setRegionQuery(suggestion);
    setDebouncedRegion(suggestion);
    setShowSuggestions(false);
  }, []);

  const handlePlayAudio = useCallback(
    async (id, url) => {
      try {
        // Si ya hay un audio reproduciéndose y es el mismo, lo detenemos
        if (playingId === id) {
          if (sound) {
            await sound.stopAsync();
            setPlayingId(null);
          }
          return;
        }

        // Si hay otro audio reproduciéndose, lo detenemos y descargamos el actual
        if (sound) {
          await sound.unloadAsync();
        }

        setLoadingAudioId(id);

        // En un caso real url de Supabase puede ser una ruta parcial,
        // asumiendo que aquí tenemos la url pública o firmada, o usamos supabase storage.
        // Si url es solo el path (e.g. 'contributions/audio.m4a'):
        let audioUrl = url;
        if (!url.startsWith('http')) {
          const { data: publicUrlData } = supabase.storage.from('audios').getPublicUrl(url);
          audioUrl = publicUrlData.publicUrl;
        }

        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: true }
        );

        setSound(newSound);
        setPlayingId(id);
        setLoadingAudioId(null);

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setPlayingId(null);
          }
        });
      } catch (err) {
        console.error('Error reproduciendo audio', err);
        setLoadingAudioId(null);
        setPlayingId(null);
      }
    },
    [sound, playingId]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <ContributionCard
        item={item}
        isPlaying={playingId === item.id}
        isLoadingAudio={loadingAudioId === item.id}
        onPlayAudio={handlePlayAudio}
      />
    ),
    [playingId, loadingAudioId, handlePlayAudio]
  );

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  const listEmptyComponent = useMemo(() => {
    if (loading) return null; // No mostrar estado vacío si está cargando
    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchData(0, true)}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyIcon}>🔍</Text>
        <Text style={styles.emptyText}>No se encontraron resultados</Text>
        <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
          <Text style={styles.clearButtonText}>Limpiar filtros</Text>
        </TouchableOpacity>
      </View>
    );
  }, [loading, error, handleClearFilters, fetchData]);

  const listFooterComponent = useMemo(() => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  }, [loadingMore]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Diccionario y Conocimiento</Text>

        {/* Barra de Búsqueda Principal */}
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por palabra o frase..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Filtro por Categoría */}
        <View style={styles.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryButton, category === cat && styles.categoryButtonActive]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.categoryText, category === cat && styles.categoryTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Filtro por Región */}
        <View style={styles.regionContainer}>
          <TextInput
            style={styles.regionInput}
            placeholder="Buscar por región..."
            value={regionQuery}
            onChangeText={(text) => {
              setRegionQuery(text);
              if (text.length <= 2) {
                setShowSuggestions(false);
              }
            }}
          />
          {regionQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearRegionButton}
              onPress={() => {
                setRegionQuery('');
                setDebouncedRegion('');
                setShowSuggestions(false);
              }}
            >
              <Text style={styles.clearRegionText}>X</Text>
            </TouchableOpacity>
          )}
          {/* Sugerencias de Región */}
          {showSuggestions && regionSuggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {regionSuggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => handleRegionSuggestionPress(suggestion)}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Lista de Resultados */}
      {loading ? (
        <ScrollView style={styles.listContainer}>
          {[1, 2, 3, 4, 5].map((key) => (
            <SkeletonCard key={key} />
          ))}
        </ScrollView>
      ) : (
        <FlatList
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
          ListEmptyComponent={listEmptyComponent}
          ListFooterComponent={listFooterComponent}
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
    paddingBottom: theme.spacing.s,
    zIndex: 1, // Para que las sugerencias floten sobre la lista
  },
  title: {
    ...theme.typography.header,
    color: theme.colors.primary,
    marginBottom: theme.spacing.m,
  },
  searchInput: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.s,
    borderRadius: theme.borders.radius,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.m,
  },
  categoryContainer: {
    marginBottom: theme.spacing.m,
  },
  categoryButton: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    marginRight: theme.spacing.s,
  },
  categoryButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  categoryText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: theme.colors.surface,
  },
  regionContainer: {
    position: 'relative',
  },
  regionInput: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.s,
    borderRadius: theme.borders.radius,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingRight: 40,
  },
  clearRegionButton: {
    position: 'absolute',
    right: 12,
    top: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
  },
  clearRegionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 45,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borders.radius,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  suggestionItem: {
    padding: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  suggestionText: {
    ...theme.typography.body,
  },
  listContainer: {
    padding: theme.spacing.m,
    flexGrow: 1,
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
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.s,
    paddingRight: 40, // Espacio para el botón de audio
  },
  typeTag: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
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
    paddingRight: 40,
  },
  spanishText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    paddingRight: 40,
  },
  audioButton: {
    position: 'absolute',
    right: theme.spacing.m,
    top: '50%',
    marginTop: -15, // Ajuste para centrar verticalmente
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  audioIcon: {
    fontSize: 12,
    color: theme.colors.primary,
  },
  skeletonTag: {
    width: 60,
    height: 20,
    borderRadius: 10,
  },
  skeletonRegion: {
    width: 80,
    height: 15,
    borderRadius: 4,
  },
  skeletonTextLarge: {
    width: '70%',
    height: 24,
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonTextSmall: {
    width: '90%',
    height: 16,
    borderRadius: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.m,
  },
  emptyText: {
    ...theme.typography.title,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  clearButton: {
    padding: theme.spacing.m,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borders.radius,
  },
  clearButtonText: {
    color: theme.colors.surface,
    fontWeight: 'bold',
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.error,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  retryButton: {
    padding: theme.spacing.m,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borders.radius,
  },
  retryButtonText: {
    color: theme.colors.surface,
    fontWeight: 'bold',
  },
  footerLoader: {
    paddingVertical: theme.spacing.m,
    alignItems: 'center',
  },
});
