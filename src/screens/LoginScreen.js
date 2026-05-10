import React, { useState } from "react";
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
} from "react-native";
import { supabase } from "../services/supabaseClient";
import { theme } from "../utils/theme";
import { validateAuthForm } from "../utils/validation";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

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
        navigation.replace("Main");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // Asumiendo que la confirmación de email está desactivada, el usuario ya debería estar logueado.
        navigation.replace("Main");
      }
    } catch (error) {
      Alert.alert("Error de Autenticación", error.message);
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>NgöbeApp</Text>
          <Text style={styles.subtitle}>Preservando nuestras raíces</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="maestro@comarca.pa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            accessibilityLabel="Correo electrónico"
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            accessibilityLabel="Contraseña"
          />

          {!isLogin && (
            <TouchableOpacity
              style={styles.consentRow}
              onPress={() => setAcceptedTerms(!acceptedTerms)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: acceptedTerms }}
              accessibilityLabel="Aceptar política de privacidad y términos de uso"
            >
              <View
                style={[
                  styles.checkbox,
                  acceptedTerms && styles.checkboxChecked,
                ]}
              >
                {acceptedTerms && <Text style={styles.checkboxMark}>✓</Text>}
              </View>
              <Text style={styles.consentText}>
                Acepto la política de privacidad y los términos de uso antes de
                aportar datos o audios.
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={handleAuth}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel={isLogin ? "Ingresar" : "Registrarse"}
          >
            {isLoading ? (
              <ActivityIndicator color={theme.colors.surface} />
            ) : (
              <Text style={styles.buttonText}>
                {isLogin ? "Ingresar" : "Registrarse"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={handleToggleMode}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel={isLogin ? "Cambiar a registro" : "Cambiar a ingreso"}
          >
            <Text style={styles.toggleButtonText}>
              {isLogin
                ? "¿No tienes cuenta? Regístrate"
                : "¿Ya tienes cuenta? Ingresa"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            Acceso exclusivo para maestros y superadmin
          </Text>
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
    justifyContent: "center",
    padding: theme.spacing.xl,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: theme.spacing.xxl,
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
    fontStyle: "italic",
  },
  formContainer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.l,
    borderRadius: theme.borders.radiusLarge,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    ...theme.typography.caption,
    marginBottom: theme.spacing.xs,
    fontWeight: "600",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borders.radius,
    paddingHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.m,
    backgroundColor: "#FAFAFA",
  },
  button: {
    backgroundColor: theme.colors.primary,
    height: 50,
    borderRadius: theme.borders.radius,
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing.s,
  },
  buttonText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: "bold",
  },
  footerContainer: {
    marginTop: theme.spacing.xl,
    alignItems: "center",
  },
  footerText: {
    ...theme.typography.caption,
    textAlign: "center",
  },
  toggleButton: {
    marginTop: theme.spacing.m,
    alignItems: "center",
  },
  toggleButtonText: {
    color: theme.colors.primary,
    ...theme.typography.caption,
    fontWeight: "600",
  },
  consentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: theme.spacing.m,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.s,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
  },
  checkboxMark: {
    color: theme.colors.surface,
    fontWeight: "bold",
  },
  consentText: {
    ...theme.typography.caption,
    flex: 1,
    color: theme.colors.textPrimary,
  },
});
