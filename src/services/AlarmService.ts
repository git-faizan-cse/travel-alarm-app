import { Vibration } from "react-native";
import { Audio } from "expo-av";
import * as Notifications from "expo-notifications";

let sound: Audio.Sound | null = null;
let isPlaying = false;

const STOP_ACTION = "STOP_ALARM";

/* =================================================
   🔥 ONE-TIME SETUP (call once in App.tsx)
================================================= */

export const setupAlarmSystem = async () => {
  // permission
  await Notifications.requestPermissionsAsync();

  // category with STOP button
  await Notifications.setNotificationCategoryAsync("ALARM_CATEGORY", [
    {
      identifier: STOP_ACTION,
      buttonTitle: "Stop Alarm",
      options: { isDestructive: true },
    },
  ]);

  // preload sound (VERY IMPORTANT ⭐)
  const { sound: preload } = await Audio.Sound.createAsync(
    require("../../assets/sounds/alarm.mp3"),
  );

  sound = preload;

  // listen for STOP
  Notifications.addNotificationResponseReceivedListener((response) => {
    if (response.actionIdentifier === STOP_ACTION) {
      stopAlarm();
    }
  });
};

/* =================================================
   🚨 TRIGGER
================================================= */

export const triggerAlarm = async () => {
  try {
    if (isPlaying) return;

    isPlaying = true;

    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: false,
    });

    /* 🔊 instant play (no loading now) */
    await sound?.setIsLoopingAsync(true);
    await sound?.replayAsync();

    /* 📳 vibration */
    Vibration.vibrate([500, 500], true);

    /* 🔔 notification */
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🚨 Travel Alarm",
        body: "You are near your destination!",
        categoryIdentifier: "ALARM_CATEGORY",
        priority: Notifications.AndroidNotificationPriority.MAX,
        sticky: true,
      },
      trigger: null,
    });
  } catch (e) {
    console.log(e);
  }
};

/* =================================================
   🛑 STOP
================================================= */

export const stopAlarm = async () => {
  try {
    Vibration.cancel();

    await sound?.stopAsync();

    isPlaying = false;

    await Notifications.dismissAllNotificationsAsync();
  } catch (e) {
    console.log(e);
  }
};
