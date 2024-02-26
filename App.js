import * as React from 'react';
import { StatusBar, Text, useColorScheme, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import UITheme from './props/NativeColors';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();

import { Newspaper, SwatchBook, Search, Bookmark } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

const headerStyles = {
  headerTitleStyle: {
    fontFamily: 'MerriweatherSans-Semibold',
    fontSize: 16,
  },
  headerLargeTitleStyle: {
    fontFamily: 'Merriweather-Bold',
  },
};

function TabNavigation() {
  const scheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        ...headerStyles,
        tabBarStyle: {
          height: 50 + insets.bottom,
          paddingTop: 2,
          borderTopColor: UITheme(scheme).colors.border,
          borderTopWidth: 0.5,
          paddingHorizontal: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'MerriweatherSans-Medium',
          fontSize: 13,
          marginTop: 0,
        },
        tabBarActiveTintColor: UITheme(scheme).colors.text,
        tabBarInactiveTintColor: UITheme(scheme).colors.inactiveText,
      }}
    >
      <Tab.Screen
        name="Home"
        component={require('./views/HomeScreen').default}
        options={{
          headerTitle: 'À la une',
          tabBarLabel: 'À la une',
          tabBarIcon: ({ color }) => (
            <Newspaper size={24} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Sources"
        component={require('./views/SourcesScreen').default}
        options={{
          tabBarLabel: 'Sources',
          tabBarIcon: ({ color }) => (
            <SwatchBook size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={require('./views/SearchScreen').default}
        options={{
          headerTitle: 'Recherche',
          tabBarLabel: 'Recherche',
          tabBarIcon: ({ color }) => (
            <Search size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Bookmarks"
        component={require('./views/BookmarksScreen').default}
        options={{
          headerTitle: 'Enregistrés',
          tabBarLabel: 'Enregistrés',
          tabBarIcon: ({ color }) => (
            <Bookmark size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        ...headerStyles
      }}
    >
      <Stack.Screen
        name="Main"
        component={TabNavigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Article'
        component={require('./views/DetailsScreen').default}
        options={{ headerTitle: 'Article' }}
      />
    </Stack.Navigator>
  )
}

export default function App() {
  const scheme = useColorScheme();

  const [fontsLoaded, fontError] = useFonts({
    'Merriweather-Light': require('./assets/fonts/Merriweather-Light.ttf'),
    'Merriweather-Regular': require('./assets/fonts/Merriweather-Regular.ttf'),
    'Merriweather-Bold': require('./assets/fonts/Merriweather-Bold.ttf'),
    'MerriweatherSans-Light': require('./assets/fonts/MerriweatherSans-Light.ttf'),
    'MerriweatherSans-Regular': require('./assets/fonts/MerriweatherSans-Regular.ttf'),
    'MerriweatherSans-Medium': require('./assets/fonts/MerriweatherSans-Medium.ttf'),
    'MerriweatherSans-Semibold': require('./assets/fonts/MerriweatherSans-SemiBold.ttf'),
    'MerriweatherSans-Bold': require('./assets/fonts/MerriweatherSans-Bold.ttf'),
  });

  const onLayoutRootView = React.useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if(fontError) {
    console.log('Font Error', fontError);
  }

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={{flex: 1}} onLayout={onLayoutRootView}>
      <NavigationContainer theme={UITheme(scheme)}>
        <StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} />
        <Navigation />
      </NavigationContainer>
    </View>
  );
}