import { useEffect } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import * as Notifications from "expo-notifications";

import AppNavigator from "./src/navigation/AppNavigator";
import { setupAlarmSystem } from "./src/services/AlarmService"; // ⭐ NEW

/* =================================================
   Notification behavior
================================================= */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    const init = async () => {
      await Notifications.requestPermissionsAsync();

      /* ⭐ THIS IS THE IMPORTANT PART */
      await setupAlarmSystem(); // preload sound + stop action
    };

    init();
  }, []);

  return (
    <PaperProvider>
      <AppNavigator />
    </PaperProvider>
  );
}
