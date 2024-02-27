import * as React from 'react';
import { Platform, StatusBar, Text, useColorScheme, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import UITheme from './props/NativeColors';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();

import t from './props/NativeLanguage';

import * as NavigationBar from 'expo-navigation-bar';

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
  headerBackTitleStyle: {
    fontFamily: 'MerriweatherSans-Regular',
    fontSize: 16,
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
          headerTitle: t('menu_home'),
          tabBarLabel: t('menu_home'),
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
          tabBarLabel: t('menu_sources'),
          tabBarIcon: ({ color }) => (
            <SwatchBook size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={require('./views/SearchScreen').default}
        options={{
          headerTitle: t('menu_search'),
          tabBarLabel: t('menu_search'),
          tabBarIcon: ({ color }) => (
            <Search size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Bookmarks"
        component={require('./views/BookmarksScreen').default}
        options={{
          headerTitle: t('menu_saved'),
          tabBarLabel: t('menu_saved'),
          tabBarIcon: ({ color }) => (
            <Bookmark size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

const SettingsNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        ...headerStyles
      }}
    >
      <Stack.Screen
        name='SettingsMenu'
        component={require('./views/Settings/SettingsScreen').default}
        options={{ headerTitle: t('menu_settings')}}
      />
      <Stack.Screen
        name='ChangeName'
        component={require('./views/Settings/ChangeNameScreen').default}
        options={{ headerTitle: t('menu_chg_name')}}
      />
    </Stack.Navigator>
  )
}

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
        name='Welcome'
        component={require('./views/Onboarding/Welcome').default}
        options={{ headerShown: false, gestureEnabled: false, animation: 'none', }}
      />
      <Stack.Screen
        name='SetName'
        component={require('./views/Onboarding/SetName').default}
        options={{
          headerShown: false,
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name='HelloScreen'
        component={require('./views/Onboarding/HelloScreen').default}
        options={{
          headerShown: false,
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name='Settings'
        component={SettingsNavigation}
        options={{ headerShown: false, presentation: 'modal' }}
      />
      <Stack.Screen
        name='Article'
        component={require('./views/DetailsScreen').default}
        options={{ headerTitle: t('menu_article') }}
      />
      <Stack.Screen
        name='AddSource'
        component={require('./views/AddSourceScreen').default}
        options={{
          headerTitle: t('menu_add_source'),
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name='ManageSource'
        component={require('./views/Source/ManageSource').default}
        options={{
          headerTitle: t('menu_manage_source'),
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  )
}

export default function App() {
  const scheme = useColorScheme();

  if (Platform.OS === 'android') {
    NavigationBar.setBackgroundColorAsync(UITheme(scheme).colors.card, true);
  }

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