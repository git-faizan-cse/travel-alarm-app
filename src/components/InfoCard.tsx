import { StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import { getDistance } from "../utils/distance";
import { Coordinates } from "../types/location";

type Props = {
  location: Coordinates | null;
  destination: Coordinates | null;
  errorMsg?: string;
};

export default function InfoCard({ location, destination, errorMsg }: Props) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        {location ? (
          <>
            <Text style={styles.label}>Latitude</Text>
            <Text style={styles.value}>{location.latitude.toFixed(4)}</Text>

            <Text style={styles.label}>Longitude</Text>
            <Text style={styles.value}>{location.longitude.toFixed(4)}</Text>

            {destination && (
              <>
                <Text style={styles.label}>Distance</Text>
                <Text style={styles.distance}>
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

        {errorMsg ? <Text>{errorMsg}</Text> : null}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    marginVertical: 16,
    elevation: 3,
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

  distance: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2e86de",
    marginTop: 6,
  },
});
