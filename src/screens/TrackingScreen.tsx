import { StyleSheet, View } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import { Surface, Text, Button } from "react-native-paper";
import { useEffect, useState } from "react";

import {
  startTracking,
  stopTracking,
  getTrackingStatus,
  addLocationListener,
  addTrackingStatusListener,
  addDistanceListener,
  getDestination,
  addDestinationListener,
} from "../services/TrackingService";

import { Coordinates } from "../types/location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAlertRadius } from "../services/TrackingService";

export default function TrackingScreen() {
  /* ==============================
     STATE (UI only)
  ============================== */

  const [location, setLocation] = useState<Coordinates | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [isTracking, setIsTracking] = useState(getTrackingStatus());

  const [destination, setDestination] = useState(getDestination());

  /* ==============================
     LISTENERS FROM SERVICE
  ============================== */

  useEffect(() => {
    const unsubLoc = addLocationListener(setLocation);
    const unsubDist = addDistanceListener(setDistance);
    const unsubStatus = addTrackingStatusListener(setIsTracking);
    const unsubDest = addDestinationListener(setDestination);

    return () => {
      unsubLoc();
      unsubDist();
      unsubStatus();
      unsubDest();
    };
  }, []);

  /* ==============================
     TOGGLE
  ============================== */

  const toggleTracking = async () => {
    if (isTracking) stopTracking();
    else await startTracking();
  };

  /* ==============================
     UI
  ============================== */

  return (
    <View style={styles.container}>
      {/* 🔥 Map */}
      <MapView style={styles.map} showsUserLocation>
        {destination && (
          <>
            <Marker coordinate={destination} />
            <Circle
              center={destination}
              radius={getAlertRadius()}
              strokeColor="#2e86de"
              strokeWidth={2}
              fillColor="rgba(46,134,222,0.15)"
            />
          </>
        )}
      </MapView>

      {/* 🔥 Card */}
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
