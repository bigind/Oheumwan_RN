import React from 'react';
import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview';

import {server} from "../server";

const CommunityScreen = () => {
  return (
    <View style={{ flex: 1, paddingTop: 40 }}>
      <WebView
        source={{ uri: `${server}/community` }}
      />
    </View>
    // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //   <Text>Community Screen</Text>
    // </View>
  );
};

export default CommunityScreen;