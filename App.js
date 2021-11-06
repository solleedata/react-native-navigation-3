import React from 'react';
import { Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? 'ios-planet' : 'ios-planet-outline';
            } else if (route.name === 'Community') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            } else if (route.name === 'Calendar') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarBadge: 3 }} />
        <Tab.Screen name="Community" component={CommunityScreen} options={{ tabBarBadge: 5 }} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="HeaderButton" component={StackScreen} options={{ tabBarBadge: 3 }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Home Screen
function HomeScreen({ navigation }) {
  return (
    <View style={center}>
      <Text>Home!</Text>
      <Button title="Go to calendar" onPress={() => navigation.navigate('Calendar')}
      />
    </View>
  );
}

// Community Screen 
function CommunityScreen() {
  return (
    <View style={center}>
      <Text>Community!</Text>
    </View>
  );
}

// Schedules, birthdays, etc. Screen
function CalendarScreen() {
  return (
    <View style={center}>
      <Text>Calendar!</Text>
    </View>
  );
}

// Test Screen with header 
function StackScreen() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="KPOP"
        component={HomeScreen}
      />
    </Stack.Navigator>
  );
}

// react navigation
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


// styling 
const grayBox = {
  boxSizing: "border-box",
  flexShrink: 0,
  width: 80,
  height: 80,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-evenly",
  alignItems: "center",
  padding: "0px 13px 0px 13px",
  backgroundColor: "#e6e6e6",
  overflow: "visible",
  borderRadius: 5,
}
const center = {
  flex: 1, justifyContent: 'center', alignItems: 'center'
}
const screenOptions = {
  headerTitle: props => <Text {...props} />,
  headerStyle: {
    backgroundColor: '#e6e6e6',
  },
  headerRight: () => (
    <Button
      onPress={() => alert('This is a button!')}
      title="Info"
      color="#000000"
    />
  ),
}