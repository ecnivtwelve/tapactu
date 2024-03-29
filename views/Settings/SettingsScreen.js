import * as React from 'react';
import { Alert, View, Text, ScrollView, Image, StatusBar, Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeItem, NativeList, NativeText } from '../../components/NativeTableView';
import { Settings, ChevronRight, CircleUserRound, Sparkle, Trash2 } from "lucide-react-native";
import packagejson from '../../package.json';

import AsyncStorage from '@react-native-async-storage/async-storage';

import t from '../../props/NativeLanguage';

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
            style={{ width: 80, height: 80, margin: 10, alignSelf: 'center', borderRadius: 18, borderCurve: 'continuous' }}
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
              {t('settings_change_name')}
            </NativeText>
            <NativeText heading="p2">
              {t('settings_change_name_desc')}
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
              {t('settings_restart_intro')}
            </NativeText>
            <NativeText heading="p2">
              {t('settings_restart_intro_desc')}
            </NativeText>
          </NativeItem>
        </NativeList>

        <NativeList inset>
          <NativeItem
            leading={<Trash2 size={24} color={colors.text}/>}
            onPress={() => {
              Alert.alert(
                t('settings_reset'),
                t('settings_reset_confirm'),
                [
                  {
                    text: t('global_cancel'),
                    style: "cancel"
                  },
                  { text: t('settings_reset_confirm_yes'), style: 'destructive', onPress: async () => {
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
              {t('settings_reset')}
            </NativeText>
            <NativeText heading="p2">
              {t('settings_reset_desc')}
            </NativeText>
          </NativeItem>
        </NativeList>

    </ScrollView>
            </>

  );
}

export default SettingsScreen;