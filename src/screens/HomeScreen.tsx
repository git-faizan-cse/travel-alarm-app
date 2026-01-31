import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import { startLocationTracking } from "../services/LocationService";
import { triggerAlarm } from "../services/AlarmService";
import { getDistance } from "../utils/distance";
import { DESTINATION, ALERT_DISTANCE } from "../constants/config";
import { Coordinates } from "../types/location";

export default function HomeScreen() {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [alarmTriggered, setAlarmTriggered] = useState(false);

  useEffect(() => {
    startLocationTracking(setLocation, setErrorMsg);
  }, []);

  useEffect(() => {
    if (!location || alarmTriggered) return;

    const distance = getDistance(
      location.latitude,
      location.longitude,
      DESTINATION.latitude,
      DESTINATION.longitude,
    );

    if (distance <= ALERT_DISTANCE) {
      setAlarmTriggered(true);
      triggerAlarm();
    }
  }, [location]);

  return (
    <View style={styles.container}>
      {errorMsg && <Text>{errorMsg}</Text>}

      {location ? (
        <>
          <Text>Latitude: {location.latitude}</Text>
          <Text>Longitude: {location.longitude}</Text>
          <Text style={styles.distance}>
            Distance:{" "}
            {getDistance(
              location.latitude,
              location.longitude,
              DESTINATION.latitude,
              DESTINATION.longitude,
            ).toFixed(2)}{" "}
            km
          </Text>
        </>
      ) : (
        <Text>Getting location...</Text>
      )}
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
