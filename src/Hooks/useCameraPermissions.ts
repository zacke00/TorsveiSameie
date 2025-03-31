import { useEffect, useState } from "react";
import { Camera } from "expo-camera";

const useCameraPermission = () => {
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        handlePermissionResult(status);
      } catch (error) {
        console.error("Permission check error:", error);
      }
    };

    checkPermission();
  }, []);

  const handlePermissionResult = (status: string) => {
    switch (status) {
      case "granted":
        setPermissionStatus("granted");
        break;
      case "denied":
        setPermissionStatus("denied");
        break;
      default:
        setPermissionStatus("unknown");
    }
  };

  const requestPermission = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setPermissionStatus(status === "granted" ? "granted" : "denied");
    } catch (error) {
      console.error("Permission request error:", error);
    }
  };

  return { permissionStatus, requestPermission };
};

export default useCameraPermission;