/**
 * FPTlibex - Buy & Sell Used Books at FPT
 * @format
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from './src/screens/HomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import ChatDetailScreen from './src/screens/ChatDetailScreen';
import SellBookScreen from './src/screens/SellBookScreen';
import MyBooksScreen from './src/screens/MyBooksScreen';
import EditBookScreen from './src/screens/EditBookScreen';
import OrderScreen from './src/screens/OrderScreen';
import BookDetailScreen from './src/screens/BookDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import { Colors } from './src/theme/colors';

const Tab = createBottomTabNavigator();
const RootStackNav = createNativeStackNavigator();
const AuthStackNav = createNativeStackNavigator();
const HomeStackNav = createNativeStackNavigator();
const ChatStackNav = createNativeStackNavigator();
const SellStackNav = createNativeStackNavigator();

// Auth Stack
function AuthStack() {
  return (
    <AuthStackNav.Navigator screenOptions={{ headerShown: false }}>
      <AuthStackNav.Screen name="Login" component={LoginScreen} />
      <AuthStackNav.Screen name="Register" component={RegisterScreen} />
      <AuthStackNav.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStackNav.Navigator>
  );
}

// Sell Stack
function SellStack() {
  return (
    <SellStackNav.Navigator screenOptions={{ headerShown: false }}>
      <SellStackNav.Screen name="MyBooks" component={MyBooksScreen} />
      <SellStackNav.Screen name="SellBook" component={SellBookScreen} />
      <SellStackNav.Screen name="EditBook" component={EditBookScreen} />
    </SellStackNav.Navigator>
  );
}



// Home Stack with Book Detail
function HomeStack() {
  return (
    <HomeStackNav.Navigator screenOptions={{ headerShown: false }}>
      <HomeStackNav.Screen name="HomeMain" component={HomeScreen} />
      <HomeStackNav.Screen name="BookDetail" component={BookDetailScreen} />
    </HomeStackNav.Navigator>
  );
}

// Chat Stack with Chat Detail
function ChatStack() {
  return (
    <ChatStackNav.Navigator screenOptions={{ headerShown: false }}>
      <ChatStackNav.Screen name="ChatList" component={ChatScreen} />
      <ChatStackNav.Screen name="ChatDetail" component={ChatDetailScreen} />
    </ChatStackNav.Navigator>
  );
}

const tabIcons: Record<string, { active: string; inactive: string }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Chat: { active: 'chatbubbles', inactive: 'chatbubbles-outline' },
  Add: { active: 'add-circle', inactive: 'add-circle-outline' },
  Orders: { active: 'receipt', inactive: 'receipt-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
};

// Main Tabs (Bottom Navigation)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: -2,
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          height: 85,
          paddingTop: 8,
          paddingBottom: 28,
          shadowColor: 'rgba(0,0,0,0.08)',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 1,
          shadowRadius: 12,
          elevation: 8,
        },
        tabBarIcon: ({ focused, color }) => {
          const iconNames = tabIcons[route.name];
          const iconName = focused ? iconNames.active : iconNames.inactive;

          if (route.name === 'Add') {
            return (
              <View style={styles.addButton}>
                <Icon name="add" size={28} color="#FFFFFF" />
              </View>
            );
          }

          return <Icon name={iconName} size={22} color={color} />;
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ tabBarLabel: 'Trang chủ' }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatStack}
        options={{ tabBarLabel: 'Tin nhắn' }}
      />
      <Tab.Screen
        name="Add"
        component={SellStack}
        options={{ tabBarLabel: 'Đăng bán' }}
      />
      <Tab.Screen
        name="Orders"
        component={OrderScreen}
        options={{ tabBarLabel: 'Đơn hàng' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Hồ sơ' }}
      />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStackNav.Navigator screenOptions={{ headerShown: false }}>
          <RootStackNav.Screen name="Auth" component={AuthStack} />
          <RootStackNav.Screen name="MainTabs" component={MainTabs} />
        </RootStackNav.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    gap: 12,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default App;
