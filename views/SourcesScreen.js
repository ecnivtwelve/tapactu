import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Alert, Platform, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { NativeList, NativeItem, NativeText } from '../components/NativeTableView';

import AsyncStorage from '@react-native-async-storage/async-storage';

import t from '../props/NativeLanguage';

import { Plus } from 'lucide-react-native';

import { useTheme } from '@react-navigation/native';

function SourcesScreen({ navigation }) {
  const [sources, setSources] = useState([]);
  const { colors } = useTheme();

  // plus button in the header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 16 }} onPress={() => navigation.navigate('AddSource')}>
          <Plus size={24} color={colors.text} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, colors]);

  const fetchSources = async () => {
    // fetch sources
    AsyncStorage.getItem('sources').then((data) => {
      if (data) {
        setSources(JSON.parse(data));
      }
    });
  }

  useEffect(() => {
    fetchSources();
  }, []);

  // fetch sources on focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchSources();
    });

    return unsubscribe;
  }, [navigation]);

  const manageSource = (source, index) => {
    navigation.navigate('ManageSource', { source, index });
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentInsetAdjustmentBehavior='automatic'
    >
      { sources.length > 0 && (
        <NativeList
          style={[
            Platform.OS === 'ios' && {
              marginTop: -16,
            }
          ]}
        >
          {sources.map((source, index) => (
            <NativeItem
              key={index}
              leading={ source.links[0].url &&
                <Image source={{ uri: 'https://besticon-demo.herokuapp.com/icon?url=' +  source.links[0].url + '&size=48' }} style={{ width: 24, height: 24, borderRadius: 5 }} />
              }
              onPress={() => manageSource(source, index)}
            >
              <NativeText heading="h4">
                {source.title}
              </NativeText>
              <NativeText heading="p2">
                {source.rss ? source.rss : source.links[0].url}
              </NativeText>
            </NativeItem>
          ))}
        </NativeList>
      )}

      { sources.length === 0 && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 16 }}>
          <NativeText heading="p2">
            {t('sources_no_sources')}
          </NativeText>
        </View>
      )}
    </ScrollView>
  );
}

export default SourcesScreen;