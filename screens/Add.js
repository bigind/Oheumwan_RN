import React, { useState, useRef, useEffect } from 'react';
import {Modal, View, StyleSheet, Alert} from 'react-native';
import Oheumwan_Camera from "../camera/camera";
import ImagePickerExample from "../camera/imagePicker";
import { WebView } from 'react-native-webview';
import { server } from "../server";
import axios from 'axios';
import {getData} from "../utils/AsyncStorage";
// import useImageRecognize from "../apis/useImageRecognize"

const Add = ({ navigation }) => {
    const [isCameraVisible, setCameraVisible] = useState(false);
    const [isGalleryVisible, setGalleryVisible] = useState(false);
    const [isCameraMenuVisible, setCameraMenuVisible] = useState(false);

    const [data, setData] = useState(null); // 이미지 분석 결과를 저장할 상태 변수


    const webViewRef_ImageRecog = useRef(null);
    const webViewRef_CameraMenu = useRef(null);

    useEffect(() => {
        if (data) {
            sendMessageToWebView();
        }
    }, [data])

    const sendMessageToWebView = () => {
        setTimeout(() => {
            webViewRef_ImageRecog.current.postMessage(JSON.stringify(data));
            console.log(data, '재료 데이터 웹뷰로 전송');
        }, 1000);
    };

    // 이미지 S3 버킷에 업로드
    async function sendImageToS3(filename, base64Image) {
        const lambdaUrl =
            "https://xs21gvtq40.execute-api.eu-central-1.amazonaws.com/oheumwan/upload-to-s3";

        const imageData = {
            name: filename, // 이미지 파일명
            file: base64Image, // 이미지 데이터를 Base64로 인코딩한 문자열
        };

        await axios.post(lambdaUrl, imageData)
            .catch((err) => {
                console.log(err);
            });
        console.log("S3에 이미지 업로드 성공!");
    }

    // 이미지 분석 요청
    async function sendImageToRecognize(filename) {
        const serverUrl =
            "http://ec2-43-202-50-213.ap-northeast-2.compute.amazonaws.com:5000";

        try {
            const response = await axios.get(`${serverUrl}?image=${filename}`);
            // console.log(response.data.statusCode);
            if(response.data.statusCode === 400) {
                console.log(response.data.body, "재료 인식 실패!");
                setData(null);
            }
            else {
                console.log(response.data.body, "재료 추출 완료!");
                console.log(typeof (response.data.body));
                setData(response.data.body);
            }

        } catch (err) {
            console.log(err);
        }
    }

    return (
        !isCameraMenuVisible ?
            (
                <View style={{ flex: 1, paddingTop: 40 }}>
                    <WebView
                        ref={webViewRef_CameraMenu}
                        source={{ uri: `${server}/camera` }}
                        javaScriptEnabled={true}
                        onMessage={(e) => {
                            const data = JSON.parse(e.nativeEvent.data);
                            // console.log(data)
                            setCameraMenuVisible(false); // 카메라 메뉴로 전환
                            setData(null); // 재료 데이터 초기화

                            if(data === "camera"){
                                setCameraVisible(true);
                            }
                            if(data === "gallery"){
                                setGalleryVisible(true);
                            }
                        }}
                    />
                    <Modal visible={isCameraVisible} animationType="slide">
                        <Oheumwan_Camera
                            onClose={() => setCameraVisible(false)}
                            onCapture={(filename, base64Data) => {
                                setCameraVisible(false);     // 카메라 화면 종료
                                setCameraMenuVisible(true);     // 카메라 메뉴로 전환

                                try {
                                    sendImageToS3(filename, base64Data);
                                } catch (err) {
                                    console.error("Error:", err);
                                    return;
                                }

                                try {
                                    sendImageToRecognize(filename);
                                } catch (err) {
                                    console.log("이미지 인식 서버 : ",err);
                                }
                            }}
                        />
                    </Modal>

                    <Modal visible={isGalleryVisible} animationType="slide">
                        <ImagePickerExample
                            onClose={() => setGalleryVisible(false)}
                            onChoice={(filename, base64Data) => {
                                setGalleryVisible(false);  // 갤러리 화면 종료
                                setCameraMenuVisible(true);     // 카메라 메뉴로 전환

                                try {
                                    sendImageToS3(filename, base64Data);
                                } catch (err) {
                                    console.error("Error:", err);
                                    return;
                                }

                                try {
                                    sendImageToRecognize(filename);
                                } catch (err) {
                                    console.log(err);
                                }
                            }}
                        />
                    </Modal>
                </View>
            ) : (
                <View style={{ flex: 1, paddingTop: 40 }}>
                    <WebView
                        ref={webViewRef_ImageRecog}
                        source={{ uri: `${server}/getimage` }}
                        javaScriptEnabled={true}
                        onMessage={(e) => {
                            const data = JSON.parse(e.nativeEvent.data);
                            console.log(data)

                            if(data === "save"){
                                Alert.alert("알림", "보관함에 저장하였습니다!");
                                navigation.navigate("보관함");
                            }
                            if(data === "err"){
                                Alert.alert("알림", "재료 보관에 실패했습니다");
                            }
                            if(data === "exit"){
                                Alert.alert("경고", "모든 데이터가 사라집니다, 나가시겠습니까?",[
                                    {text: "취소",onPress: () => {},style: "cancel"},
                                    {text: "확인",onPress: () => { navigation.navigate("추가") },style: "default"}
                                ])
                            }
                        }}
                    />
                </View>
            )
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
