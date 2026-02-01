import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";

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

import Layout from "../components/Layout";
import DistanceInput from "../components/DistanceInput";
import InfoCard from "../components/InfoCard";

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

        <Button mode="contained" onPress={() => navigation.navigate("Map")}>
          Select Destination on Map
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
