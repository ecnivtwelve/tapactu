import * as React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeItem, NativeList, NativeText } from '../../components/NativeTableView';
import { Settings, ChevronRight, CircleUserRound } from "lucide-react-native";
import packagejson from '../../package.json';

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
          trailing={<ChevronRight size={24} color={colors.text}/>}
          onPress={() => {
            navigation.navigate("ChangeName");
          }}
        >
          <NativeText heading="h4">Changer de nom</NativeText>
          <NativeText heading="p" style={{ opacity: 0.6, fontSize: 15 }}>
            Modifier votre nom d'utilisateur
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