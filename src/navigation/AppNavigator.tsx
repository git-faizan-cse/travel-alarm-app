import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { IconButton, Text } from "react-native-paper";
import { StyleSheet } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import TrackingScreen from "../screens/TrackingScreen";
import MapScreen from "../screens/MapScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/* =================================================
   TABS (with HEADER ⭐)
================================================= */

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        /* ✅ ENABLE header */
        headerShown: true,

        headerTitleAlign: "center",

        headerStyle: {
          backgroundColor: "white",
        },

        headerTitle: () => <Text style={styles.title}>SleepEasy (faizan)</Text>,

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

/* =================================================
   ROOT STACK
================================================= */

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Tabs */}
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />

        {/* Map with native back button */}
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{
            title: "Select Destination",
            headerBackTitleVisible: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
