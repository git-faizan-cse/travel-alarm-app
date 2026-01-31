import { Alert, Vibration } from "react-native";
import { Audio } from "expo-av";

let sound: Audio.Sound | null = null;

export const triggerAlarm = async () => {
  try {
    // vibrate
    Vibration.vibrate([500, 500, 500, 500]);

    // load sound
    const { sound: playback } = await Audio.Sound.createAsync(
      require("../../assets/sounds/alarm.mp3"),
      { shouldPlay: true, isLooping: true },
    );

    sound = playback;

    Alert.alert("🚨 You are near your destination!", "Tap OK to stop alarm", [
      {
        text: "Stop",
        onPress: stopAlarm,
      },
    ]);
  } catch (e) {
    console.log("Alarm error:", e);
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
