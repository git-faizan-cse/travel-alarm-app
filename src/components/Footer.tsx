import { StyleSheet } from "react-native";
import { Surface, IconButton } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function Footer() {
  const navigation = useNavigation<any>();
  const route = useRoute();

  const current = route.name;

  return (
    <Surface style={styles.footer} elevation={10}>
      {/* 🏠 Home */}
      <IconButton
        icon="home-variant"
        size={26}
        iconColor={current === "Home" ? "#1976D2" : "#666"}
        onPress={() => navigation.navigate("Home")}
      />

      {/* 📍 Tracking */}
      <IconButton
        icon="crosshairs-gps"
        size={26}
        iconColor={current === "Tracking" ? "#1976D2" : "#666"}
        onPress={() => navigation.navigate("Tracking")}
      />
    </Surface>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 16,
    left: 20,
    right: 20,

    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",

    borderRadius: 24,
    paddingVertical: 6,

    backgroundColor: "rgba(255,255,255,0.95)",

    elevation: 10,
  },
});
