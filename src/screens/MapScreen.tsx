import { StyleSheet, View } from "react-native";
import MapView, { Marker, Circle, MapPressEvent } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Button, Surface } from "react-native-paper";

import Footer from "../components/Footer";
import { Coordinates } from "../types/location";
import { setDestination } from "../services/TrackingService";

export default function MapScreen() {
  const navigation = useNavigation<any>();
  const [selectedLocation, setSelectedLocation] = useState<Coordinates | null>(
    null,
  );

  const handlePress = (event: MapPressEvent) => {
    setSelectedLocation(event.nativeEvent.coordinate);
  };

  const confirmSelection = () => {
    if (!selectedLocation) return;

    setDestination(selectedLocation); // ⭐ save globally
    navigation.goBack(); // ⭐ close map
  };

  const [alertDistance, setAlertDistance] = useState(0.5);

  useEffect(() => {
    const loadDistance = async () => {
      const saved = await AsyncStorage.getItem("ALERT_DISTANCE");
      setAlertDistance(Number(saved || 0.5));
    };

    loadDistance();
  }, []);

  return (
    <View style={styles.container}>
      {/* Fullscreen Map */}
      <MapView style={styles.map} showsUserLocation onPress={handlePress}>
        {selectedLocation && (
          <>
            <Marker coordinate={selectedLocation} />

            <Circle
              center={selectedLocation}
              radius={alertDistance * 1000}
              strokeColor="#2e86de"
              strokeWidth={2}
              fillColor="rgba(46,134,222,0.15)"
            />
          </>
        )}
      </MapView>

      {/* 🔥 Floating Confirm Button */}
      {selectedLocation && (
        <Surface style={styles.confirmWrapper} elevation={8}>
          <Button
            mode="contained"
            icon="check"
            onPress={confirmSelection}
            contentStyle={{ height: 50 }}
          >
            Confirm Destination
          </Button>
        </Surface>
      )}

      {/* Footer stays */}
      {/* <Footer /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  map: { flex: 1 },

  confirmWrapper: {
    position: "absolute",
    bottom: 130, // above footer
    alignSelf: "center",
    width: "85%",
    borderRadius: 24,
  },
});
