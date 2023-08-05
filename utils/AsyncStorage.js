import AsyncStorage from "@react-native-async-storage/async-storage";

export const getData = async (key) => {

    try {
        const loadedData = await AsyncStorage.getItem(key)
        console.log(key, ":", loadedData);
        return loadedData;
    } catch(e) {
        console.log("AsyncStorage 불러오기 에러");
    }
}

export const storeData = async (key,data) => {
    try {
        await AsyncStorage.setItem(key, data);
        console.log(key, "저장 완료")
    } catch (e) {
        console.log("AsyncStorage 저장 에러");
    }
}