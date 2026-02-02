import { StyleSheet, View } from "react-native";

import MapView, { Marker, Circle, MapPressEvent } from "react-native-maps";
import { Surface, Button, IconButton } from "react-native-paper";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

import { setDestination } from "../services/TrackingService";
import { getAlertRadius } from "../services/TrackingService";

const DEFAULT_DISTANCE = 0.5;

export default function MapScreen() {
  const navigation = useNavigation<any>();
  const [selected, setSelected] = useState(null);
  const [radius, setRadius] = useState(DEFAULT_DISTANCE);

  const confirm = () => {
    if (!selected) return;
    setDestination(selected);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* ✅ back button */}
      <IconButton
        icon="arrow-left"
        style={styles.back}
        onPress={() => navigation.goBack()}
      />
      <MapView
        style={styles.map}
        showsUserLocation
        onPress={(e: MapPressEvent) => setSelected(e.nativeEvent.coordinate)}
      >
        {selected && (
          <>
            <Marker coordinate={selected} />
            <Circle
              center={selected}
              radius={getAlertRadius()}
              strokeColor="#2e86de"
              fillColor="rgba(46,134,222,0.15)"
            />
          </>
        )}
      </MapView>

      {selected && (
        <Surface style={styles.confirmWrapper} elevation={8}>
          <Button
            mode="contained"
            onPress={confirm}
            icon="check"
            contentStyle={{ height: 50 }}
          >
            Confirm Destination
          </Button>
        </Surface>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  back: {
    position: "absolute",
    top: 40,
    left: 10,
    zIndex: 10,
  },

  confirmWrapper: {
    position: "absolute",
    bottom: 120,
    alignSelf: "center",
    width: "85%",
    borderRadius: 24,
  },
});
