import * as React from 'react';
import { Alert, Animated, Easing, View, KeyboardAvoidingView, Text, TextInput, TouchableOpacity } from 'react-native';
import { NativeText } from '../../components/NativeTableView';

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArrowRight, Check } from 'lucide-react-native';

function SetNameScreen({ navigation }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const blockAnim = new Animated.Value(0);

  const [name, setName] = React.useState('');

  // animate blockanim to 1 on focus
  React.useEffect(() => {
    navigation.addListener('focus', () => {
      blockAnim.setValue(0);
      Animated.parallel([
        Animated.timing(blockAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.bezier(1, 0, 0.5, 1)),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
      });
    });

    return () => {
      navigation.removeListener('focus');
    }
  }, []);

  function nextStep() {
      if (name.trim().length < 1) {
        Alert.alert('Erreur', 'Veuillez entrer votre prénom.');

        return;
      }

      AsyncStorage.setItem("name", name);

      blockAnim.setValue(1);
      Animated.parallel([
        Animated.timing(blockAnim, {
          toValue: 2,
          duration: 500,
          easing: Easing.in(Easing.bezier(1, 0, 1, 1)),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          navigation.navigate('HelloScreen', {
            name: name,
          });
        }
      });
  }

  // set header visible
  React.useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: ' ',
      headerBackTitle: 'Retour',
      headerTransparent: true,
      headerTintColor: 'black',
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#f7e4ba",
      }}
      contentInsetAdjustmentBehavior='automatic'
    >
      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        contentInsetAdjustmentBehavior='automatic'
        behavior={'height'}
        keyboardVerticalOffset={0-insets.bottom}
      >
        <Animated.View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            gap: 10,

            position: 'absolute',
            bottom: insets.bottom + 20,

            opacity: blockAnim.interpolate({
              inputRange: [0, 1, 2],
              outputRange: [0, 1, 0],
            }),
            transform: [
              {
                translateY: blockAnim.interpolate({
                  inputRange: [0, 1, 2],
                  outputRange: [50, 0, -50],
                }),
              },
              {
                scale: blockAnim.interpolate({
                  inputRange: [0, 1, 2],
                  outputRange: [0.8, 1, 1.1],
                }),
              }
            ],
          }}
        >
          <Animated.Text
            style={{
              fontSize: 28,
              lineHeight: 30,
              fontFamily: 'Merriweather-Bold',
              color: "#000",
            }}
          >
            Comment vous {`\n`}
            vous appellez ?
          </Animated.Text>

          <Text
            style={{
              fontSize: 16,
              color: "#000",
              fontFamily: 'MerriweatherSans-Medium',
            }}
          >
            Cette application utilise votre prénom pour personnaliser votre expérience.
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              gap: 9,
              backgroundColor: "#fff",
              borderRadius: 300,
              marginTop: 16,
            }}
          >
            <TextInput
              style={{
                fontSize: 16,
                color: "#000000",
                fontFamily: 'MerriweatherSans-Regular',
                flex: 1,
                padding: 20,
                paddingVertical: 12,
              }}
              placeholder="Votre prénom"
              placeholderTextColor="#00000055"
              autoFocus={true}
              value={name}
              onChangeText={setName}
            />
          </View>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 10,
                gap: 9,
                backgroundColor: "#000",
                borderRadius: 300,
                marginTop: 0,
                marginBottom: 16,
              }}
              onPress={() => nextStep()}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "#f7e4ba",
                  fontFamily: 'MerriweatherSans-Medium',
                }}
              >
                Confirmer
              </Text>
              <Check size={24} color="#f7e4ba" />
            </TouchableOpacity>

          <Text
            style={{
              fontSize: 13,
              color: "#00000088",
              fontFamily: 'MerriweatherSans-Regular',
            }}
          >
            Vous pouvez changer ce paramètre à tout moment dans les paramètres de l'application.
          </Text>

        </Animated.View>

      </KeyboardAvoidingView>
    </View>
  );
}

export default SetNameScreen;