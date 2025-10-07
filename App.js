import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importación de pantallas principales del proyecto
import HomeScreen from './src/screens/HomeScreen'; // Pantalla de inicio (Fase 2)
import OnboardingScreen from './src/screens/OnboardingScreen'; // Consentimiento y perfil
import ContributionScreen from './src/screens/ContributionScreen'; // Subida de datos
import ModerationScreen from './src/screens/ModerationScreen'; // Moderación de datos

// Creación del stack de navegación
const Stack = createStackNavigator();

// Componente principal de la aplicación: define la navegación entre pantallas
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding">
        {/* Pantalla de Onboarding: consentimiento y perfil del usuario */}
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        {/* Pantalla de Contribución: subir audios, textos y traducciones */}
        <Stack.Screen name="Contribution" component={ContributionScreen} />
        {/* Pantalla de Moderación: revisión y aprobación de datos */}
        <Stack.Screen name="Moderation" component={ModerationScreen} />
        {/* Pantalla Home: lista de lecciones y progreso (Fase 2) */}
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}