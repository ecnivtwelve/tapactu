import * as React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { NativeText } from '../components/NativeTableView';

function BookmarkScreen({ navigation }) {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentInsetAdjustmentBehavior='automatic'
    >
      <NativeText>
        Bookmark Screen
      </NativeText>
    </ScrollView>
  );
}

export default BookmarkScreen;