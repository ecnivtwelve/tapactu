import * as React from "react";
import { View, Text, ScrollView, TextInput } from "react-native";
import {
  NativeText,
  NativeItem,
  NativeList,
} from "../../components/NativeTableView";
import { Settings, ChevronRight, CircleUserRound } from "lucide-react-native";

function ChangeNameScreen({ navigation }) {
  const [name, setName] = React.useState("");

  const handleNameChange = () => {
    navigation.navigate("Settings");
  };
  return (
    <ScrollView style={{ flex: 1 }} contentInsetAdjustmentBehavior="automatic">
      <NativeList inset>
        <NativeItem>
          <TextInput
            style={{
              fontSize: 15,
              padding: 10,
              borderRadius: 5,
            }}
            placeholder="Votre nom"
            value={name}
            onChangeText={(text) => setName(text)}
          />
        </NativeItem>
        <NativeItem onPress={handleNameChange}>
          <NativeText
            heading="h4"
            style={{
              fontSize: 15,
              padding: 5,
              borderRadius: 5,
              alignSelf: "center",
            }}
          >
            Valider
          </NativeText>
        </NativeItem>
      </NativeList>
    </ScrollView>
  );
}

export default ChangeNameScreen;
