import * as React from 'react';
import { Alert, View, Text, ScrollView, Platform, StatusBar, Image, TextInput, ActivityIndicator } from 'react-native';
import { NativeList, NativeItem, NativeText } from '../components/NativeTableView';

import { Search } from 'lucide-react-native';

import PopularFeeds from '../data/PopularFeeds.json';

import { useTheme } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

function AddSourceScreen({ navigation }) {
  const {colors} = useTheme();

  const [feedsList, setFeedsList] = React.useState([]);

  const [isURL, setIsURL] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setFeedsList(PopularFeeds);
  }, []);

  // add loading indicator in header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        loading && <ActivityIndicator />
      ),
    });
  }, [navigation, loading]);

  const searchFeeds = (text) => {
    setSearchTerm(text);

    if (text.length > 0) {
      let results = PopularFeeds.filter((feed) => {
        return feed.title.toLowerCase().includes(text.toLowerCase());
      });

      setFeedsList(results);
    } else {
      setFeedsList(PopularFeeds);
    }

    if (text.includes('http://') || text.includes('https://')) {
      setIsURL(true);
    }
  }

  const addFeed = (url) => {
    setLoading(true);
    // check if feed is available
    fetch(url, {
      method: 'GET',
    }).then((response) => {
      setLoading(false);
      if (response.status === 200) {
        // add feed to AsyncStorage
        AsyncStorage.getItem('sources').then((data) => {
          let sources = [];
          if (data) {
            sources = JSON.parse(data);
          }

          // check if feed is already in the list
          if (sources.includes(url)) {
            Alert.alert('Flux déjà ajouté', 'Ce flux est déjà dans votre liste');
            return;
          }

          sources.push(url);
          AsyncStorage.setItem('sources', JSON.stringify(sources));
          navigation.goBack();
        });
      } else {
        Alert.alert('Flux non disponible', 'Le flux n\'est pas disponible');
      }
    }).catch((error) => {
      Alert.alert('Flux non disponible', 'Le flux n\'est pas disponible');
    });
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentInsetAdjustmentBehavior='automatic'
    >
      { Platform.OS === 'ios' && <StatusBar animated barStyle='light-content' /> }
      
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: colors.text + '12',
          margin: 16,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 10,
        }}
      >
        <Search size={24} color={colors.text + '80'} />
        <TextInput
          placeholder='Rechercher ou insérer une URL'
          placeholderTextColor={colors.text + '80'}
          style={{
            fontFamily: 'MerriweatherSans-Regular',
            fontSize: 16,
            color: colors.text,
            flex: 1,
            marginLeft: 12,
          }}
          onChangeText={(text) => searchFeeds(text)}
        />
      </View>

      { isURL && searchTerm.length > 0 && (
        <NativeList inset>
          <NativeItem
            onPress={() => addFeed(searchTerm)}
            leading={
              <Image  
                source={{ uri: 'https://besticon-demo.herokuapp.com/icon?url=' + searchTerm + '&size=48' }}
                style={{ width: 24, height: 24, borderRadius: 5 }}
              />
            }
          >
            <NativeText heading="h4">
              Utiliser cette URL
            </NativeText>
            <NativeText heading="p2">
              {searchTerm}
            </NativeText>
          </NativeItem>
        </NativeList>
      )}

      { feedsList.length > 0 && (
      <NativeList inset header='Flux populaires'>
        {feedsList.map((feed, index) => (
          <NativeItem
            key={index}
            onPress={() => addFeed(feed.url)}
            leading={
              <Image  
                source={{ uri: 'https://besticon-demo.herokuapp.com/icon?url=' + feed.url + '&size=48' }}
                style={{ width: 24, height: 24, borderRadius: 5 }}
              />
            }
          >
            <NativeText heading="h4">
              {feed.title}
            </NativeText>
            <NativeText heading="p2">
              {feed.url}
            </NativeText>
          </NativeItem>
        ))}
      </NativeList>
      )}
    </ScrollView>
  );
}

export default AddSourceScreen;