import * as React from 'react';
import { Alert, View, Text, ScrollView, Image, StatusBar, Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeItem, NativeList, NativeText } from '../../components/NativeTableView';
import { Settings, ChevronRight, CircleUserRound, Sparkle, Trash2 } from "lucide-react-native";
import packagejson from '../../package.json';

import AsyncStorage from '@react-native-async-storage/async-storage';

function SettingsScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const { version } = packagejson;


  return (
    <>
    <ScrollView
      style={{ flex: 1 }}
      contentInsetAdjustmentBehavior='automatic'
    >
      { Platform.OS === 'ios' && <StatusBar animated barStyle="light-content" /> }

        <View style={{
            marginTop: insets.top - 30,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
        }}>
            <Image source={require('../../assets/icon.png')}
            style={{ width: 150, height: 150, margin: 10, alignSelf: 'center', borderRadius: 500, }}
            />
            <NativeText heading="h1">Tapactu</NativeText>
            <NativeText style={{ fontSize: 16, opacity: 0.6 }}>{version}</NativeText>


        </View>

        <NativeList inset>
          <NativeItem
            leading={<CircleUserRound size={24} color={colors.text}/>}
            trailing={<ChevronRight size={24} color={colors.text} style={{marginRight: -10, opacity: 0.7}}/>}
            onPress={() => {
              navigation.navigate("ChangeName");
            }}
          >
            <NativeText heading="h4">
              Changer de nom
              </NativeText>
            <NativeText heading="p2">
              Modifier votre nom d'utilisateur
            </NativeText>
          </NativeItem>
          <NativeItem
            leading={<Sparkle size={24} color={colors.text}/>}
            trailing={<ChevronRight size={24} color={colors.text} style={{marginRight: -10, opacity: 0.7}}/>}
            onPress={() => {
              navigation.goBack();
              navigation.navigate("Welcome");
            }}
          >
            <NativeText heading="h4">
              Recommencer l'introduction
              </NativeText>
            <NativeText heading="p2">
              Relance l'introduction de l'app sans perdre vos données
            </NativeText>
          </NativeItem>
        </NativeList>

        <NativeList inset>
          <NativeItem
            leading={<Trash2 size={24} color={colors.text}/>}
            onPress={() => {
              Alert.alert(
                "Réinitialiser l'application",
                "Êtes-vous sûr de vouloir réinitialiser l'application ? Cette action est irréversible.",
                [
                  {
                    text: "Annuler",
                    style: "cancel"
                  },
                  { text: "Oui, réinitialiser", style: 'destructive', onPress: async () => {
                    try {
                      await AsyncStorage.clear();
                      navigation.goBack();
                      navigation.navigate("Welcome");
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                ]
              );
            }}
          >
            <NativeText heading="h4">
              Réinitialiser l'application
            </NativeText>
            <NativeText heading="p2">
              Efface toutes vos données et réinitialise l'application
            </NativeText>
          </NativeItem>
        </NativeList>

    </ScrollView>
    <View style={{ 
        position: "absolute",
        bottom: insets.bottom + 15,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    
    }}>
      
      <NativeText heading="subtitle2" 
        style={{ 
            color: colors.text,
            }}>
                © 2024 Tapactu | Made by Trycent Technologies
            </NativeText>
            </View>
            </>

  );
}

export default SettingsScreen;