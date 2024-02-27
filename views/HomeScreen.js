import React, { useEffect, useState } from 'react';
import { Animated, View, ScrollView, Button, FlatList, RefreshControl, StyleSheet, Image, Pressable, Touchable, TouchableOpacity, ActivityIndicator, StatusBar, VirtualizedList } from 'react-native';

import SkeletonLoading from 'react-native-skeleton-loading';

import {
  NativeList,
  NativeItem,
  NativeText,
} from "../components/NativeTableView";
import { GetHeadlines } from "../fetch/GetNews";

import { BlurView } from 'expo-blur';

import t, { getLocale } from '../props/NativeLanguage';

import moment from 'moment';
import 'moment/locale/fr';
import 'moment/locale/en-gb';

moment.locale(getLocale());

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const AnimatedVirtualizedList = Animated.createAnimatedComponent(VirtualizedList);

import { useTheme } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Settings } from "lucide-react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Newspaper, SwatchBook, Plus } from 'lucide-react-native';

function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const dark = useTheme().dark;
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");

  let [headlines, setHeadlines] = useState([]);
  let [refreshing, setRefreshing] = useState(false);
  let [loading, setLoading] = useState(false);

  let [date, setDate] = useState("");

  const flatListRef = React.useRef(null);

  const getName = async () => {
    let name = await AsyncStorage.getItem("name");
    setName(name);
  };

  let mainInsetAdd = 90;

  const scrollList = new Animated.Value(0);
  const scrollListRef = React.useRef(scrollList);
  const scrollSnap = React.useRef(new Animated.Value(0)).current;

  const [scrolled, setScrolled] = useState(false);

  // check if hasDoneBoarding is true
  React.useLayoutEffect(() => {
    AsyncStorage.getItem("hasDoneBoarding").then((data) => {
      if (!data) {
        navigation.navigate("Welcome");
      }
    });
  }, []);

  scrollList.addListener(({ value }) => {
    if (value > 1) {
      setScrolled(true);
    }
    else {
      setScrolled(false);
    }
  });

  React.useEffect(() => {
    Animated.spring(scrollSnap, {
      toValue: scrolled ? 1 : 0,
      tension: 35, // Control speed
      friction: 7, // Control bounciness
      useNativeDriver: false,
    }).start();
  }, [scrolled, scrollSnap]);

  const TodayDate = () => {
    let date = new Date();
    let options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setDate(date.toLocaleDateString(getLocale(), options));
  };

  const [sources, setSources] = React.useState([]);

  const fetchHeadlines = async () => {
    setLoading(true);
    AsyncStorage.getItem('sources').then((data) => {
      if (data) {
        let feeds = JSON.parse(data);
        let sources = [];

        feeds.forEach((feed) => {
          sources.push(feed.rss);
        });

        setSources(sources);

        GetHeadlines(sources, null).then((data) => {
          setHeadlines(data);
          setRefreshing(false);
          setLoading(false);
        });
      }
    });
  };

  useEffect(() => {
    fetchHeadlines();
    TodayDate();
    getName();
  }, []);

  // get sources on focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getName();
      TodayDate();

      if (sources.length == 0) {
        AsyncStorage.getItem('sources').then((data) => {
          if (data) {
            let sr = JSON.parse(data);
            if (sr.length !== sources.length) {
              setSources(sr);
              fetchHeadlines();
            }
          }
        });
      }
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={dark ? "light-content" : "dark-content"} backgroundColor={'#00000000'} translucent />
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 10,
            paddingBottom: 10,
            borderBottomColor: colors.border + '00',
            borderBottomWidth: 0.5,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
          }
        ]}
      >
        <Animated.View
          style={{
            flex: 1,
            height: scrollSnap.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          }}
        />
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.card + '88',
            borderBottomColor: colors.border,
            borderBottomWidth: scrollList.interpolate({
              inputRange: [0, 20, 500000000],
              outputRange: [0, 0.5, 0.5],
            }),
            opacity: scrollSnap.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          }}
        >
          <BlurView
            tint={dark ? "dark" : "light"}
            intensity={100}
            style={{
              flex: 1,
            }}
          />
        </Animated.View>
        <Pressable
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            flex: 1,
            gap: 15
          }}
          onPress={() => {
            flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
          }}
        >
          <View
            style={{ flexDirection: "column", justifyContent: "space-between", flex: 1, }}
          >
            <Animated.Text heading="h2" style={{
              fontSize: scrollSnap.interpolate({
                inputRange: [0, 1],
                outputRange: [21, 18],
              }),
              fontFamily: 'Merriweather-Bold',
              color: colors.text,
            }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {
                name ? `${t('homescreen_welcome')}, ${name} !` : `${t('homescreen_welcome')} !`
              }
            </Animated.Text>
            <Animated.Text style={{
              fontSize: 14.75,
              fontFamily: 'MerriweatherSans-Medium',
              opacity: 0.6,
              color: colors.text,
            }}>
              {date}
            </Animated.Text>
          </View>
          <TouchableOpacity
            style={{
              borderRadius: 500,
              borderWidth: 1,
              borderColor: colors.text + '33',
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              navigation.navigate("Settings");
            }}
          >
            <Settings size={24} color={colors.text} />
          </TouchableOpacity>
        </Pressable>
      </View>

      <AnimatedVirtualizedList
        data={headlines}
        getItem={(data, index) => data[index]}
        getItemCount={(data) => data.length}
        style={[styles.list, {
          paddingTop: insets.top + mainInsetAdd,
        }]}
        renderItem={({ item }) => (
          <LargeNewsItem item={item} navigation={navigation} />
        )}
        ListFooterComponent={<View style={{height: 50 + mainInsetAdd}} />}
        ListEmptyComponent={<EmptyTapActu sources={sources} loading={loading} navigation={navigation} />}
        refreshing={refreshing}
        onRefresh={fetchHeadlines}
        progressViewOffset={insets.top + mainInsetAdd}
        keyExtractor={(item) => item.id}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollList } } }],
          { useNativeDriver: false }
        )}
        scrollIndicatorInsets={{ top: mainInsetAdd - 20 }}
        ref={flatListRef}
      />
    </View>
  );
}

