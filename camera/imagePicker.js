import React, { useState, useEffect } from 'react';
import { Image, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerExample({onClose}) {
    const [image, setImage] = useState(null);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });
        if (result.canceled === true) {
            onClose();
            return;
        }
        setImage(result.assets[0].uri);
    };

    useEffect(() => {
        pickImage();
    }, []); // 빈 배열을 전달하여 컴포넌트가 처음 렌더링될 때에만 실행

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        </View>
    );
}
