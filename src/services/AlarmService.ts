import { Alert, Vibration } from "react-native";
import { Audio } from "expo-av";

let sound: Audio.Sound | null = null;
let isPlaying = false;

/* ---------- Trigger ---------- */
export const triggerAlarm = async () => {
  try {
    /* ⭐ prevent stacking multiple alarms */
    if (isPlaying) return;

    isPlaying = true;

    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: false,
    });

    Vibration.vibrate([500, 500], true);

    const { sound: playback } = await Audio.Sound.createAsync(
      require("../../assets/sounds/alarm.mp3"),
      { shouldPlay: true, isLooping: true },
    );

    sound = playback;

    Alert.alert("🚨 You are near your destination!", "Tap Stop", [
      {
        text: "Stop",
        onPress: () => {
          stopAlarm(); // ⭐ guaranteed stop
        },
      },
    ]);
  } catch (e) {
    console.log(e);
  }
};

/* ---------- Stop ---------- */
export const stopAlarm = async () => {
  try {
    Vibration.cancel();

    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      sound = null;
    }

    isPlaying = false;
  } catch (e) {
    console.log(e);
  }
};
