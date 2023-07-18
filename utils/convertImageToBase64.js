
function convertBase64(imageUri) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            const reader = new FileReader();
            reader.onloadend = function () {
                resolve(reader.result.split(',')[1]);
            };
            reader.onerror = function (error) {
                reject(error);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.onerror = function (error) {
            reject(error);
        };
        xhr.open('GET', imageUri);
        xhr.responseType = 'blob';
        xhr.send();
    });
}

const convertImageToBase64 = async (imageUri) => {
    try {
        const base64Data = await convertBase64(imageUri);
        return base64Data;
    } catch (error) {
        console.error('Error converting image to Base64:', error);
        return null;
    }
};

export default convertImageToBase64;
