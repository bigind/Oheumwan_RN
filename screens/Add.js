import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, Modal, View, StyleSheet, Text, Image } from 'react-native';
import Oheumwan_Camera from "../camera/camera";
import { WebView } from 'react-native-webview';
import { server } from "../server";

const Add = () => {
  const [isCameraVisible, setCameraVisible] = useState(false);
  const [isWebViewVisible, setWebViewVisible] = useState(false);

  const webViewRef = useRef(null); // WebView의 ref 설정

  const sendMessageToWebView = (photo) => {
    const message = 'Hello from React Native!';
    console.log("2: ",photo)
    setTimeout(() => {
      webViewRef.current.postMessage(JSON.stringify(photo.uri));
      console.log('데이터 보냄');
    }, 1000);
  };

  // 카메라 시작
  const openCamera = () => {
    setCameraVisible(true);
  };
  // 카메라 종료
  const closeCamera = () => {
    setCameraVisible(false);
  };

  return (
    isWebViewVisible ?
      (<View style={{ flex: 1, paddingTop: 40 }}>
        <WebView
          ref={webViewRef}
          source={{ uri: `${server}/getimage` }}
          javaScriptEnabled={true}
        />
      </View>)
      :
      (<View style={styles.modalContainer}>
        <TouchableOpacity style={styles.buttonWrapper} onPress={openCamera}>
          <Text style={styles.buttonText}>이미지 인식</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonWrapper} onPress={() => { /* 레시피 추천 버튼을 눌렀을 때 실행되는 함수 */ }}>
          <Text style={styles.buttonText}>레시피 추천</Text>
        </TouchableOpacity>

        <Modal visible={isCameraVisible} animationType="slide">
          <Oheumwan_Camera
            onClose={closeCamera}
            onCapture={(photo) => {
              closeCamera;
              setWebViewVisible(true);
              console.log("1: ",photo);
              sendMessageToWebView(photo)
            }}
          />
        </Modal>
      </View>)
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 300,
  },
  buttonWrapper: {
    backgroundColor: 'gray',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 10,
    width: 300, // 버튼의 너비를 조정
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  capturedImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginTop: 10,
  },
});

export default Add;
