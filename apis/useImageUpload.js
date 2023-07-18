import axios from "axios";

const useImageUpload = async (filename, base64Image) => {

    const lambdaUrl = 'https://xs21gvtq40.execute-api.eu-central-1.amazonaws.com/prod/upload-to-s3';

    const headers = { 'Content-Type': 'application/json' };
    const ImageData = {
        name: filename,  // 이미지 파일명
        file: base64Image, // 이미지 데이터를 Base64로 인코딩한 문자열
    }
    try {
        const response = await axios.post(lambdaUrl, ImageData, { headers });
        console.log(response.data);
    } catch (error) {
        console.error('Error:', error);
    }
}

export default useImageUpload;