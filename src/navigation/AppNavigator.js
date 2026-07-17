// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from '../screens/LoginScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ContributeScreen from '../screens/ContributeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MyContributionsScreen from '../screens/MyContributionsScreen';
import ApproveContributionsScreen from '../screens/ApproveContributionsScreen';
import ApproveUsersScreen from '../screens/ApproveUsersScreen';

import { theme } from '../utils/theme';
import { useAuth } from '../context/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICONS = {
  Inicio: { active: 'home', inactive: 'home-outline' },
  Aportar: { active: 'add-circle', inactive: 'add-circle-outline' },
  Explorar: { active: 'search', inactive: 'search-outline' },
  Perfil: { active: 'person', inactive: 'person-outline' },
};

// Módulo principal con tabs
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.active : icons.inactive;
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Inicio" component={DashboardScreen} />
      <Tab.Screen name="Aportar" component={ContributeScreen} />
      <Tab.Screen name="Explorar" component={ExploreScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Navegador raíz: login y experiencia principal.
export default function AppNavigator() {
  const { session, loading } = useAuth();

  // Mostrar un indicador de carga mientras se verifica el estado de autenticación
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Renderizado condicional basado en si hay una sesión activa */}
        {session ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="MyContributions" component={MyContributionsScreen} />
            <Stack.Screen name="ApproveContributions" component={ApproveContributionsScreen} />
            <Stack.Screen name="ApproveUsers" component={ApproveUsersScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen
              name="PrivacyPolicy"
              component={PrivacyPolicyScreen}
              options={{
                presentation: 'modal',
                headerShown: true,
                title: 'Política de Privacidad',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
