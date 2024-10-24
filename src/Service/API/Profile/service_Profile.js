import axios from 'axios';
import {API_URL} from '../../../Constant/Constant';
import {AxiosConfig} from '../../AxiosConfig';

export const updateProfile = async (id, data) => {
    console.log(data)
 
  try {
    const response = await AxiosConfig.put(
      API_URL + `/update/profile/${id}`,
      data,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


export const updateAvatar = async (id, data) => {
  try {
    const response = await axios.put(
      API_URL + `/update/avatar/${id}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}