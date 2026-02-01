import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";

import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { triggerAlarm } from "../services/AlarmService";
import { getDistance } from "../utils/distance";

import { Coordinates } from "../types/location";

import Layout from "../components/Layout";
import DistanceInput from "../components/DistanceInput";
import InfoCard from "../components/InfoCard";
import {
  startTracking,
  stopTracking,
  getTrackingStatus,
  addLocationListener,
  addTrackingStatusListener,
} from "../services/TrackingService";
import { setDestination, getDestination } from "../services/TrackingService";
import * as Location from "expo-location";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const [location, setLocation] = useState<Coordinates | null>(null);
  const [destination, setDestinationState] = useState(getDestination());

  const [alertDistance, setAlertDistance] = useState("");
  const [alarmTriggered, setAlarmTriggered] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [isTracking, setIsTracking] = useState(getTrackingStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      setDestinationState(getDestination());
    }, 300);

    return () => clearInterval(interval);
  }, []);

  /* ---------- RESET ALARM WHEN TRACKING CHANGES ---------- */
  useEffect(() => {
    const unsubscribe = addLocationListener(setLocation);

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = addTrackingStatusListener(setIsTracking);

    return unsubscribe;
  }, []);

  /* ------------------ LIGHTWEIGHT LIVE LOCATION (Home only) ------------------ */

  useEffect(() => {
    let subscription: Location.LocationSubscription;

    const startLightTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Low, // ⭐ lighter than Balanced
          timeInterval: 3000, // faster refresh
          distanceInterval: 3, // update even small moves
        },
        (loc) => {
          setLocation(loc.coords);
        },
      );
    };

    startLightTracking();

    return () => subscription?.remove();
  }, []);

  // useEffect(() => {
  //   let subscription: Location.LocationSubscription;

  //   const startLightTracking = async () => {
  //     const { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") return;

  //     subscription = await Location.watchPositionAsync(
  //       {
  //         accuracy: Location.Accuracy.Balanced, // ⭐ low battery
  //         timeInterval: 10000, // every 10s
  //         distanceInterval: 20, // or 20m
  //       },
  //       (loc) => {
  //         // ONLY update if not tracking
  //         if (!getTrackingStatus()) {
  //           setLocation(loc.coords);
  //         }
  //       },
  //     );
  //   };

  //   startLightTracking();

  //   return () => {
  //     subscription?.remove();
  //   };
  // }, []);

  /* ------------------ LOAD SAVED DISTANCE ------------------ */
  useEffect(() => {
    const loadDistance = async () => {
      const saved = await AsyncStorage.getItem("ALERT_DISTANCE");
      setAlertDistance(saved || "0.5");
    };

    loadDistance();
  }, []);

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

  const toggleTracking = async () => {
    if (isTracking) {
      stopTracking();
      setAlarmTriggered(false);
    } else {
      setAlarmTriggered(false);
      await startTracking();
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <Layout>
      <View style={styles.contentCenter}>
        {/* Distance Input */}
        <DistanceInput value={alertDistance} onChange={setAlertDistance} />

        {/* Info Card */}
        <InfoCard
          location={location}
          destination={destination}
          errorMsg={errorMsg}
        />

        <Button
          mode="contained"
          disabled={isTracking} // 🔒 lock while tracking
          onPress={() => navigation.navigate("Map")}
        >
          Select Destination
        </Button>
        <Button
          mode="contained"
          buttonColor={isTracking ? "#d32f2f" : "#2e7d32"}
          style={{ marginTop: 10 }}
          disabled={!destination}
          onPress={toggleTracking}
        >
          {isTracking ? "Stop Tracking" : "Start Tracking"}
        </Button>
      </View>
    </Layout>
  );
}

/* ------------------ STYLES ------------------ */

const styles = StyleSheet.create({
  contentCenter: {
    flex: 1,
    justifyContent: "center",
    gap: 18,
  },
});
