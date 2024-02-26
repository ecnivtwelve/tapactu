import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Alert, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { NativeList, NativeItem, NativeText } from '../components/NativeTableView';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Plus } from 'lucide-react-native';

function SourcesScreen({ navigation }) {
  const [sources, setSources] = useState([]);

  // plus button in the header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 16 }} onPress={() => navigation.navigate('AddSource')}>
          <Plus size={24} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

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
    Alert.alert(
      source,
      'Que voulez-vous faire ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Supprimer la source',
              'Voulez-vous vraiment supprimer cette source ?',
              [
                {
                  text: 'Annuler',
                  style: 'cancel',
                },
                {
                  text: 'Supprimer',
                  style: 'destructive',
                  onPress: () => {
                    let newSources = sources;
                    newSources.splice(index, 1);
                    AsyncStorage.setItem('sources', JSON.stringify(newSources)).then(() => {
                      fetchSources();
                    });
                  },
                },
              ],
              { cancelable: true }
            );
          },
        },
      ],
      { cancelable: true }
    );
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentInsetAdjustmentBehavior='automatic'
    >
      { sources.length > 0 && (
        <NativeList>
          {sources.map((source, index) => (
            <NativeItem
              key={index}
              leading={<Image source={{ uri: 'https://besticon-demo.herokuapp.com/icon?url=' +  source + '&size=48' }} style={{ width: 24, height: 24, borderRadius: 5 }} />}
              onPress={() => manageSource(source, index)}
            >
              <NativeText>{source}</NativeText>
            </NativeItem>
          ))}
        </NativeList>
      )}

      { sources.length === 0 && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 16 }}>
          <NativeText heading="p2">Aucune source</NativeText>
        </View>
      )}
    </ScrollView>
  );
}

export default SourcesScreen;