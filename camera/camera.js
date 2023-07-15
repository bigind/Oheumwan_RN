import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { useState, useEffect } from 'react';

// Import the camera exit icon
import { Ionicons } from '@expo/vector-icons';

export default function Oheumwan_Camera({ onClose }) {
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
      console.log('찍은 사진:', photo);
    }
  }

  function exitCamera() {
    // 카메라 종료 동작 수행
    onClose(); // 모달을 닫기 위해 onClose 함수 호출
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
        <TouchableOpacity style={styles.exitButton} onPress={exitCamera}>
          <Ionicons name="exit-outline" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <View style={styles.captureInnerButton} />
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
