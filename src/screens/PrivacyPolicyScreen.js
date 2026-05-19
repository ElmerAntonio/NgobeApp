import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "../utils/theme";

export default function PrivacyPolicyScreen({ navigation }) {
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);

  // Manejar el evento de scroll para detectar cuando se llega al final
  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    // Usamos una tolerancia de 30 píxeles como acordado
    const paddingToBottom = 30;

    const isEnd =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;

    if (isEnd && !isScrolledToEnd) {
      setIsScrolledToEnd(true);
    }
  };

  const handleAccept = async () => {
    try {
      // Guardar en AsyncStorage que el usuario aceptó la política
      await AsyncStorage.setItem("privacy_accepted", "true");

      // Regresar a la pantalla anterior.
      // El LoginScreen debe actualizar su estado al enfocarse o leer este valor.
      navigation.goBack();
    } catch (error) {
      console.error("Error guardando la aceptación de la política", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16} // Necesario para que onScroll se dispare con suficiente frecuencia
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>
          Política de Privacidad y Tratamiento de Datos Personales
        </Text>

        {/* TODO: Actualizar la fecha de entrada en vigor antes del lanzamiento oficial */}
        <Text style={styles.date}>
          Fecha de entrada en vigor: [FECHA_DE_LANZAMIENTO]
        </Text>

        <Text style={styles.sectionTitle}>1. Información General</Text>
        {/* TODO: Actualizar la entidad responsable antes del lanzamiento oficial */}
        <Text style={styles.paragraph}>
          Esta Política de Privacidad regula el tratamiento de datos personales
          realizado por Proyecto NgobeApp, ubicado en la República de Panamá, en
          adelante el "Responsable del Tratamiento". El presente documento se
          enmarca dentro de las disposiciones de la Ley 81 de 2019 de Protección
          de Datos Personales de la República de Panamá.
        </Text>

        <Text style={styles.sectionTitle}>2. Datos Personales Recopilados</Text>
        <Text style={styles.paragraph}>
          Recopilamos los siguientes tipos de datos personales a través de la
          aplicación NgöbeApp:
        </Text>
        <View style={styles.bulletList}>
          <Text style={styles.bullet}>
            • Correo electrónico (para registro y autenticación).
          </Text>
          <Text style={styles.bullet}>
            • Grabaciones de voz (para preservación del idioma y entrenamiento
            de IA).
          </Text>
          <Text style={styles.bullet}>
            • Información regional (para categorizar variaciones dialectales).
          </Text>
          <Text style={styles.bullet}>
            • Aportes culturales, de vocabulario o textos en idioma Ngäbere.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          3. Finalidad del Tratamiento de Datos
        </Text>
        <Text style={styles.paragraph}>
          Los datos personales recolectados, específicamente las grabaciones de
          voz y textos, serán utilizados con la finalidad exclusiva de
          preservación de la lengua y cultura Ngäbe, educación, y para el
          entrenamiento de modelos de Inteligencia Artificial destinados a la
          traducción y revitalización del idioma Ngäbere. El correo electrónico
          se utilizará únicamente para fines de autenticación y comunicación
          relacionada con el proyecto.
        </Text>

        <Text style={styles.sectionTitle}>4. Acceso a los Datos</Text>
        <Text style={styles.paragraph}>
          El acceso a los datos recopilados estará restringido exclusivamente a:
        </Text>
        <View style={styles.bulletList}>
          <Text style={styles.bullet}>
            • Maestros autorizados para revisar y validar las aportaciones.
          </Text>
          <Text style={styles.bullet}>
            • Administradores del sistema para el mantenimiento de la
            plataforma.
          </Text>
          <Text style={styles.bullet}>
            • Sistemas automatizados de Inteligencia Artificial en entornos
            seguros para su procesamiento.
          </Text>
        </View>
        <Text style={styles.paragraph}>
          No venderemos, compartiremos ni distribuiremos sus datos personales a
          terceros con fines comerciales.
        </Text>

        <Text style={styles.sectionTitle}>5. Tiempo de Conservación</Text>
        <Text style={styles.paragraph}>
          Los datos relacionados con aportes culturales y grabaciones de voz se
          conservarán de manera indefinida, ya que forman parte de un esfuerzo
          histórico y patrimonial para la preservación lingüística, a menos que
          el titular ejerza su derecho de cancelación. Los datos de la cuenta
          (correo) se conservarán mientras la cuenta esté activa.
        </Text>

        <Text style={styles.sectionTitle}>
          6. Derechos ARCO (Ley 81 de 2019)
        </Text>
        <Text style={styles.paragraph}>
          En cumplimiento con la Ley 81 de Panamá, el titular de los datos
          personales podrá ejercer en cualquier momento sus derechos de:
        </Text>
        <View style={styles.bulletList}>
          <Text style={styles.bullet}>
            • Acceso: Solicitar información sobre los datos que tenemos sobre
            usted.
          </Text>
          <Text style={styles.bullet}>
            • Rectificación: Solicitar la corrección de datos incorrectos o
            incompletos.
          </Text>
          <Text style={styles.bullet}>
            • Cancelación (Eliminación): Solicitar la eliminación de sus datos,
            siempre que la ley no nos obligue a conservarlos.
          </Text>
          <Text style={styles.bullet}>
            • Oposición: Oponerse al tratamiento de sus datos para fines
            específicos.
          </Text>
          <Text style={styles.bullet}>
            • Portabilidad: Obtener una copia de sus datos en un formato
            estructurado.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>7. Contacto</Text>
        <Text style={styles.paragraph}>
          Para ejercer sus derechos ARCO o para cualquier consulta relacionada
          con esta Política de Privacidad, puede contactarnos a través de:
        </Text>
        {/* TODO: Actualizar el correo de contacto antes del lanzamiento oficial */}
        <Text style={styles.contactEmail}>privacidad@ngobeapp.pa</Text>
      </ScrollView>

      {/* Renderizar el botón solo cuando el usuario ha hecho scroll hasta el final */}
      {isScrolledToEnd && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={handleAccept}
            accessibilityRole="button"
            accessibilityLabel="Acepto la política de privacidad"
          >
            <Text style={styles.acceptButtonText}>Acepto</Text>
          </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl * 2, // Espacio extra para que el botón no tape el texto
  },
  title: {
    ...theme.typography.header,
    fontSize: 24,
    color: theme.colors.primary,
    marginBottom: theme.spacing.m,
  },
  date: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.l,
    fontStyle: "italic",
  },
  sectionTitle: {
    ...theme.typography.body,
    fontWeight: "bold",
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.l,
    marginBottom: theme.spacing.s,
  },
  paragraph: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 24,
    marginBottom: theme.spacing.s,
  },
  bulletList: {
    marginLeft: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  bullet: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 24,
    marginBottom: theme.spacing.xs,
  },
  contactEmail: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: "bold",
    marginTop: theme.spacing.s,
  },
  footer: {
    padding: theme.spacing.m,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  acceptButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: theme.borders.radius,
    alignItems: "center",
  },
  acceptButtonText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: "bold",
  },
});
