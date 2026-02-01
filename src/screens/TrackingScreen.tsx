import { StyleSheet, View } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import { getDestination } from "../services/TrackingService";
import { Surface, Text, Button } from "react-native-paper";
import { useEffect, useState } from "react";

import Footer from "../components/Footer";
import { Coordinates } from "../types/location";
import { getDistance } from "../utils/distance";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  startTracking,
  stopTracking,
  getTrackingStatus,
  addLocationListener,
  addTrackingStatusListener,
} from "../services/TrackingService";
import { useRef } from "react";

export default function TrackingScreen() {
  const destination = getDestination();

  const [location, setLocation] = useState<Coordinates | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [isTracking, setIsTracking] = useState(getTrackingStatus());
  const [alertDistance, setAlertDistance] = useState("");

  useEffect(() => {
    const unsubscribe = addLocationListener(setLocation);

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = addTrackingStatusListener(setIsTracking);

    return unsubscribe;
  }, []);

  /* ---------- calculate distance ---------- */
  useEffect(() => {
    if (!location || !destination) return;

    const d = getDistance(
      location.latitude,
      location.longitude,
      destination.latitude,
      destination.longitude,
    );

    setDistance(d);
  }, [location, destination]);

  /* ---------- LOAD ALERT DISTANCE ---------- */
  useEffect(() => {
    const loadDistance = async () => {
      const saved = await AsyncStorage.getItem("ALERT_DISTANCE");
      setAlertDistance(saved || "0.5");
    };

    loadDistance();
  }, []);

  /* ---------- start/stop toggle ---------- */
  const toggleTracking = async () => {
    if (isTracking) {
      stopTracking();
      setDistance(null);
    } else {
      await startTracking();
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔥 Fullscreen Map */}
      <MapView style={styles.map} showsUserLocation>
        {destination && (
          <>
            <Marker coordinate={destination} />

            <Circle
              center={destination}
              radius={500}
              strokeColor="#2e86de"
              strokeWidth={2}
              fillColor="rgba(46,134,222,0.15)"
            />
          </>
        )}
      </MapView>

      {/* 🔥 Floating Card */}
      <Surface style={styles.card} elevation={8}>
        <Text style={styles.title}>📍 Tracking</Text>

        <Text style={styles.sub}>Distance Remaining</Text>

        <Text style={styles.distance}>
          {distance !== null ? distance.toFixed(2) + " km" : "--"}
        </Text>

        <Button
          mode="contained"
          buttonColor={isTracking ? "#d32f2f" : "#2e7d32"}
          style={{ marginTop: 12 }}
          onPress={toggleTracking}
        >
          {isTracking ? "Stop Tracking" : "Start Tracking"}
        </Button>
      </Surface>

      {/* <Footer /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  card: {
    position: "absolute",
    bottom: 120,
    alignSelf: "center",
    width: "90%",
    padding: 16,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.95)",
  },

  title: {
    fontWeight: "bold",
    fontSize: 16,
  },

  sub: {
    marginTop: 6,
    fontSize: 12,
    color: "#777",
  },

  distance: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 4,
    color: "#2e86de",
  },
});
