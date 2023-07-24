import axios from "axios";
import { useState, useEffect } from "react";

const useImageRecognize = (filename, base64Data) => {
    const [data, setData] = useState(null);

    console.log("여기22!!!!!");

    // 이미지 S3 버킷에 업로드
    async function sendImageToS3(filename, base64Image) {
        const lambdaUrl =
            "https://xs21gvtq40.execute-api.eu-central-1.amazonaws.com/oheumwan/upload-to-s3";

        const imageData = {
            name: filename, // 이미지 파일명
            file: base64Image, // 이미지 데이터를 Base64로 인코딩한 문자열
        };

        try {
            const response = await axios.post(lambdaUrl, imageData);
            console.log("S3 업로드 성공!", response.data.body);
        } catch (err) {
            console.error("Error!!:", err);
        }
    }

    // 이미지 분석 요청
    async function sendImageToRecognize(filename) {
        const serverUrl =
            "https://xs21gvtq40.execute-api.eu-central-1.amazonaws.com/oheumwan/image-recog";

        try {
            const response = await axios.get(`${serverUrl}?image=${filename}`);
            console.log(response.data.body, "재료 추출 완료!");
            setData(response.data.body);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        // 컴포넌트가 마운트되면 이미지 업로드 및 분석 시작
        sendImageToS3(filename, base64Data);
        // sendImageToRecognize(filename);

        return data;
    }, []);

    return data;
};

export default useImageRecognize;
