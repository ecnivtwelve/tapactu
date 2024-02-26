import * as React from 'react';
import { View, ScrollView, Button, } from 'react-native';

import { NativeList, NativeItem, NativeText } from '../components/NativeTableView';

function HomeScreen({ navigation }) {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentInsetAdjustmentBehavior='automatic'
    >
      <NativeList header="Home Screen" inset>
        <NativeItem
          onPress={() => navigation.navigate('Details')}
        >
          <NativeText>
            Go to Details
          </NativeText>
        </NativeItem>
      </NativeList>
    </ScrollView>
  );
}

export default HomeScreen;