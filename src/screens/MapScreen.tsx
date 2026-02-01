import { StyleSheet, View } from "react-native";
import MapView, { Marker, MapPressEvent } from "react-native-maps";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Button, Surface } from "react-native-paper";

import Footer from "../components/Footer";
import { Coordinates } from "../types/location";

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

    navigation.navigate("Home", {
      destination: selectedLocation,
    });
  };

  return (
    <View style={styles.container}>
      {/* Fullscreen Map */}
      <MapView style={styles.map} showsUserLocation onPress={handlePress}>
        {selectedLocation && <Marker coordinate={selectedLocation} />}
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
      <Footer />
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
