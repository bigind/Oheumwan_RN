import React, { useState, useEffect } from 'react';
import { Image, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import convertImageToBase64 from "../utils/convertImageToBase64"
import {Camera} from "expo-camera";
import {requestMediaLibraryPermissionsAsync} from "expo-image-picker/src/ImagePicker";

export default function ImagePickerExample({onClose, onChoice}) {
    const [image, setImage] = useState(null);
    // const [permission, setPermission] = useState(null);

    useEffect(() => {
        // (async () => {
        //     const { CameraPermissions } = await ImagePicker.requestCameraPermissionsAsync();
        //     if (CameraPermissions !== 'granted') {
        //         alert('카메라 접근 권한이 필요합니다!');
        //     }
        // })();
        // (async () => {
        //     const { MediaLibraryPermissions } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        //     if (MediaLibraryPermissions !== 'granted') {
        //         alert('미디어 라이브러리의 접근 권한이 필요합니다!');
        //     }
        // })();
        pickImage();
    }, []);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });
        // console.log(result);

        // 이미지 선택을 취소하면,
        if (result.canceled === true) {
            onClose();
            return;
        }
        
        // 이미지 선택을 완료하면,
        const photo = result.assets[0];
        console.log("이미지 정보", result.assets[0]);

        // 이미지를 1MB 이하로 리사이징합니다.
        const resizedPhoto = await manipulateAsync(photo.uri, [{ resize: {width: 640, height: 640}}], {format: SaveFormat.JPEG});
        console.log("사진 리사이징 : ",resizedPhoto);

        const filename = resizedPhoto.uri.substring(resizedPhoto.uri.lastIndexOf('/') + 1)
        const base64Data = await convertImageToBase64(resizedPhoto.uri) // 이미지를 Base64로 변환합니다.
        onChoice(filename, base64Data);
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {/*{image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}*/}
        </View>
    );
}
