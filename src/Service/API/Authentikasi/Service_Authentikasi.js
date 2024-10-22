import AsyncStorage from '@react-native-async-storage/async-storage';
import {Endpoint} from '../../../Constant/Constant';
import {AxiosConfig} from '../../AxiosConfig';

export const HandleLogin = async (username, password) => {
  try {
    const response = await AxiosConfig.post(Endpoint.Login, {
      nim: username,
      password: password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CheckSession = async token => {
  try {
    const response = await AxiosConfig.post(Endpoint.Session, {
      token: token,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
