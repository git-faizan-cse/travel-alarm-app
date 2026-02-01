import { StyleSheet, View, Button } from "react-native";
import MapView, { Marker, MapPressEvent } from "react-native-maps";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Coordinates } from "../types/location";
import Footer from "../components/Footer";

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
      <MapView style={styles.map} showsUserLocation onPress={handlePress}>
        {selectedLocation && <Marker coordinate={selectedLocation} />}
      </MapView>

      {selectedLocation && (
        <View style={styles.buttonContainer}>
          <Button title="Confirm Destination" onPress={confirmSelection} />
        </View>
      )}

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  buttonContainer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    width: "80%",
  },
});
