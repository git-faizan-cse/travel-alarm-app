import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import { startLocationTracking } from "../services/LocationService";
import { triggerAlarm } from "../services/AlarmService";
import { getDistance } from "../utils/distance";
import { TextInput } from "react-native";
// import { ALERT_DISTANCE } from "../constants/config";
import { Coordinates } from "../types/location";
import { Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import {
  startBackgroundTracking,
  setBackgroundCallback,
} from "../services/BackgroundLocationService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [alarmTriggered, setAlarmTriggered] = useState(false);
  const [alertDistance, setAlertDistance] = useState("");

  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const [destination, setDestination] = useState<Coordinates | null>(null);

  useEffect(() => {
    const loadDistance = async () => {
      const saved = await AsyncStorage.getItem("ALERT_DISTANCE");

      if (saved) {
        setAlertDistance(saved);
      } else {
        setAlertDistance("0.5"); // default only first time
      }
    };

    loadDistance();
  }, []);

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

    if (distance <= Number(alertDistance)) {
      setAlarmTriggered(true);
      triggerAlarm();
    }
  }, [location, destination]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.header}>📍 Travel Alarm</Text>

        {/* Alert Distance Input */}
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Alert before (km)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={alertDistance}
            onChangeText={async (value) => {
              setAlertDistance(value);
              await AsyncStorage.setItem("ALERT_DISTANCE", value);
            }}
            onSubmitEditing={Keyboard.dismiss}
            returnKeyType="done"
          />
        </View>

        {/* Info Card */}
        <View style={styles.card}>
          {location ? (
            <>
              <Text style={styles.label}>Latitude</Text>
              <Text style={styles.value}>{location.latitude.toFixed(4)}</Text>

              <Text style={styles.label}>Longitude</Text>
              <Text style={styles.value}>{location.longitude.toFixed(4)}</Text>

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
        </View>

        {/* Button */}
        <View style={styles.buttonWrapper}>
          <Button
            title="Select Destination on Map"
            onPress={() => navigation.navigate("Map")}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    padding: 20,
    justifyContent: "center",
  },

  header: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    elevation: 4,
    marginBottom: 25,
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
    marginTop: 5,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  inputLabel: {
    fontSize: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    width: 80,
    padding: 8,
    textAlign: "center",
    backgroundColor: "#fff",
  },

  buttonWrapper: {
    borderRadius: 10,
    overflow: "hidden",
  },
});
