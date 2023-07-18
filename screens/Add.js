import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, Modal, View, StyleSheet, Text, Image } from 'react-native';
import Oheumwan_Camera from "../camera/camera";
import ImagePickerExample from "../camera/imagePicker";
import { WebView } from 'react-native-webview';
import { server } from "../server";

const Add = () => {
  const [isCameraVisible, setCameraVisible] = useState(false);
  const [isGalleryVisible, setGalleryVisible] = useState(false);
  const [isWebViewVisible, setWebViewVisible] = useState(false);

  const webViewRef = useRef(null); // WebView의 ref 설정

  const sendMessageToWebView = (ImagePath) => {
    // const message = 'Hello from React Native!';
    setTimeout(() => {
      webViewRef.current.postMessage(ImagePath);
      console.log('이미지 경로 전송');
    }, 1000);
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
        <TouchableOpacity style={styles.buttonWrapper} onPress={() => setCameraVisible(true)}>
          <Text style={styles.buttonText}>이미지 촬영</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonWrapper} onPress={() => setGalleryVisible(true)}>
          <Text style={styles.buttonText}>이미지 업로드</Text>
        </TouchableOpacity>

        <Modal visible={isCameraVisible} animationType="slide">
          <Oheumwan_Camera
            onClose={() => setCameraVisible(false)}
            onCapture={(ImagePath) => {
              setCameraVisible(false);
              setWebViewVisible(true);
              sendMessageToWebView(ImagePath)
            }}
          />
        </Modal>

        <Modal visible={isGalleryVisible} animationType="slide">
          <ImagePickerExample
              onClose={() => setGalleryVisible(false)}
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
