import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  Linking,
  StatusBar,
} from 'react-native';
import React, {useState} from 'react';
import {useAuthStore} from '../../Library/Zustand/AuthStore';
import Container from '../../Components/Container';
import Icon from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {requestCameraPermission} from '../../Library/Permisions/CameraPermission';
import {useModalStore} from '../../Library/Zustand/modalStore';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

import {showMessage} from 'react-native-flash-message';
import {HandleLogout} from '../../Service/API/Authentikasi/Service_Authentikasi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import useErrorHandler from '../../Hooks/useErrorHandler';
import ModalProfile from './component/ModalProfile';
import {updateAvatar} from '../../Service/API/Profile/service_Profile';
import Loading from '../../Components/Loading';

const ProfileScreen = () => {
  const {user, setUser} = useAuthStore();
  const navigate = useNavigation();
  const {onOpen, onClose, isOpen} = useModalStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAvatar, setModalAvatar] = useState(false);
  const [nama, setNama] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [previewImage, setPreviewImage] = useState(user?.avatar); // Untuk menampung gambar preview
  const [loading, setLoading] = useState(false);
  const handleError = useErrorHandler();

  const handleImagePick = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        'Izin Kamera Ditolak',
        'Izin Kamera Dibutuhkan Untuk Mengambil Gambar',
        [
          {
            text: 'Pengaturan',
            onPress: () => Linking.openSettings(),
          },
          {
            text: 'Tutup',
            style: 'destructive',
          },
        ],
      );
      return;
    }

    Alert.alert(
      'Pilih Gambar',
      '',
      [
        {
          text: 'Kamera',
          onPress: () => {
            launchCamera(
              {
                mediaType: 'photo',
                includeBase64: false,
                includeExtras: true,
                cameraType: 'front',
                assetRepresentationMode: 'crop',
                quality: 1,
              },
              response => handleResponse(response),
            );
          },
        },
        {
          text: 'Galeri',
          onPress: () => {
            launchImageLibrary(
              {
                mediaType: 'photo',
                includeBase64: false,
                quality: 1,
              },
              response => handleResponse(response),
            );
          },
        },
        {
          text: 'Lihat',
          onPress: () => {
            setPreviewImage(user?.avatar); // Menampilkan gambar avatar saat tombol Lihat ditekan
            setModalAvatar(true); // Buka modal untuk preview gambar
          },
        },
        {
          text: 'Batal',
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };

  const handleResponse = async response => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.assets && response.assets.length > 0) {
      const source = {uri: response.assets[0].uri};

      changeAvatar(source.uri);
    } else {
      console.log('No image was selected');
    }
  };

  const changeAvatar = async (image) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: image,
        type: 'image/jpeg', // Sesuaikan tipe file (jpeg/png)
        name: 'avatar.jpg',
      });

      const response = await updateAvatar(user.id, formData);
      showMessage({
        message: 'Berhasil',
        description: 'Berhasil memperbarui avatar',
        type: 'success',
        icon: 'success',
      });
      setPreviewImage(response.avatar);
      setUser({...user, avatar: response.avatar});
    } catch (error) {
      showMessage({
        message: 'Gagal',
        description: 'Gagal memperbarui avatar',
        type: 'info',
        icon: 'info',
      });
    } finally {
      setLoading(false);
    }
  };

  const Logout = async () => {
    setLoading(true);
    try {
      const response = await HandleLogout(user.id);
      showMessage({
        message: response.message,
        type: 'success',
        icon: 'success',
      });
      // remove token asynstroage
      await AsyncStorage.removeItem('token');
      setUser(null);
      navigate.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    } catch (error) {
      handleError(error, '*');
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <Loading />;

  return (
    <Container>
      {/* Avatar */}
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={() => setModalVisible(true)}
        onPressOut={() => setModalVisible(false)}
        onPress={handleImagePick}
        style={{
          alignSelf: 'center',
          marginBottom: 20,
        }}>
        <Image
          source={{uri: previewImage}}
          style={{
            width: 150,
            height: 150,
            borderRadius: 75,
            borderWidth: 4,
            borderColor: '#4CAF50',
          }}
        />

        <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 20,
            backgroundColor: 'rgba(0,0,0,0.8)',
            borderRadius: 20,
            padding: 5,
          }}>
          <Icon name="pencil" size={20} color="#fff" />
        </View>
      </TouchableOpacity>

      {/* Nama */}
      <View
        style={{
          flexDirection: 'column',
          borderWidth: 1,
          marginBottom: 20,
          padding: 10,
          borderRadius: 8,
        }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333',
            alignItems: 'center',
            padding: 5,
            textAlign: 'center',
            marginBottom: 8,
            borderBottomWidth: 1,
          }}>
          {user?.name || 'Nama Tidak Tersedia'}
        </Text>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 5,
            gap: 10,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <Icon name="mail" size={20} color="#666" />
            <Text
              style={{
                fontSize: 18,
                color: '#666',
              }}>
              {user?.email || '-'}
            </Text>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <Icon name="card" size={20} color="#666" />
            <Text
              style={{
                fontSize: 18,
                color: '#666',
              }}>
              {user?.nim || 'A11.2019.11861'}
            </Text>
          </View>
        </View>
      </View>

      {/* Tombol Edit Profil */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#4CAF50',
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 8,
          elevation: 5,
        }}
        onPress={() => onOpen()}>
        <Icon name="pencil" size={20} color="#fff" />
        <Text
          style={{
            marginLeft: 8,
            color: '#fff',
            fontSize: 16,
            fontWeight: '600',
          }}>
          Edit Profil
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'red',
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 8,
          elevation: 5,
          marginTop: 10,
        }}
        onPress={() => Logout()}>
        <Icons name="logout" size={20} color="#fff" />
        <Text
          style={{
            marginLeft: 8,
            color: '#fff',
            fontSize: 16,
            fontWeight: '600',
          }}>
          Logout
        </Text>
      </TouchableOpacity>

      {/* Modal untuk Preview Gambar */}
      <ModalProfile
        email={email}
        name={nama}
        isOpen={isOpen}
        onClose={onClose}
        user={user}
        setUser={setUser}
        setModalVisible={setModalVisible}
        setEmail={setEmail}
        setNama={setNama}
      />
      <Modal
        visible={modalAvatar}
        onRequestClose={() => setModalAvatar(false)}
        transparent={true}
        animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Latar belakang semi transparan
          }}>
          <StatusBar
            backgroundColor="rgba(0, 0, 0, 0.7)"
            barStyle="light-content"
          />
          {/* Area untuk menutup modal ketika area luar ditekan */}
          <TouchableOpacity
            style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
            activeOpacity={1}
            onPress={() => setModalAvatar(false)} // Menutup modal saat ditekan
          />
          <View
            style={{
              backgroundColor: '#fff',
              padding: 1,
              borderRadius: 10,
              width: '80%', // Atur lebar modal agar tidak terlalu lebar
              maxWidth: 350, // Atur lebar maksimal modal
              alignItems: 'center', // Agar gambar berada di tengah
            }}>
            <Image
              source={{uri: previewImage}}
              style={{
                width: '100%', // Sesuaikan lebar gambar dengan lebar modal
                height: 400, // Tentukan tinggi gambar
                borderRadius: 10,
              }}
            />
          </View>
        </View>
      </Modal>
    </Container>
  );
};

export default ProfileScreen;
