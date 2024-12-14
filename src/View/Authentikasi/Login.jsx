import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {HandleLogin} from '../../Service/API/Authentikasi/Service_Authentikasi';
import {useAuthStore} from '../../Library/Zustand/AuthStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors, pathScreen} from '../../Constant/Constant';
import {useNavigation} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEye, faEyeSlash, faLock, faUser} from '@fortawesome/free-solid-svg-icons';
import logo from '../../Assets/Image/logos.png';
const Login = () => {
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State untuk mengatur visibilitas password
  const {user, setUser} = useAuthStore();
  const navigate = useNavigation();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const getToken = async () => {
    try {
      const tokenString = await AsyncStorage.getItem('token');
      const token = tokenString ? JSON.parse(tokenString) : null;
      setToken(token);
    } catch (error) {
      console.log('Error mengambil token:', error);
    }
  };

  const saveToken = async tokenData => {
    try {
      await AsyncStorage.setItem('token', JSON.stringify(tokenData));
    } catch (error) {
      console.error('Error menyimpan token:', error);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    if (token !== null) {
      navigate.reset({
        index: 0,
        routes: [{name: pathScreen.Home}],
      });
    }
  }, [token]);

  const HandleLogins = async () => {
    try {
      if (nim === '' || password === '') {
        showMessage({
          message: 'Username atau password tidak boleh kosong',
          type: 'info',
          icon: 'danger',
          position: 'bottom',
        });
        return;
      }
      setLoading(true);
      const response = await HandleLogin(nim, password);
      showMessage({
        message: response.message,
        type: 'success',
        icon: 'success',
        position: 'bottom',
      });

      setUser(response.data);

      saveToken(response.data.token);

      navigate.reset({
        index: 0,
        routes: [{name: pathScreen.Home}],
      });
    } catch (error) {
      showMessage({
        message:
          error.response?.data.message ||
          'Gagal terhubung ke server , coba lagi',
        type: 'danger',
        icon: 'danger',
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
      }}>
      <StatusBar barStyle="dark-content" backgroundColor={'#f5f5f5'} />
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 40,
        }}>
        <Image source={logo} style={{width: 100, height: 100}} />
        <View>
          <View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '900',

                color: 'black',
              }}>
              Meter<Text style={{color: Colors.green}}> Reader Apps</Text>
            </Text>
          </View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              marginBottom: 30,
              color: 'black',
            }}>
            Silahkan Login
          </Text>
        </View>
      </View>

      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 8,
          backgroundColor: '#fff',
          marginBottom: 20,
        }}>
        <View style={{paddingLeft: 10}}>
          <FontAwesomeIcon icon={faUser} size={20} color={Colors.green} />
        </View>
        <TextInput
          placeholder="NIM"
          value={nim}
          placeholderTextColor={'#ccc'}
          onChangeText={text => setNim(text)}
          style={{
            flex: 1,
            height: 50,
            paddingLeft: 15,
            color: 'black',
          }}
        />
      </View>

      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 8,
          backgroundColor: '#fff',
          marginBottom: 30,
        }}>
        <View style={{paddingLeft: 10}}>
          <FontAwesomeIcon icon={faLock} size={20} color={Colors.green} />
        </View>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry={!showPassword}
          placeholderTextColor={'#ccc'}
          style={{
            flex: 1,
            height: 50,
            paddingLeft: 15,
            color: 'black',
          }}
        />
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setShowPassword(!showPassword)}
          style={{
            paddingHorizontal: 10,
          }}>
          <Text
            style={{color: showPassword ? '#4CAF50' : '#ccc', marginRight: 10}}>
            {showPassword ? (
              <FontAwesomeIcon icon={faEye} size={24} color={Colors.green} />
            ) : (
              <FontAwesomeIcon icon={faEyeSlash} size={24} color={Colors.green} />
            )}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        disabled={loading}
        style={{
          width: '100%',
          height: 50,
          backgroundColor: Colors.green,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8,
        }}
        onPress={() => {
          HandleLogins();
        }}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{color: '#fff', fontWeight: '900'}}>Masuk</Text>
        )}
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 14,
          fontWeight: 'bold',

          fontStyle: 'italic',
          marginTop: 10,
          color: 'black',
        }}>
        Versi 1.0
      </Text>
    </View>
  );
};

export default Login;
