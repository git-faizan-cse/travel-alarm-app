import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import { startLocationTracking } from "../services/LocationService";
import { triggerAlarm } from "../services/AlarmService";
import { getDistance } from "../utils/distance";
import { ALERT_DISTANCE } from "../constants/config";
import { Coordinates } from "../types/location";
import { Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import {
  startBackgroundTracking,
  setBackgroundCallback,
} from "../services/BackgroundLocationService";

export default function HomeScreen() {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [alarmTriggered, setAlarmTriggered] = useState(false);

  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const [destination, setDestination] = useState<Coordinates | null>(null);

  // start tracking
  useEffect(() => {
    startLocationTracking(setLocation, setErrorMsg);

    // 🔥 background tracking
    setBackgroundCallback(setLocation);
    startBackgroundTracking();
  }, []);

  // receive destination from map
  useEffect(() => {
    if (route.params?.destination) {
      setDestination(route.params.destination);
      setAlarmTriggered(false);
    }
  }, [route.params]);

  // alarm logic
  useEffect(() => {
    if (!location || !destination || alarmTriggered) return;

    const distance = getDistance(
      location.latitude,
      location.longitude,
      destination.latitude,
      destination.longitude,
    );

    if (distance <= ALERT_DISTANCE) {
      setAlarmTriggered(true);
      triggerAlarm();
    }
  }, [location, destination]);

  return (
    <View style={styles.container}>
      {errorMsg && <Text>{errorMsg}</Text>}

      {location ? (
        <>
          <Text>Latitude: {location.latitude}</Text>
          <Text>Longitude: {location.longitude}</Text>

          {!destination && <Text>Select a destination from map 👇</Text>}

          {destination && (
            <Text style={styles.distance}>
              Distance:{" "}
              {getDistance(
                location.latitude,
                location.longitude,
                destination.latitude,
                destination.longitude,
              ).toFixed(2)}{" "}
              km
            </Text>
          )}
        </>
      ) : (
        <Text>Getting location...</Text>
      )}

      <Button title="Open Map" onPress={() => navigation.navigate("Map")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  distance: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
  },
});
