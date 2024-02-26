import React, { useEffect, useState } from 'react';
import { View, ScrollView, Button, FlatList, RefreshControl, StyleSheet, Image, Pressable, Touchable, TouchableOpacity } from 'react-native';

import { NativeList, NativeItem, NativeText } from '../components/NativeTableView';

import { GetHeadlines } from '../fetch/GetNews';

import { useTheme } from '@react-navigation/native';

function HomeScreen({ navigation }) {
  let [headlines, setHeadlines] = useState([]);
  let [refreshing, setRefreshing] = useState(false);

  const fetchHeadlines = async () => {
    let sources = [
      {
        title: 'France 24',
        feeds: [
          'https://www.france24.com/fr/rss',
        ]
      },
      {
        title: 'Franceinfo',
        feeds: [
          'https://www.francetvinfo.fr/titres.rss',
        ]
      },
      {
        title: 'Ouest-France',
        feeds: [
          'https://www.ouest-france.fr/rss/une',
        ]
      }
    ]

    GetHeadlines(sources, 5).then((data) => {
      setHeadlines(data);
      setRefreshing(false);
    });
  }

  useEffect(() => {
    fetchHeadlines();
  }, []);

  return (
    <FlatList
      data={headlines}
      style={[styles.list]}
      renderItem={({ item }) => (
        <LargeNewsItem item={item} navigation={navigation} />
      )}
      ListFooterComponent={<View style={{height: 16}} />}
      refreshing={refreshing}
      onRefresh={fetchHeadlines}
      keyExtractor={item => item.id}
    />
  );
}

const LargeNewsItem = ({ item, navigation }) => {
  const {colors} = useTheme();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Article', {
          item: item,
        });
      }}
      style={[LargeNewsStyles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border + '99',
        }
      ]}
    >
      { item.enclosures.length > 0 &&
        <Image
          style={LargeNewsStyles.image}
          source={{ uri: item.enclosures[0].url }}
        />
      }
      <View style={LargeNewsStyles.textContainer}>
        <View style={[LargeNewsStyles.media]}>
          <Image
            source={{ uri: 'https://besticon-demo.herokuapp.com/icon?url=' + item.source.links[0].url + '&size=48' }}
            style={[LargeNewsStyles.icon]}
          />
          <View style={[LargeNewsStyles.sourceContainer]}>
            <NativeText style={[LargeNewsStyles.source]} numberOfLines={1} ellipsizeMode='tail'>
              {item.source.title.split(' - ')[0]}
            </NativeText>
            <NativeText style={[LargeNewsStyles.detail]} numberOfLines={1} ellipsizeMode='tail'>
              {item.source.title.split(' - ')[1]}
            </NativeText>
          </View>
        </View>

        <NativeText style={[LargeNewsStyles.title]} numberOfLines={3}>
          {item.title.trim()}
        </NativeText>
        <NativeText style={[LargeNewsStyles.description]} numberOfLines={4}>
          {item.description.trim()}
        </NativeText>
      </View>
    </TouchableOpacity>
  );
}

const LargeNewsStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    borderRadius: 10,
    borderCurve: 'continuous',
    borderWidth: 0.5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    marginBottom: 16,
  },
  textContainer: {
    padding: 16,
    gap: 9,
  },
  media: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    gap: 9,
    alignItems: 'center',
  },
  icon: {
    width: 26,
    height: 26,
    borderRadius: 5,
  },
  sourceContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 0,
  },
  source: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'MerriweatherSans-Medium',
  },
  detail: {
    fontSize: 14,
    fontFamily: 'MerriweatherSans-Medium',
    opacity: 0.6,
  },

  title: {
    fontSize: 18,
    fontFamily: 'Merriweather-Bold',
  },
  description: {
    fontSize: 15,
    opacity: 0.6,
  },
  image: {
    flex: 1,
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
});

export default HomeScreen;