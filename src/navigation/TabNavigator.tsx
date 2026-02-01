import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { IconButton } from "react-native-paper";

import HomeScreen from "../screens/HomeScreen";
import TrackingScreen from "../screens/TrackingScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 6,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <IconButton icon="home-variant" iconColor={color} size={24} />
          ),
        }}
      />

      <Tab.Screen
        name="Tracking"
        component={TrackingScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <IconButton icon="crosshairs-gps" iconColor={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
