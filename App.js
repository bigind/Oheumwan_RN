import React, {useEffect, useRef, useState} from "react";
import AppNavigator from "./screens/AppNavigator";
import { View, Text, Button, Modal, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

import { server } from "./server";
import { getData, storeData } from "./utils/AsyncStorage";
import axios from "axios";

const App = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [access_token, setAccess_token] = useState(null);
  const [iskakaoModal, setIskakakoModal] = useState(false);

  let isLogInProgress = false; // 여러 번 실행을 방지하기 위한 플래그 추가


  const REST_API_KEY = 'a467cb476cd5ac847ed6ce10094ddfcf' //REST API KEY
  const REDIRECT_URI = `${server}/auth` //Redirect URI
  const grantType = "authorization_code";
  // oauth 요청 URL
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`
  const LambdaLogin = `https://xs21gvtq40.execute-api.eu-central-1.amazonaws.com/oheumwan/kakao-login`;


  // 앱 로딩전에 토큰이 AsyncStorage 에 있는지 확인
  useEffect(() => {
    const fetchData = async () => {
      const token = await getData('token');
      setAccess_token(token);

      // 토큰이 존재하면 바로 로그인 시도
      if(token){
        console.log(token);
        Login(token);
        setIsLogin(true);
      }
    };

    fetchData();
  }, [])

  // 1. 토큰 인가코드 발급
  const handleLogInProgress = (data) => {
    if (!isLogInProgress) {
      isLogInProgress = true; // 중복 실행 방지를 위해 플래그를 true로 설정
      const exp = "code=";
      var condition = data.indexOf(exp);

      if (condition !== -1) {
        var request_code = data.substring(condition + exp.length);
        console.log("인가 코드",request_code);
        setIskakakoModal(false);  // 모달 종료
        requestToken(request_code); // 토큰값 받기
      }
    }
  };

  // 2. 발급 받은 인가코드를 이용해서 사용자 토큰을 발급
  const requestToken = (request_code) => {
    axios.post(
      `https://kauth.kakao.com/oauth/token?grant_type=${grantType}&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&code=${request_code}`,
      {},
      { headers: { "Content-type": "application/x-www-form-urlencoded;charset=utf-8" } }
    ).then((res) => {

      // 유저 토큰
      console.log("유저 토큰",res.data.access_token);

      // 토큰 세션에 저장
      // storeData('token',res.data.access_token);

      // 로그인
      Login(res.data.access_token);

    }).catch((err) => {
      console.log('error', err);
      setIskakakoModal(false);
      Alert.alert("로그인에 실패했습니다.", err)
    });
  };

  // 3. 서버로 로그인 요청
  const Login = (access_token) => {
    // 데이터베이스에 회원 조회 요청 및 가입
    axios.post(LambdaLogin,{
      token : access_token
    })
    .then((res) => {
      return console.log("유저 정보",res.data.body)
      setIsLogin(true);
    })
    .catch((err) => {
      return console.log(err)
    })
  };

  return (
    <>
      {isLogin ? <AppNavigator/>
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