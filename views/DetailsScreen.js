import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Button, StatusBar, TouchableOpacity, Image } from 'react-native';
import { NativeText } from '../components/NativeTableView';

import { useTheme } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';

import { ExternalLink } from 'lucide-react-native';

function DetailsScreen({ route, navigation }) {
  const { item } = route.params;

  console.log(item);

  const dark = useTheme().dark;
  const { colors } = useTheme();

  const [browserOpen, setBrowserOpen] = useState(false);

  const openURL = (url) => {
    setBrowserOpen(true);
    WebBrowser.openBrowserAsync(url, {
      dismissButtonStyle: 'close',
      presentationStyle: 'overCurrentContext',
      controlsColor: colors.primary,
    }).then(() => {
      setBrowserOpen(false);
    });
  }

  // change the title of the screen
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: item.title,
    });
  }, [navigation]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.card }}
      contentInsetAdjustmentBehavior='automatic'
    >
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />

      { item.enclosures.length > 0 && (
        <Image
          source={{ uri: item.enclosures[0].url }}
          style={{ width: '100%', height: 200 }}
          sharedTransitionTag="article-image"
        />
      )}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          margin: 16,
          gap: 10,
        }}
      >
        <Image
          source={{ uri: 'https://besticon-demo.herokuapp.com/icon?url=' + item.source.links[0].url + '&size=48' }}
          style={{ width: 24, height: 24, borderRadius: 5 }}
        />

        <NativeText style={{ fontSize: 16, opacity: 0.6 }}>
          {item.source.title.split(' - ')[0]}
        </NativeText>
      </View>

      <NativeText style={[styles.title]}>
        {item.title.trim()}
      </NativeText>

      <NativeText style={[styles.description]}>
        {item.description.trim()}
      </NativeText>

      <TouchableOpacity
        onPress={() => openURL(item.links[0].url)}
        style={[styles.button, { backgroundColor: colors.text }]}
      >
        <ExternalLink size={24} strokeWidth={2.2} color={colors.background} />
        <NativeText style={[styles.buttonText, { color: colors.background }]} numberOfLines={1} ellipsizeMode='tail'>
          Lire sur {item.source.links[0].url.split('/')[2].split('/')[0].split('www.')[1]}
        </NativeText>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 16,
    padding: 11,
    borderRadius: 50,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontSize: 16,
  },

  title: {
    fontSize: 21,
    lineHeight: 27,
    fontFamily: 'Merriweather-Bold',
    marginHorizontal: 16,
    marginBottom: 16,
  },

  description: {
    fontSize: 16,
    lineHeight: 20,
    marginHorizontal: 16,
    opacity: 0.6,
  },
});

export default DetailsScreen;