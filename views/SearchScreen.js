import * as React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { NativeText } from '../components/NativeTableView';

function SearchScreen({ navigation }) {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentInsetAdjustmentBehavior='automatic'
    >
      <NativeText>
        Search Screen
      </NativeText>
    </ScrollView>
  );
}

export default SearchScreen;