import { useState, useCallback, useEffect } from 'react';
import { Permission, Platform, PermissionsAndroid } from 'react-native';

async function hasPerm(permission: Permission) {
  if (Platform.OS !== 'android') {
    return true;
  }

  if (await PermissionsAndroid.check(permission)) {
    return true;
  }

  const status = await PermissionsAndroid.request(permission);
  return status === 'granted';
}

export const useExternalStoragePermission = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const requestPermissions = useCallback(() => {
    async function _checkAndroidPermission() {
      return await hasPerm(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
    }

    _checkAndroidPermission().then((response) => {
      setHasPermission(response.valueOf());
    });
  }, []);

  useEffect(() => {
    requestPermissions();
  }, [requestPermissions]);

  return { hasPermission };
};
