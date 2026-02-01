import { StyleSheet } from "react-native";
import { TextInput as PaperInput, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {
  value: string;
  onChange: (val: string) => void;
};

export default function DistanceInput({ value, onChange }: Props) {
  const handleChange = async (val: string) => {
    onChange(val);
    await AsyncStorage.setItem("ALERT_DISTANCE", val);
  };

  return (
    <>
      <Text style={styles.label}>Alert Distance (km)</Text>

      <PaperInput
        mode="outlined"
        keyboardType="numeric"
        value={value}
        onChangeText={handleChange}
        style={styles.input}
      />
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 6,
  },

  input: {
    alignSelf: "center",
    width: "85%",
  },
});
