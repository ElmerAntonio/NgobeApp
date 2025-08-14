import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importa las pantallas que tienes en src/screens
import HomeScreen from './src/screens/HomeScreen';
// Cuando crees más pantallas, impórtalas aquí
// import OnboardingScreen from './src/screens/OnboardingScreen';
// import PracticeScreen from './src/screens/PracticeScreen';
// import ContributionScreen from './src/screens/ContributionScreen';
// import ModerationScreen from './src/screens/ModerationScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {/* Pantalla principal Home */}
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* Cuando crees más pantallas, agrégalas aquí */}
        {/* <Stack.Screen name="Onboarding" component={OnboardingScreen} /> */}
        {/* <Stack.Screen name="Practice" component={PracticeScreen} /> */}
        {/* <Stack.Screen name="Contribution" component={ContributionScreen} /> */}
        {/* <Stack.Screen name="Moderation" component={ModerationScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}