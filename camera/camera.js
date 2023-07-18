import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import convertImageToBase64 from "../utils/convertImageToBase64"

export default function Oheumwan_Camera({ onClose, onCapture }) {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('카메라 접근 권한이 필요합니다!');
      }
    })();
  }, []);

  if (!permission || !permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>카메라를 표시하기 위해 권한이 필요합니다</Text>
        <Button onPress={requestPermission} title="권한 허용하기" />
      </View>
    );
  }

  async function takePicture() {
    if (camera) {
      const photo = await camera.takePictureAsync();
      console.log("사진 정보 : ",photo)
      const filename = photo.uri.substring(photo.uri.lastIndexOf('/') + 1)
      const base64Data = await convertImageToBase64(photo.uri)
      onCapture(filename, base64Data); // 찍은 사진을 Add 컴포넌트로 전달합니다
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Camera
          style={styles.camera}
          type={Camera.Constants.Type.back}
          ref={(ref) => setCamera(ref)}
        />
      </View>
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.exitButton} onPress={() => onClose()}>
          <Ionicons name="exit-outline" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    flex: 4,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitButton: {
    position: 'absolute',
    bottom: 60,
    right: 20,
  },
});
