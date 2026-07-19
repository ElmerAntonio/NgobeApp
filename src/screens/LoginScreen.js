import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/supabaseClient';
import { theme } from '../utils/theme';
import { validateAuthForm } from '../utils/validation';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NgobeTriangle from '../components/NgobeTriangle';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const checkPrivacyAcceptance = async () => {
        try {
          const accepted = await AsyncStorage.getItem('privacy_accepted');
          if (accepted === 'true') {
            setAcceptedTerms(true);
          }
        } catch (error) {
          console.error('Error leyendo la aceptación de la política', error);
        }
      };

      checkPrivacyAcceptance();
    }, [])
  );

  const handleAuth = async () => {
    const validation = validateAuthForm({
      email,
      password,
      isLogin,
      acceptedTerms,
    });

    if (!validation.isValid) {
      Alert.alert(validation.title, validation.message);
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigation.replace('Main');
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // Asumiendo que la confirmación de email está desactivada, el usuario ya debería estar logueado.
        navigation.replace('Main');
      }
    } catch (error) {
      Alert.alert('Error de Autenticación', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMode = () => {
    const nextIsLogin = !isLogin;
    setIsLogin(nextIsLogin);
    if (nextIsLogin) {
      setAcceptedTerms(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.headerContainer}>
          <View style={styles.logoBadge}>
            <NgobeTriangle color={theme.colors.accent} size={26} />
          </View>
          <Text style={styles.title}>NgöbeApp</Text>
          <Text style={styles.subtitle}>Preservando nuestras raíces</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={18} color={theme.colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="maestro@comarca.pa"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              accessibilityLabel="Correo electrónico"
            />
          </View>

          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={18} color={theme.colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.inputWithTrailingIcon]}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              accessibilityLabel="Contraseña"
            />
            <TouchableOpacity
              style={styles.trailingIconButton}
              onPress={() => setShowPassword((prev) => !prev)}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {!isLogin && (
            <View style={styles.consentRow}>
              <TouchableOpacity
                onPress={() => setAcceptedTerms(!acceptedTerms)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: acceptedTerms }}
                accessibilityLabel="Aceptar política de privacidad y términos de uso"
              >
                <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                  {acceptedTerms && <Text style={styles.checkboxMark}>✓</Text>}
                </View>
              </TouchableOpacity>
              <Text style={styles.consentText}>
                Acepto la{' '}
                <Text style={styles.linkText} onPress={() => navigation.navigate('PrivacyPolicy')}>
                  política de privacidad
                </Text>{' '}
                y los términos de uso antes de aportar datos o audios.
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={handleAuth}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel={isLogin ? 'Ingresar' : 'Registrarse'}
          >
            {isLoading ? (
              <ActivityIndicator color={theme.colors.surface} />
            ) : (
              <>
                <Ionicons
                  name={isLogin ? 'log-in-outline' : 'person-add-outline'}
                  size={18}
                  color={theme.colors.surface}
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>{isLogin ? 'Ingresar' : 'Registrarse'}</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={handleToggleMode}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel={isLogin ? 'Cambiar a registro' : 'Cambiar a ingreso'}
          >
            <Text style={styles.toggleButtonText}>
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Ingresa'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Acceso exclusivo para maestros y superadmin</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
    ...theme.shadows.medium,
  },
  title: {
    ...theme.typography.header,
    fontSize: 36,
    color: theme.colors.primary,
    marginBottom: theme.spacing.s,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.secondary,
    fontStyle: 'italic',
  },
  formContainer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.l,
    borderRadius: theme.borders.radiusLarge,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    ...theme.typography.caption,
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
    marginBottom: theme.spacing.m,
  },
  inputIcon: {
    position: 'absolute',
    left: 14,
    zIndex: 1,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borders.radius,
    paddingHorizontal: theme.spacing.m,
    paddingLeft: 40,
    backgroundColor: '#FAFAFA',
  },
  inputWithTrailingIcon: {
    paddingRight: 40,
  },
  trailingIconButton: {
    position: 'absolute',
    right: 14,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    height: 50,
    borderRadius: theme.borders.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.s,
  },
  buttonIcon: {
    marginRight: theme.spacing.s,
  },
  buttonText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerContainer: {
    marginTop: theme.spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    ...theme.typography.caption,
    textAlign: 'center',
  },
  toggleButton: {
    marginTop: theme.spacing.m,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: theme.colors.primary,
    ...theme.typography.caption,
    fontWeight: '600',
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.m,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.s,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
  },
  checkboxMark: {
    color: theme.colors.surface,
    fontWeight: 'bold',
  },
  consentText: {
    ...theme.typography.caption,
    flex: 1,
    color: theme.colors.textPrimary,
  },
  linkText: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
});
