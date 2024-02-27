import * as React from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity } from "react-native";
import {
  NativeText,
  NativeItem,
  NativeList,
} from "../../components/NativeTableView";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";

import { User2, Check } from "lucide-react-native";

function ChangeNameScreen({ navigation }) {
  const { colors } = useTheme();
  const [name, setName] = React.useState("");

  const handleNameChange = async () => {
    await AsyncStorage.setItem("name", name);
    console.log("Name changed to", name);
    navigation.goBack();
  };

  React.useEffect(() => {
    AsyncStorage.getItem("name").then((data) => {
      setName(data);
    });
  }, []);
  return (
    <ScrollView style={{ flex: 1 }} contentInsetAdjustmentBehavior="automatic">
      <View
        style={{
          margin: 16,
          paddingHorizontal: 18,
          flexDirection: "row",
          justifyContent: "flexStart",
          alignItems: "center",
          gap: 14,
          borderRadius: 300,
          backgroundColor: colors.card,
        }}
      >
        <User2 size={22} strokeWidth={2.3} color={colors.text} />
        <TextInput
          style={{
            fontSize: 15,
            color: colors.text,
            fontFamily: "MerriweatherSans-Regular",
            paddingVertical: 13,
            flex: 1,
          }}
          placeholder="Votre nom"
          value={name}
          onChangeText={(text) => setName(text)}
        />
      </View>

      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 10,
          gap: 9,
          backgroundColor: colors.text,
          borderRadius: 300,
          marginTop: 0,
          marginBottom: 16,
          marginHorizontal: 16,
        }}
        onPress={() => handleNameChange()}
      >
        <Text
          style={{
            fontSize: 16,
            color: colors.background,
            fontFamily: 'MerriweatherSans-Medium',
          }}
        >
          Confirmer
        </Text>
        <Check size={24} color={colors.background} />
      </TouchableOpacity>
    </ScrollView>
  );
}

export default ChangeNameScreen;
