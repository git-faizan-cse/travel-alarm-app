import { ReactNode } from "react";
import {
  StyleSheet,
  Keyboard,
  Pressable,
  ImageBackground,
  View,
} from "react-native";
import { Surface, Text, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import Footer from "./Footer";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  const navigation = useNavigation<any>();

  return (
    <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require("../../assets/images/bg.png")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        {/* 🔥 Floating Header */}
        <Surface style={styles.header} elevation={8}>
          <Text style={styles.title}>📍 Travel Alarm</Text>

          <IconButton
            icon="crosshairs-gps"
            size={24}
            onPress={() => navigation.navigate("Map")}
          />
        </Surface>

        {/* 🔥 Screen Content */}
        <View style={styles.content}>{children}</View>

        {/* 🔥 Footer */}
        <Footer />
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 14,
    marginHorizontal: 16,
    borderRadius: 22,
    height: 56,
    paddingHorizontal: 16,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: "rgba(255,255,255,0.95)",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 90,
    justifyContent: "center",
  },
});
