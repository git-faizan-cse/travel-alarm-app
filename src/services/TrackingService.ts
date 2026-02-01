import * as Location from "expo-location";
import { Coordinates } from "../types/location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDistance } from "../utils/distance";
import { triggerAlarm } from "./AlarmService";

let destination: Coordinates | null = null;
let subscription: Location.LocationSubscription | null = null;

let locationListeners: ((coords: Location.LocationObjectCoords) => void)[] = [];
let statusListeners: ((status: boolean) => void)[] = [];

let isTracking = false;
let wasInside = false;

/* ---------- Destination ---------- */
export const setDestination = (coords: Coordinates) => {
  destination = coords;
};

export const getDestination = () => destination;

/* ---------- Listeners ---------- */
export function addLocationListener(cb: any) {
  locationListeners.push(cb);
  return () => {
    locationListeners = locationListeners.filter((l) => l !== cb);
  };
}

export function addTrackingStatusListener(cb: any) {
  statusListeners.push(cb);
  return () => {
    statusListeners = statusListeners.filter((l) => l !== cb);
  };
}

function notifyStatus(status: boolean) {
  statusListeners.forEach((cb) => cb(status));
}

/* ---------- Start ---------- */
export const startTracking = async () => {
  if (isTracking) return;

  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") return;

  const saved = await AsyncStorage.getItem("ALERT_DISTANCE");
  const alertDistance = Number(saved || 0.5);

  subscription = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 3000,
      distanceInterval: 5,
    },
    (loc) => {
      const coords = loc.coords;

      /* notify UI */
      locationListeners.forEach((cb) => cb(coords));

      /* ⭐ alarm logic INSIDE SERVICE */
      if (destination) {
        const d = getDistance(
          coords.latitude,
          coords.longitude,
          destination.latitude,
          destination.longitude,
        );

        const inside = d <= alertDistance;

        if (inside && !wasInside) {
          triggerAlarm();
        }

        wasInside = inside;
      }
    },
  );

  isTracking = true;
  notifyStatus(true);
};

/* ---------- Stop ---------- */
export const stopTracking = () => {
  subscription?.remove();
  subscription = null;

  isTracking = false;
  wasInside = false;

  notifyStatus(false);
};

export const getTrackingStatus = () => isTracking;
