import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";

const TASK_NAME = "BACKGROUND_LOCATION_TASK";

let onUpdateCallback: any = null;

export const setBackgroundCallback = (cb: any) => {
  onUpdateCallback = cb;
};

TaskManager.defineTask(TASK_NAME, ({ data, error }: any) => {
  if (error) return;

  const { locations } = data;

  if (locations?.length && onUpdateCallback) {
    onUpdateCallback(locations[0].coords);
  }
});

export const startBackgroundTracking = async () => {
  const { status } = await Location.requestBackgroundPermissionsAsync();

  if (status !== "granted") return;

  await Location.startLocationUpdatesAsync(TASK_NAME, {
    accuracy: Location.Accuracy.High,
    timeInterval: 5000,
    distanceInterval: 5,
    showsBackgroundLocationIndicator: true,
  });
};

export const stopBackgroundTracking = async () => {
  await Location.stopLocationUpdatesAsync(TASK_NAME);
};
