/**
 * Sample React Native App with Bottom Tab Navigation
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, useColorScheme, View, Text } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

// Tab Screens
function HomeScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>Home</Text>
    </View>
  );
}

function SearchScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>Search</Text>
    </View>
  );
}

function AddScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>Add</Text>
    </View>
  );
}

function NotificationScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>Notifications</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>Profile</Text>
    </View>
  );
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: '#999',
            tabBarLabelStyle: { fontSize: 12, marginTop: 0 },
          }}>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarLabel: 'Home',
            }}
          />
          <Tab.Screen
            name="Search"
            component={SearchScreen}
            options={{
              tabBarLabel: 'Search',
            }}
          />
          <Tab.Screen
            name="Add"
            component={AddScreen}
            options={{
              tabBarLabel: 'Add',
            }}
          />
          <Tab.Screen
            name="Notifications"
            component={NotificationScreen}
            options={{
              tabBarLabel: 'Notifications',
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              tabBarLabel: 'Profile',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default App;
