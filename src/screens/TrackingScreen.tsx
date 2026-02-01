import { StyleSheet, View } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Surface, Text, Button } from "react-native-paper";

import Footer from "../components/Footer";
import { Coordinates } from "../types/location";
import { useEffect, useState } from "react";
import { startLocationTracking } from "../services/LocationService";
import { getDistance } from "../utils/distance";

export default function TrackingScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const destination: Coordinates | null = route.params?.destination ?? null;
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    startLocationTracking(setLocation, () => {});
  }, []);

  useEffect(() => {
    if (!location || !destination) return;

    const d = getDistance(
      location.latitude,
      location.longitude,
      destination.latitude,
      destination.longitude,
    );

    setDistance(d);
  }, [location]);

  return (
    <View style={styles.container}>
      {/* 🔥 Fullscreen Map */}
      <MapView style={styles.map} showsUserLocation>
        {destination && (
          <>
            <Marker coordinate={destination} />

            {/* radius placeholder (static for now) */}
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

      {/* 🔥 Floating Tracking Card */}
      <Surface style={styles.card} elevation={8}>
        <Text style={styles.title}>📍 Tracking Active</Text>

        <Text style={styles.sub}>Distance Remaining</Text>

        <Text style={styles.distance}>
          {distance ? distance.toFixed(2) + " km" : "--"}
        </Text>

        <Button
          mode="contained"
          style={{ marginTop: 12 }}
          onPress={() => navigation.navigate("Home")}
        >
          Stop Tracking
        </Button>
      </Surface>

      {/* Footer */}
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    flex: 1,
  },

  /* Floating info card */
  card: {
    position: "absolute",
    bottom: 120, // above footer
    alignSelf: "center",
    width: "90%",

    padding: 16,
    borderRadius: 18,

    backgroundColor: "rgba(255,255,255,0.95)",
  },

  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
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
