import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

const useErrorHandler = () => {
  const navigation = useNavigation();

  const handleError = (error, route) => {
    const errorMessage = "Gagal Terhubung ke server. Coba lagi" || 'Terjadi kesalahan';

    if (error.message === 'Network Error') {
      if (route === 'Login') {
        showMessage({
          message: 'Gagal Terhubung ke server. Coba lagi',
          type: 'danger',
          icon: 'danger',
        });
      } else {
        showMessage({
          message: errorMessage,
          type: 'danger',
          icon: 'danger',
        });
        navigation.navigate('Error');
      }
    } else {

      showMessage({
        message: errorMessage,
        type: 'danger',
        icon: 'danger',
      });
      navigation.navigate('Error');
    }
  };

  return handleError;
};

export default useErrorHandler;