const EmptyTapActu = ({ sources, loading, navigation }) => {
  const {colors} = useTheme();

  if (sources.length <= 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 16, gap: 4 }}>
        <SwatchBook size={36} color={colors.text} />
        <NativeText heading="h2" style={{textAlign: 'center', marginTop: 8}}>
          {t('homescreen_no_sources')}
        </NativeText>
        <NativeText heading="p2" style={{textAlign: 'center'}}>
          {t('homescreen_no_sources_desc')}
        </NativeText>

        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: colors.primary,
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'center',
            paddingVertical: 10,
            gap: 9,
            borderRadius: 100,
            marginTop: 16,
          }}
          onPress={() => navigation.navigate('AddSource')}
        >
          <Plus size={24} color={colors.background} />
          <NativeText style={{ color: colors.background }}>
            {t('homescreen_no_sources_cta')}
          </NativeText>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View
        style={{
        }}
      >
        <SkeletonLoading
          background={colors.border}
          highlight={colors.card}
        >
          <View
            style={{
            }}
          >
            {[...Array(2)].map((_, i) => (
              <View
                key={i}
                style={[
                  LargeNewsStyles.container,
                  {
                    height: 343,
                    backgroundColor: colors.card,
                  },
                ]}
              />
            ))}
          </View>
        </SkeletonLoading>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 16, gap: 4 }}>
      <Newspaper size={36} color={colors.text} />
      <NativeText heading="h2" style={{textAlign: 'center', marginTop: 8}}>
        {t('homescreen_no_news')}
      </NativeText>
      <NativeText heading="p2" style={{textAlign: 'center'}}>
        {t('homescreen_no_news_desc')}
      </NativeText>
    </View>
  );
}

const LargeNewsItem = ({ item, navigation }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Article", {
          item: item,
        });
      }}
      style={[
        LargeNewsStyles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border + "99",
        },
      ]}
    >
      {item.enclosures.length > 0 && (
        <Image
          style={LargeNewsStyles.image}
          source={{ uri: item.enclosures[0].url }}
        />
      )}
      <View style={LargeNewsStyles.textContainer}>
        <View style={[LargeNewsStyles.media]}>
          <Image
            source={{
              uri:
                "https://besticon-demo.herokuapp.com/icon?url=" +
                item.source.links[0].url +
                "&size=48",
            }}
            style={[LargeNewsStyles.icon]}
          />
          <View style={[LargeNewsStyles.sourceContainer]}>
            <NativeText
              style={[LargeNewsStyles.source]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.source.title.split(" - ")[0]}
            </NativeText>
            <NativeText style={[LargeNewsStyles.detail]} numberOfLines={1} ellipsizeMode='tail'>
              {moment(item.published).fromNow()}
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
};

const LargeNewsStyles = StyleSheet.create({
  container: {
    flexDirection: "column",
    borderRadius: 10,
    borderCurve: "continuous",
    borderWidth: 0.5,
    shadowColor: "#000000",
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
    width: "100%",
    flex: 1,
    flexDirection: "row",
    gap: 9,
    alignItems: "center",
  },
  icon: {
    width: 26,
    height: 26,
    borderRadius: 5,
  },
  sourceContainer: {
    flex: 1,
    flexDirection: "column",
    gap: 0,
  },
  source: {
    flex: 1,
    fontSize: 15,
    fontFamily: "MerriweatherSans-Medium",
  },
  detail: {
    fontSize: 14,
    fontFamily: "MerriweatherSans-Medium",
    opacity: 0.6,
  },

  title: {
    fontSize: 18,
    fontFamily: "Merriweather-Bold",
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
    paddingTop: 6,
  },
  header: {
    padding: 16,
    paddingBottom: 10,
  },
});

export default HomeScreen;
