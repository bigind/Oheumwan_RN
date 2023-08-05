import * as React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { HomeScreen, CommunityScreen, Add, ProfileScreen, SettingScreen, MyboxScreen } from './';

const Tab = createBottomTabNavigator();

const screenOptions = ({ route }) => ({
  tabBarShowLabel: true, // 라벨 설정
  headerShown: false, // 헤더 보이게
  tabBarStyle: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    elevation: 0,
    height: 60,
    backgroundColor: "#fff"
  },
  tabBarLabelStyle: {
    fontSize: 14, 
    fontWeight: 'bold', 
  },
  tabBarIcon: ({ focused, color, size }) => {
    let iconName;
    switch (route.name) {
        case '홈':
            iconName = focused ? 'home' : 'home-outline';
            break;
        case '커뮤니티':
            iconName = focused ? 'md-chatbubbles' : 'md-chatbubbles-outline';
            break;
        case '추가':
            iconName = focused ? 'camera' : 'camera-outline';
            break;
        case '보관함':
            iconName = focused ? 'fast-food-sharp' : 'fast-food-outline';
            break;
        case '프로필':
            iconName = focused ? 'person' : 'person-outline';
            break;
      
      default:
        iconName = focused ? 'home' : 'home-outline';
    }

    // 추가 버튼탭의 크기를 조정하기 위한 코드
    if (route.name === '추가') {
      return (
        <View style={{
          width: 60, // 원하는 너비로 조절하세요
          height: 60, // 원하는 높이로 조절하세요
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Ionicons name={iconName} size={size + 6} color={color} />
        </View>
      );
    }
    
    return <Ionicons name={iconName} size={size} color={color} />;
  },
  tabBarActiveTintColor: 'black',
  tabBarInactiveTintColor: 'gray',
});

export default function AppNavigator() {
  return (
    <NavigationContainer>
        <Tab.Navigator screenOptions={screenOptions} initialRouteName="추가">
            <Tab.Screen name="홈" component={HomeScreen} />
            <Tab.Screen name="커뮤니티" component={CommunityScreen} />
            <Tab.Screen name="추가" component={Add} options={{ tabBarLabel: '카메라' }}/>
            <Tab.Screen name="보관함" component={MyboxScreen} />
            <Tab.Screen name="프로필" component={ProfileScreen} />
        </Tab.Navigator>
    </NavigationContainer>
  );
}
