import * as React from 'react';
import { Animated, Easing, View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { NativeText } from '../../components/NativeTableView';

import { useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArrowRight } from 'lucide-react-native';

import AsyncStorage from "@react-native-async-storage/async-storage";

function HelloScreen({ route, navigation }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const { name } = route.params;

  const blockAnim = new Animated.Value(0);

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
    AsyncStorage.setItem("hasDoneBoarding", "true");

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
          navigation.navigate('Main');
        }
      });
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#f7e4ba",
      }}
      contentInsetAdjustmentBehavior='automatic'
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f7e4ba" />

      <Animated.View
        style={{
          width: '100%',
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
          Bienvenue, {`\n`}
          {name} !
        </Animated.Text>

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 10,
              gap: 9,
              backgroundColor: "#000",
              borderRadius: 300,
              marginTop: 24,
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
              C'est parti !
            </Text>
            <ArrowRight size={24} color="#f7e4ba" />
          </TouchableOpacity>
      </Animated.View>

    </View>
  );
}

export default HelloScreen;