import { Alert, Vibration } from "react-native";
import { Audio } from "expo-av";

let sound: Audio.Sound | null = null;

export const triggerAlarm = async () => {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: false,
      playThroughEarpieceAndroid: false,
    });

    Vibration.vibrate([500, 500], true);

    const { sound: playback } = await Audio.Sound.createAsync(
      require("../../assets/sounds/alarm.mp3"),
      { shouldPlay: true, isLooping: true },
    );

    sound = playback;

    Alert.alert("🚨 You are near your destination!", "Tap Stop", [
      { text: "Stop", onPress: stopAlarm },
    ]);
  } catch (e) {
    console.log(e);
  }
};

export const stopAlarm = async () => {
  Vibration.cancel();

  if (sound) {
    await sound.stopAsync();
    await sound.unloadAsync();
    sound = null;
  }
};
