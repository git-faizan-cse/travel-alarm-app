import * as Location from "expo-location";
import { Coordinates } from "../types/location";

export const startLocationTracking = async (
  onUpdate: (coords: Coordinates) => void,
  onError: (msg: string) => void,
) => {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    onError("Permission denied");
    return;
  }

  await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 3000,
      distanceInterval: 5,
    },
    (loc) => {
      onUpdate(loc.coords);
    },
  );
};
