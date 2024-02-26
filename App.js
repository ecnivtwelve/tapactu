import * as React from 'react';
import { StatusBar, Text, useColorScheme } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import UITheme from './props/NativeColors';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={require('./views/HomeScreen').default} />
      <Stack.Screen name="Details" component={require('./views/DetailsScreen').default} />
    </Stack.Navigator>
  )
}

export default function App() {
  const scheme = useColorScheme();

  return (
    <NavigationContainer theme={UITheme(scheme)}>
      <StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} />
      <Navigation />
    </NavigationContainer>
  );
}