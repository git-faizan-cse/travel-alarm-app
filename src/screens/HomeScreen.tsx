import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Layout from "../components/Layout";
import DistanceInput from "../components/DistanceInput";
import InfoCard from "../components/InfoCard";

import {
  startTracking,
  stopTracking,
  getTrackingStatus,
  addLocationListener,
  addTrackingStatusListener,
  addDistanceListener,
  addDestinationListener,
  getDestination,
  setAlertDistance as setAlertDistanceService,
} from "../services/TrackingService";

import { Coordinates } from "../types/location";

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  /* ================= STATE ================= */

  const [location, setLocation] = useState<Coordinates | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [isTracking, setIsTracking] = useState(getTrackingStatus());
  const [alertDistance, setAlertDistance] = useState("0.5");

  // ⭐ immediate initial destination (important)
  const [destination, setDestination] = useState<Coordinates | null>(
    getDestination(),
  );

  /* ================= LOAD SAVED DISTANCE ================= */

  useEffect(() => {
    AsyncStorage.getItem("ALERT_DISTANCE").then((v) => {
      const val = v ?? "0.5";
      setAlertDistance(val);
      setAlertDistanceService(Number(val));
    });
  }, []);

  /* ================= LISTENERS ================= */

  useEffect(() => addDestinationListener(setDestination), []);

  useEffect(() => {
    const unsubLoc = addLocationListener(setLocation);
    const unsubDist = addDistanceListener(setDistance);
    const unsubStatus = addTrackingStatusListener(setIsTracking);

    return () => {
      unsubLoc();
      unsubDist();
      unsubStatus();
    };
  }, []);

  // for android phones as alarm was not working
  useEffect(() => {
    let sub: Location.LocationSubscription;

    const start = async () => {
      const fg = await Location.requestForegroundPermissionsAsync();
      if (fg.status !== "granted") return;

      const bg = await Location.requestBackgroundPermissionsAsync();
      if (bg.status !== "granted") return;

      sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 3000,
          distanceInterval: 3,
        },
        (loc) => {
          if (!getTrackingStatus()) setLocation(loc.coords);
        },
      );
    };

    start();
    return () => sub?.remove();
  }, []);

  /* ================= LIGHTWEIGHT PREVIEW LOCATION ================= */

  // useEffect(() => {
  //   let sub: Location.LocationSubscription;

  //   const start = async () => {
  //     const { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") return;

  //     sub = await Location.watchPositionAsync(
  //       {
  //         accuracy: Location.Accuracy.Low,
  //         timeInterval: 3000,
  //         distanceInterval: 3,
  //       },
  //       (loc) => {
  //         if (!getTrackingStatus()) setLocation(loc.coords);
  //       },
  //     );
  //   };

  //   start();
  //   return () => sub?.remove();
  // }, []);

  /* ================= TOGGLE ================= */

  const toggleTracking = async () => {
    if (isTracking) stopTracking();
    else await startTracking();
  };

  /* ================= UI ================= */

  return (
    <Layout>
      <View style={styles.contentCenter}>
        <DistanceInput
          value={alertDistance}
          onChange={(v) => {
            setAlertDistance(v);
            setAlertDistanceService(Number(v));
          }}
        />

        <InfoCard
          location={location}
          destination={destination}
          distance={distance}
        />

        <Button
          mode="contained"
          disabled={isTracking}
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

const styles = StyleSheet.create({
  contentCenter: {
    flex: 1,
    justifyContent: "center",
    gap: 18,
  },
});
