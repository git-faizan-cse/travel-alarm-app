import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { IconButton, Text } from "react-native-paper";
import { View, StyleSheet } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import TrackingScreen from "../screens/TrackingScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerTitleAlign: "center",

        /* ⭐ Native header style */
        headerStyle: {
          backgroundColor: "white",
        },

        headerTitle: () => <Text style={styles.title}>📍 Travel Alarm</Text>,

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

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
