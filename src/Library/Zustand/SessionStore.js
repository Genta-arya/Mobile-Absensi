import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage} from 'react-native-flash-message';
import {CheckSession} from '../../Service/API/Authentikasi/Service_Authentikasi';
import {pathScreen} from '../../Constant/Constant';

const useUserStore = create(set => ({
  isFetching: false,
  hasError: false,
  errorMessage: null,

  fetchData: async (navigation, setUser, route, handleError) => {
    const tokenString = await AsyncStorage.getItem('token');
    const token = tokenString ? JSON.parse(tokenString) : null;
    set({isFetching: true, hasError: false, errorMessage: null});

    try {
      const response = await CheckSession(token);
      if (route === 'Error') {
        navigation.navigate(pathScreen.Home);
      }
      setUser(response.data);
    

      if (response.data.name === null) {
        navigation.navigate(pathScreen.Profile);
      } else {
        if (response.data.role === 'MHS') {
          navigation.navigate(pathScreen.Home);
        } else {
          navigation.navigate('webview');
        }
      }
    } catch (error) {
      console.log(error.response);

      if (error.response.status === 401) {
        await AsyncStorage.removeItem('token');
        setUser(null);
        navigation.navigate(pathScreen.Login);
      } else if (error.status === 404) {
        console.log(error.response.data);
      } else {
        handleError(error, route);
        showMessage({
          message: 'Gagal Terhubung keserver. Coba lagi',
          type: 'danger',
          icon: 'danger',
        });
        await AsyncStorage.removeItem('token');
        setUser(null);
        navigation.navigate(pathScreen.Login);
      }
    } finally {
      set({isFetching: false});
    }
  },
}));

export default useUserStore;
