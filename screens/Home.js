import React, { useRef, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { WebView } from 'react-native-webview';

import { server } from "../server";

const HomeScreen = () => {
  const webViewRef = useRef(null);

  useEffect(() => {
    sendMessageToWebView();
  }, []);

  const sendMessageToWebView = () => {
    const message = 'Hello from React Native!';
    setTimeout(() => {
      webViewRef.current.postMessage(message);
      console.log('데이터 보냄');
    }, 1000);
  };

  return (
    <View style={{ flex: 1, paddingTop: 40 }}>
      <WebView
        ref={webViewRef}
        source={{ uri: `${server}/home` }}
        javaScriptEnabled={true}
        // onMessage={(event) => {
        //   const message = event.nativeEvent.data;
        //   console.log('Received message:', message);
        //   // 원하는 작업 수행
        // }}
      />
    </View>
  );
};

export default HomeScreen;
