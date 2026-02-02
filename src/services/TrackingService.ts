import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Coordinates } from "../types/location";
import { getDistance } from "../utils/distance";
import { triggerAlarm, stopAlarm } from "./AlarmService";

/* ================= INTERNAL STATE ================= */

let destination: Coordinates | null = null;
let subscription: Location.LocationSubscription | null = null;

let isTracking = false;
let wasInside = false;
let alertDistance = 0.5;

/* ================= LISTENERS ================= */

let locationListeners: ((c: Coordinates) => void)[] = [];
let distanceListeners: ((d: number | null) => void)[] = [];
let statusListeners: ((s: boolean) => void)[] = [];
let destinationListeners: ((d: Coordinates | null) => void)[] = [];

/* ================= ALERT DISTANCE ================= */

export const getAlertDistance = () => alertDistance;
export const getAlertRadius = () => alertDistance * 1000;

export const setAlertDistance = async (km: number) => {
  alertDistance = km;
  await AsyncStorage.setItem("ALERT_DISTANCE", String(km));
};

const loadAlertDistance = async () => {
  const saved = await AsyncStorage.getItem("ALERT_DISTANCE");
  alertDistance = Number(saved ?? 0.5);
};

/* ================= DESTINATION ================= */

export const setDestination = (coords: Coordinates) => {
  destination = coords;
  wasInside = false;
  destinationListeners.forEach((cb) => cb(destination));
};

export const getDestination = () => destination;

/* ================= LISTENER REG ================= */

export const addLocationListener = (cb: any) => {
  locationListeners.push(cb);
  return () => (locationListeners = locationListeners.filter((l) => l !== cb));
};

export const addDistanceListener = (cb: any) => {
  distanceListeners.push(cb);
  return () => (distanceListeners = distanceListeners.filter((l) => l !== cb));
};

export const addTrackingStatusListener = (cb: any) => {
  statusListeners.push(cb);
  return () => (statusListeners = statusListeners.filter((l) => l !== cb));
};

export const addDestinationListener = (cb: any) => {
  destinationListeners.push(cb);
  return () =>
    (destinationListeners = destinationListeners.filter((l) => l !== cb));
};

/* ================= HELPERS ================= */

const notifyLocation = (c: Coordinates) =>
  locationListeners.forEach((cb) => cb(c));

const notifyDistance = (d: number | null) =>
  distanceListeners.forEach((cb) => cb(d));

const notifyStatus = (s: boolean) => statusListeners.forEach((cb) => cb(s));

/* ================= START ================= */

export const startTracking = async () => {
  if (isTracking) return;

  await loadAlertDistance();

  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") return;

  subscription = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 1000,
      distanceInterval: 5,
    },
    (loc) => {
      const coords = loc.coords;

      notifyLocation(coords);

      if (!destination) return;

      const d = getDistance(
        coords.latitude,
        coords.longitude,
        destination.latitude,
        destination.longitude,
      );

      notifyDistance(d);

      const inside = d <= alertDistance;

      if (inside && !wasInside) triggerAlarm();

      wasInside = inside;
    },
  );

  isTracking = true;
  notifyStatus(true);
};

/* ================= STOP ================= */

export const stopTracking = () => {
  subscription?.remove();
  subscription = null;

  isTracking = false;
  wasInside = false;

  /* ⭐ STOP alarm if playing */
  stopAlarm();

  notifyStatus(false);
  notifyDistance(null);
};

export const getTrackingStatus = () => isTracking;
