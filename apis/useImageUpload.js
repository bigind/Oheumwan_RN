import axios from "axios";
import { useState } from "react";

const useImageUpload = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    async function sendImageToServer(filename, base64Image) {
        const lambdaUrl = 'https://xs21gvtq40.execute-api.eu-central-1.amazonaws.com/prod/upload-to-s3';
    
        const ImageData = {
            name: filename,  // 이미지 파일명
            file: base64Image, // 이미지 데이터를 Base64로 인코딩한 문자열
        }

        try {
            setIsLoading(true);
            const response = await axios.post(lambdaUrl, ImageData);
            console.log(response.data, "업로드 성공!");
            // return response.data;
        } catch (error) {
            setIsError(true);
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    }

    // 로딩, 실제 s3에 박는 함수, 에러 상태
    return { sendImageToServer, isLoading, isError };
}

export default useImageUpload;