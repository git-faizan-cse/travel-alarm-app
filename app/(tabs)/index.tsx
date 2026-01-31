import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Location from "expo-location";

const DESTINATION = {
  latitude: 30.7333,
  longitude: 76.7794,
};

const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      setErrorMsg("Permission denied");
      return;
    }

    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
  };

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
