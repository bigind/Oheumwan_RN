import * as React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { HomeScreen, CommunityScreen, Add, ProfileScreen, SettingScreen, MyboxScreen } from './';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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
            iconName = focused ? 'add-circle' : 'add-circle-outline';
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
    return <Ionicons name={iconName} size={size} color={color} />;
  },
  tabBarActiveTintColor: 'black',
  tabBarInactiveTintColor: 'gray',
});

export default function AppNavigator() {
  return (
    <NavigationContainer>
        <Tab.Navigator screenOptions={screenOptions}>
            <Tab.Screen name="홈" component={HomeScreen} />
            <Tab.Screen name="커뮤니티" component={CommunityScreen} />
            <Tab.Screen name="추가" component={Add} options={{tabBarShowLabel:true}}/>
            <Tab.Screen name="보관함" component={MyboxScreen} />
            <Tab.Screen name="프로필" component={ProfileScreen} />
        </Tab.Navigator>
    </NavigationContainer>
  );
}
