import React, { useEffect, useState } from "react";
import AppNavigator from "./screens/AppNavigator";
import { View, Text, Button, Modal, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { server } from "./server";
import axios from "axios";

const App = () => {
  const [isLogin, setIslogin] = useState(false);
  const [access_token, setAceess_token] = useState(null);
  let isLogInProgress = false; // 여러 번 실행을 방지하기 위한 플래그 추가
  const [iskakaoModal, setIskakakoModal] = useState(false);


  const REST_API_KEY = 'a467cb476cd5ac847ed6ce10094ddfcf' //REST API KEY
  const REDIRECT_URI = 'http://192.168.0.15:3000/auth' //Redirect URI
  const grantType = "authorization_code";
  // oauth 요청 URL
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`
  const LambdaLogin = `https://xs21gvtq40.execute-api.eu-central-1.amazonaws.com/oheumwan/kakao-login`;


  const handleLogInProgress = (data) => {
    if (!isLogInProgress) {
      //isLogInProgress = true; // 중복 실행 방지를 위해 플래그를 true로 설정
      const exp = "code=";
      var condition = data.indexOf(exp);

      if (condition !== -1) {
        var request_code = data.substring(condition + exp.length);
        console.log("인가 코드",request_code);
        requestToken(request_code); // 토큰값 받기
      }
    }
  };

  const requestToken = (request_code) => {
    axios.post(
      `https://kauth.kakao.com/oauth/token?grant_type=${grantType}&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&code=${request_code}`,
      {},
      { headers: { "Content-type": "application/x-www-form-urlencoded;charset=utf-8" } }
    ).then((res) => {
      setAceess_token(res.data.access_token);
      console.log("토큰",res.data.access_token);


      // 회원 조회 요청 및 가입
      axios.post(LambdaLogin,{
        token : res.data.access_token
      })
      .then((res) => {
        console.log(res.data.body)
        user = res.data.body

        setIslogin(true);

        // 자료 저장하기
        const storeData = async tasks => {
          try {
            await AsyncStorage.setItem('token', JSON.stringify(access_token));
            await AsyncStorage.setItem('member_id', JSON.stringify(user.member_id));
            await AsyncStorage.setItem('username', JSON.stringify(user.username));
            await AsyncStorage.setItem('registration_date', JSON.stringify(user.registration_date));
            await AsyncStorage.setItem('email', JSON.stringify(user.email));
            await AsyncStorage.setItem('profile_image', JSON.stringify(user.profile_image));
            await AsyncStorage.setItem('thumbnail_image', JSON.stringify(user.thumbnail_image));
            await AsyncStorage.setItem('age_range', JSON.stringify(user.age_range));
            await AsyncStorage.setItem('gender', JSON.stringify(user.gender));
          } catch (e) {
            console.log(e);
          }
        }
      })
      .catch((err) => {
        console.log(err)
      })

      setIskakakoModal(false);
    }).catch((err) => {
      console.log('error', err);
      setIskakakoModal(false);
    });
  };

  return (
    <>
      {access_token ?
      <> 
      <AppNavigator/>
      </>
      :
      <>
      <View style={{ flex: 1, paddingTop: 40 }}>
        <WebView
          source={{ uri: `${server}/login` }}
          javaScriptEnabled={true}
          onMessage={(e) => {
            const data = JSON.parse(e.nativeEvent.data);
            setIskakakoModal(Boolean(data));
          }}
        />
      </View>
      
      <Modal visible={iskakaoModal} animationType="slide">
        <View style={{ flex: 1 }}>
          <WebView
            originWhitelist={['*']}
            scalesPageToFit={false}
            source={{ uri: kakaoURL }}
            injectedJavaScript={`window.ReactNativeWebView.postMessage("this is message from web")`}
            javaScriptEnabled={true}
            onMessage={(event) => { handleLogInProgress(event.nativeEvent["url"]); }}
          />
        </View>
      </Modal>
      </>
      }
    </>
  );
};

export default App;