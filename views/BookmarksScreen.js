import React, {useState, useEffect, useLayoutEffect} from 'react';
import { View, Text, ScrollView, Image, Platform } from 'react-native';
import { NativeList, NativeItem, NativeText } from '../components/NativeTableView';

import AsyncStorage from '@react-native-async-storage/async-storage';

import t from '../props/NativeLanguage';

import { useTheme } from '@react-navigation/native';

function BookmarkScreen({ navigation }) {
  const { colors } = useTheme();
  const [bookmarks, setBookmarks] = React.useState([]);
  const [originalBookmarks, setOriginalBookmarks] = React.useState([]);

  React.useEffect(() => {
    const getBookmarks = async () => {
      try {
        const value = await AsyncStorage.getItem('bookmarks');
        if (value !== null) {
          // reverse the array to show the latest first
          let res = JSON.parse(value)

          setBookmarks([...res].reverse());
          setOriginalBookmarks([...res].reverse());
        }
      } catch (e) {
        console.error(e);
      }
    }

    getBookmarks();

    // on focus, refresh the bookmarks
    navigation.addListener('focus', () => {
      getBookmarks();
    });
  }, []);

  // add search functionality to header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: t('saved_search'),
        cancelButtonText: t('global_cancel'),
        hideWhenScrolling: false,
        onChangeText: (event) => {
          const text = event.nativeEvent.text;

          if (text === '') {
            setBookmarks(originalBookmarks);
            return;
          }

          const results = originalBookmarks.filter((item) => {
            return item.title.toLowerCase().includes(text.toLowerCase()) || item.description.toLowerCase().includes(text.toLowerCase());
          });

          setBookmarks(results);
        },
      },
    });
  }, [navigation, originalBookmarks]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.card }}
      contentInsetAdjustmentBehavior='automatic'
    >
      { bookmarks.length === 0 && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 16 }}>
          <NativeText heading="p2">
            {t('saved_no_saved')}
          </NativeText>
        </View>
      )}

      { bookmarks.length > 0 &&
        <NativeList
          style={[
            Platform.OS === 'ios' && {
              marginTop: -16,
            }
          ]}
        >
          {bookmarks.map((item, index) => {
            return (
              <NativeItem
                key={index}
                onPress={() => {
                  navigation.navigate('ArticleInset', { item: item });
                }}
                leading={item.enclosures.length > 0 && item.enclosures[0].url &&
                  <Image
                    source={{ uri: item.enclosures[0].url }}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 8,
                    }}
                  />
                }
              >
                <NativeText
                  heading="h4"
                  numberOfLines={2}
                >
                  {item.title.trim()}
                </NativeText>
                <NativeText
                  heading="p2"
                  numberOfLines={2}
                >
                  {item.description.trim()}
                </NativeText>
              </NativeItem>
            );
          })}
        </NativeList>
      }
    </ScrollView>
  );
}

export default BookmarkScreen;