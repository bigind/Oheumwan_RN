import React, { useState } from 'react';
import { TouchableOpacity, Modal, View, StyleSheet, Text } from 'react-native';
import Oheumwan_Camera from "../camera/camera";

const Add = () => {
  const [isCameraVisible, setCameraVisible] = useState(false);

  const openCamera = () => {
    setCameraVisible(true);
  };

  const closeCamera = () => {
    setCameraVisible(false);
  };

  return (
    <View style={styles.modalContainer}>
      <TouchableOpacity style={styles.buttonWrapper} onPress={openCamera}>
        <Text style={styles.buttonText}>이미지 인식</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonWrapper} onPress={() => { /* 레시피 추천 버튼을 눌렀을 때 실행되는 함수 */ }}>
        <Text style={styles.buttonText}>레시피 추천</Text>
      </TouchableOpacity>

      <Modal visible={isCameraVisible} animationType="slide">
        <Oheumwan_Camera onClose={closeCamera} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 80,
  },
  buttonWrapper: {
    backgroundColor: 'gray',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
    width: 200, // 버튼의 너비를 조정할 수 있습니다.
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Add;
