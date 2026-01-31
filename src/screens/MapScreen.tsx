import { StyleSheet, View } from "react-native";
import MapView, { Marker, MapPressEvent } from "react-native-maps";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function MapScreen() {
  const navigation = useNavigation<any>();
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const handlePress = (event: MapPressEvent) => {
    const coords = event.nativeEvent.coordinate;

    setSelectedLocation(coords);

    // send destination back
    navigation.navigate("Home", {
      destination: coords,
    });
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} showsUserLocation onPress={handlePress}>
        {selectedLocation && <Marker coordinate={selectedLocation} />}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
