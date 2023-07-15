import React from 'react';
import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview';

import {server} from "../server";

const HomeScreen = () => {
  return (
    <View style={{ flex: 1, paddingTop: 40 }}>
      <WebView
        source={{ uri: `${server}/home` }}
      />
    </View>
    // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //   <Text>WebView</Text>
    // </View>
  );
};

export default HomeScreen;