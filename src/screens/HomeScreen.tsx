import { useEffect, useState } from "react";
import { StyleSheet, Keyboard, ImageBackground, View } from "react-native";

import {
  Surface,
  IconButton,
  Text,
  Card,
  Button,
  TextInput as PaperInput,
} from "react-native-paper";

import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { startLocationTracking } from "../services/LocationService";
import {
  startBackgroundTracking,
  setBackgroundCallback,
} from "../services/BackgroundLocationService";
import { triggerAlarm } from "../services/AlarmService";
import { getDistance } from "../utils/distance";
import { Coordinates } from "../types/location";
import { Pressable } from "react-native";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const [location, setLocation] = useState<Coordinates | null>(null);
  const [destination, setDestination] = useState<Coordinates | null>(null);

  const [alertDistance, setAlertDistance] = useState("");
  const [alarmTriggered, setAlarmTriggered] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  /* ------------------ LOAD SAVED DISTANCE ------------------ */
  useEffect(() => {
    const loadDistance = async () => {
      const saved = await AsyncStorage.getItem("ALERT_DISTANCE");
      setAlertDistance(saved || "0.5");
    };

    loadDistance();
  }, []);

  /* ------------------ LOCATION TRACKING ------------------ */
  useEffect(() => {
    startLocationTracking(setLocation, setErrorMsg);

    setBackgroundCallback(setLocation);
    startBackgroundTracking();
  }, []);

  /* ------------------ GET DESTINATION FROM MAP ------------------ */
  useEffect(() => {
    if (route.params?.destination) {
      setDestination(route.params.destination);
      setAlarmTriggered(false);
    }
  }, [route.params]);

  /* ------------------ ALARM LOGIC ------------------ */
  useEffect(() => {
    if (!location || !destination || alarmTriggered) return;

    const distance = getDistance(
      location.latitude,
      location.longitude,
      destination.latitude,
      destination.longitude,
    );

    if (distance <= Number(alertDistance)) {
      setAlarmTriggered(true);
      triggerAlarm();
    }
  }, [location, destination]);

  /* ------------------ UI ------------------ */
  return (
    <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require("../../assets/images/bg.png")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        {/* 🔥 Floating Header */}
        <Surface style={styles.floatingHeader} elevation={4}>
          <Text style={styles.headerTitle}>📍 Travel Alarm</Text>

          <IconButton
            icon="crosshairs-gps"
            size={24}
            onPress={() => navigation.navigate("Map")}
          />
        </Surface>

        {/* 🔥 Main Content */}
        <Surface style={styles.container} elevation={0}>
          <View style={styles.contentCenter}>
            {/* Distance Input */}
            <Text style={styles.inputLabel}>Alert Distance (km)</Text>

            <PaperInput
              mode="outlined"
              style={{ width: "85%", alignSelf: "center" }}
              keyboardType="numeric"
              value={alertDistance}
              onChangeText={async (value) => {
                setAlertDistance(value);
                await AsyncStorage.setItem("ALERT_DISTANCE", value);
              }}
            />

            {/* Info Card */}
            <Card style={styles.card}>
              <Card.Content>
                {location ? (
                  <>
                    <Text style={styles.label}>Latitude</Text>
                    <Text style={styles.value}>
                      {location.latitude.toFixed(4)}
                    </Text>

                    <Text style={styles.label}>Longitude</Text>
                    <Text style={styles.value}>
                      {location.longitude.toFixed(4)}
                    </Text>

                    {destination && (
                      <>
                        <Text style={styles.label}>Distance</Text>
                        <Text style={styles.distanceValue}>
                          {getDistance(
                            location.latitude,
                            location.longitude,
                            destination.latitude,
                            destination.longitude,
                          ).toFixed(2)}{" "}
                          km
                        </Text>
                      </>
                    )}
                  </>
                ) : (
                  <Text>Getting location...</Text>
                )}

                {errorMsg ? <Text>{errorMsg}</Text> : null}
              </Card.Content>
            </Card>

            {/* Button */}
            <Button mode="contained" onPress={() => navigation.navigate("Map")}>
              Select Destination on Map
            </Button>
          </View>
        </Surface>

        {/* 🔥 Footer */}
        <Surface style={styles.footer} elevation={6}>
          <IconButton
            icon="crosshairs-gps"
            onPress={() => navigation.navigate("Map")}
          />

          <IconButton
            icon="cog-outline"
            onPress={() => console.log("Settings later")}
          />
        </Surface>
      </ImageBackground>
    </Pressable>
  );
}

/* ------------------ STYLES ------------------ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 90,

    justifyContent: "center", // ⭐ centers vertically
  },

  /* Floating header */
  floatingHeader: {
    marginTop: 14,
    marginHorizontal: 16,
    borderRadius: 22,
    height: 56,
    paddingHorizontal: 16,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: "rgba(255,255,255,0.95)",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },

    elevation: 8,
  },

  footer: {
    position: "absolute",
    bottom: 16,
    left: 20,
    right: 20,

    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",

    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.95)",

    paddingVertical: 6,

    elevation: 10,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },

  card: {
    borderRadius: 18,
    marginVertical: 16,
    elevation: 3,
  },

  buttonWrapper: {
    marginTop: 10,
  },

  label: {
    fontSize: 12,
    color: "#888",
    marginTop: 10,
  },

  value: {
    fontSize: 18,
    fontWeight: "600",
  },

  distanceValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2e86de",
    marginTop: 6,
  },

  inputLabel: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 6,
  },

  contentCenter: {
    justifyContent: "center",
    flex: 1,
    gap: 18,
  },
});
