import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Button, StatusBar, TouchableOpacity, Image } from 'react-native';
import { NativeText } from '../components/NativeTableView';

import { useTheme } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';

import { ExternalLink, Bookmark, Check } from 'lucide-react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import t from '../props/NativeLanguage';

function DetailsScreen({ route, navigation }) {
  const { item } = route.params;

  const dark = useTheme().dark;
  const { colors } = useTheme();

  const [browserOpen, setBrowserOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveArticle = async () => {
    if (saved) {
      try {
        const value = await AsyncStorage.getItem('bookmarks');
        if (value !== null) {
          const bookmarks = JSON.parse(value);
          const newBookmarks = bookmarks.filter((element) => element.title !== item.title);
          await AsyncStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
          setSaved(false);
        }
      }
      catch (e) {
        console.error(e);
      }
      return;
    }

    try {
      const value = await AsyncStorage.getItem('bookmarks');
      if (value !== null) {
        const bookmarks = JSON.parse(value);
        bookmarks.push(item);
        await AsyncStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      } else {
        await AsyncStorage.setItem('bookmarks', JSON.stringify([item]));
      }

      setSaved(true);
    } catch (e) {
      console.error(e);
    }
  }

  // check if the article is already saved
  useEffect(() => {
    const checkSaved = async () => {
      try {
        const value = await AsyncStorage.getItem('bookmarks');
        if (value !== null) {
          const bookmarks = JSON.parse(value);
          const found = bookmarks.find((element) => element.title === item.title);
          if (found) {
            setSaved(true);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    checkSaved();
  }, []);

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
          {t('details_read_on')} {item.source.links[0].url.split('/')[2].split('/')[0].split('www.')[1]}
        </NativeText>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => saveArticle()}
        style={[styles.button, styles.buttonAlt, { borderColor: saved ? colors.text + '77' : colors.text, borderWidth: 1, opacity: saved ? 0.5 : 1}]}
      >
        {saved ? (
          <Check size={24} strokeWidth={2.2} color={colors.text} />
        ) : (
          <Bookmark size={24} strokeWidth={2.2} color={colors.text} />
        )}

        <NativeText style={[styles.buttonText, { color: colors.text }]} numberOfLines={1} ellipsizeMode='tail'>
          {saved ? t('details_saved') : t('global_save')}
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
    fontSize: 15,
  },

  buttonAlt: {
    marginTop: -6,
  },

  title: {
    fontSize: 20,
    lineHeight: 27,
    fontFamily: 'Merriweather-Bold',
    marginHorizontal: 16,
    marginBottom: 16,
  },

  description: {
    fontSize: 15,
    lineHeight: 20,
    marginHorizontal: 16,
    opacity: 0.6,
  },
});

export default DetailsScreen;