import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import AddEditBookScreen from '../screens/AddEditBookScreen';
import BookDetailScreen from '../screens/BookDetailScreen';

const Stack = createNativeStackNavigator();

/**
 * AppNavigator manages all app routes.
 *
 * Props:
 *  - session {object|null}  Supabase session. When null the Auth stack is shown,
 *                           otherwise the App stack is shown.
 */
export default function AppNavigator({ session }) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#4a90d9' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {session ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'Mis Libros' }}
            />
            <Stack.Screen
              name="AddEditBook"
              component={AddEditBookScreen}
              options={({ route }) => ({
                title: route.params?.book ? 'Editar libro' : 'Agregar libro',
              })}
            />
            <Stack.Screen
              name="BookDetail"
              component={BookDetailScreen}
              options={{ title: 'Detalle del libro' }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
