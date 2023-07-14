import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera } from 'expo-camera';
import { useState, useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';

export default function Oheumwan_Camera() {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState(null);
  const [galleryPermission, requestGalleryPermission] = MediaLibrary.usePermissions();
  const [lastPhoto, setLastPhoto] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('죄송합니다. 사진을 저장하기 위해 갤러리 접근 권한이 필요합니다!');
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

  if (!galleryPermission || !galleryPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>갤러리 접근을 위한 권한이 필요합니다</Text>
        <Button onPress={requestGalleryPermission} title="갤러리 접근 허용하기" />
      </View>
    );
  }

  async function takePicture() {
    if (camera) {
      const photo = await camera.takePictureAsync();
      savePicture(photo.uri);
    }
  }

  async function savePicture(photoUri) {
    try {
      await MediaLibrary.saveToLibraryAsync(photoUri);
      setLastPhoto(photoUri);
      alert('사진이 갤러리에 저장되었습니다!');
    } catch (error) {
      console.error('갤러리에 사진 저장 중 오류 발생', error);
      alert('사진을 갤러리에 저장하는 데 실패했습니다');
    }
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        ref={(ref) => setCamera(ref)}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            {/* 셔터 버튼 */}
            <View style={styles.captureInnerButton} />
          </TouchableOpacity>
        </View>
      </Camera>
      {lastPhoto && (
        <TouchableOpacity
          style={styles.galleryButton}
          onPress={() => alert('갤러리 버튼이 눌렸습니다')} // 원하는 동작으로 변경해주세요
        >
          <Image source={{ uri: lastPhoto }} style={styles.galleryImage} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end', // 하단 정렬
    alignItems: 'center',
    marginBottom: 40, // 하단 여백
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInnerButton: {
    width: 60, // 작은 크기
    height: 60, // 작은 크기
    borderRadius: 30, // 더 동그랗게
    backgroundColor: 'red',
  },
  galleryButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    width: 60,
    height: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
});
