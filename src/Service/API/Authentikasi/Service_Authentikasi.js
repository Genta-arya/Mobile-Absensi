import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL, Endpoint} from '../../../Constant/Constant';
import {AxiosConfig} from '../../AxiosConfig';
import axios from 'axios';

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



export const HandleLogout = async (id) => {

  try {
    const response = await axios.post(API_URL + `/logout`,{
      id: id
    });
    return response.data;
    
  } catch (error) {
    console.log(error);
    throw error;
  }
}