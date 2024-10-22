import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

export const requestCameraPermission = async () => {
  const result = await check(PERMISSIONS.ANDROID.CAMERA);
  if (result !== RESULTS.GRANTED) {
    const requestResult = await request(PERMISSIONS.ANDROID.CAMERA);
    return requestResult === RESULTS.GRANTED;
  }
  return true;
};
