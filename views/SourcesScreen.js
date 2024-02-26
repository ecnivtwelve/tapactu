import * as React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { NativeText } from '../components/NativeTableView';

function SourcesScreen({ navigation }) {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentInsetAdjustmentBehavior='automatic'
    >
      <NativeText>
        Sources Screen
      </NativeText>
    </ScrollView>
  );
}

export default SourcesScreen;