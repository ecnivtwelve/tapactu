import * as React from 'react';
import { View, Text, ScrollView, StatusBar, Platform, Image, StyleSheet } from 'react-native';
import { NativeList, NativeText, NativeItem } from '../../components/NativeTableView';

import { Trash2 } from 'lucide-react-native';

import { useTheme } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import t from '../../props/NativeLanguage';

function ManageSourceScreen({ route, navigation }) {
  const { colors } = useTheme();
  const { source, index } = route.params;

  console.log(source);

  // change header title
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `${t('managesource_title')} - ${source.title.split(" - ")[0]}`,
    });
  }, [navigation, source]);

  const unsubscribe = () => {
    // remove source from AsyncStorage
    AsyncStorage.getItem('sources').then((data) => {
      if (data) {
        let sources = JSON.parse(data);
        sources.splice(index, 1);
        AsyncStorage.setItem('sources', JSON.stringify(sources)).then(() => {
          navigation.goBack();
        });
      }
    });
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentInsetAdjustmentBehavior='automatic'
    >
      { Platform.OS === 'ios' &&
        <StatusBar barStyle='light-content' />
      }

      <View style={styles.sourceHeader}>
        <Image
          source={{ uri: 'https://besticon-demo.herokuapp.com/icon?url=' +  source.links[0].url + '&size=96' }}
          style={styles.sourceImage}
        />
        <NativeText heading="h2" style={styles.sourceTitle}>
          {source.title.split(" - ")[0]}
        </NativeText>
        <NativeText heading="p2" style={styles.sourceUrl}>
          {source.rss}
        </NativeText>
      </View>

      { source.description &&
        <NativeList inset header={t('managesource_label_description')}>
          <NativeItem>
            <NativeText>
              {source.description}
            </NativeText>
          </NativeItem>
        </NativeList>
      }

      <NativeList inset header={t('managesource_label_actions')}>
        <NativeItem
          leading={<Trash2 size={24} color={'#FF3B30'} />}
          onPress={() => unsubscribe()}
        >
          <NativeText heading="h4">
            {t('managesource_action_remove')}
          </NativeText>
          <NativeText heading="p2">
            {t('managesource_action_remove_description')}
          </NativeText>
        </NativeItem>
      </NativeList>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sourceHeader: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',

    marginHorizontal: 16,
    marginVertical: 24,
    gap: 3,
  },
  sourceImage: {
    width: 48,
    height: 48,
    borderRadius: 5,
    marginBottom: 12,
  },
  sourceTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    textAlign: 'center',
  },  
  sourceUrl: {
    textAlign: 'center',
  },
});

export default ManageSourceScreen;