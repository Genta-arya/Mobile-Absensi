import axios from 'axios';
import { API_URL } from '../Constant/Constant';

export const AxiosConfig = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-type': 'application/json',
  },
});
