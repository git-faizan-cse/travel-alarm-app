import { ReactNode } from "react";
import {
  StyleSheet,
  Keyboard,
  Pressable,
  ImageBackground,
  View,
} from "react-native";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require("../../assets/images/bg.png")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View style={styles.content}>{children}</View>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 90,
    justifyContent: "center",
  },
});
