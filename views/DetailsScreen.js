import * as React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { NativeText } from '../components/NativeTableView';

function DetailsScreen({ navigation }) {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentInsetAdjustmentBehavior='automatic'
    >
      <NativeText>
        Details Screen
      </NativeText>
    </ScrollView>
  );
}

export default DetailsScreen;