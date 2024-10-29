import NetWrokError from "../Assets/Image/NetworkError.png"





// export const API_URL = 'https://dev-absensi.hkks.shop/api/v1';
export const API_URL = 'http://192.168.1.30:3008/api/v1';

// export const API_URL = 'http://192.168.40.152:3008/api/v1';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
export const Endpoint = {
  Login: `${API_URL}/login`,
  Session: `${API_URL}/session`,
  Logout: `${API_URL}/logout`,
};



export const Icons = {
  FontAwesome5: FontAwesome5,
}


export const Colors = {
  red: '#b9c1c',
  green: '#15803d',
  grey: '#374151',
  blue: '#1e40af',
  primary: '#001238',
  white: '#f5f5f5',
};

export const pathScreen = {
  Login: 'Login',
  Home: 'Home',
  Profile: 'Profile',
  ListGrups : "ListGrup",
  ListAgenda : "ListAgenda",
}

export const images = {
  ErrorNetwork : NetWrokError
}