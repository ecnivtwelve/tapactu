import React, { useEffect, useState } from 'react';
import { View, ScrollView, Button, FlatList, RefreshControl, StyleSheet, Image, Pressable, Touchable, TouchableOpacity, ActivityIndicator } from 'react-native';
import {
  NativeList,
  NativeItem,
  NativeText,
} from "../components/NativeTableView";
import { GetHeadlines } from "../fetch/GetNews";
import { useTheme } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Settings } from "lucide-react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Newspaper, SwatchBook, Plus } from 'lucide-react-native';

function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");

  let [headlines, setHeadlines] = useState([]);
  let [refreshing, setRefreshing] = useState(false);
  let [loading, setLoading] = useState(false);

  let [date, setDate] = useState("");

  const getName = async () => {
    let name = await AsyncStorage.getItem("name");
    setName(name);
  };



  const TodayDate = () => {
    let date = new Date();
    let options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setDate(date.toLocaleDateString("fr-FR", options));
  };

  const [sources, setSources] = React.useState([]);

  const fetchHeadlines = async () => {
    setLoading(true);
    getName();
    AsyncStorage.getItem('sources').then((data) => {
      if (data) {
        let sources = JSON.parse(data);
        setSources(sources);
        GetHeadlines(sources, 5).then((data) => {
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
  }, []);

  // get sources on focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
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
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 10,
          },
        ]}
      >
        <View
          style={{ flexDirection: "column", justifyContent: "space-between" }}
        >
          <NativeText heading="h1">Bonjour, {name}</NativeText>
          <NativeText style={{ fontSize: 16, opacity: 0.6 }}>{date}</NativeText>
        </View>
        <TouchableOpacity
          style={{
            borderRadius: 500,
            borderWidth: 1,
            borderColor: colors.border,
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
      </View>

      <FlatList
        data={headlines}
        style={[styles.list]}
        renderItem={({ item }) => (
          <LargeNewsItem item={item} navigation={navigation} />
        )}
        ListFooterComponent={<View style={{height: 16}} />}
        ListEmptyComponent={<EmptyTapActu sources={sources} loading={loading} navigation={navigation} />}
        refreshing={refreshing}
        onRefresh={fetchHeadlines}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const EmptyTapActu = ({ sources, loading, navigation }) => {
  const {colors} = useTheme();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 16, gap: 4 }}>
        <ActivityIndicator />
        <NativeText heading="h2" style={{textAlign: 'center', marginTop: 8}}>
          Chargement en cours
        </NativeText>
        <NativeText heading="p2" style={{textAlign: 'center'}}>
          Obtention des dernières actualités...
        </NativeText>
      </View>
    );
  }

  if (sources.length <= 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 16, gap: 4 }}>
        <SwatchBook size={36} color={colors.text} />
        <NativeText heading="h2" style={{textAlign: 'center', marginTop: 8}}>
          Aucune source
        </NativeText>
        <NativeText heading="p2" style={{textAlign: 'center'}}>
          Commencez par ajouter une source pour obtenir des actualités.
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
            Ajouter une source
          </NativeText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 16, gap: 4 }}>
      <Newspaper size={36} color={colors.text} />
      <NativeText heading="h2" style={{textAlign: 'center', marginTop: 8}}>
        Aucune actualité
      </NativeText>
      <NativeText heading="p2" style={{textAlign: 'center'}}>
        Aucune actualité n'est disponible pour le moment.
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
              {item.source.title.split(' - ')[1] || 'Flux RSS'}
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
