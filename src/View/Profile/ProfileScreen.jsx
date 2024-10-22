import { View, Text, Image, TouchableOpacity, Alert, Modal, TextInput, StatusBar, Linking } from 'react-native';
import React, { useState } from 'react';
import { useAuthStore } from '../../Library/Zustand/AuthStore';
import Container from '../../Components/Container';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { requestCameraPermission } from '../../Library/Permisions/CameraPermission';

const ProfileScreen = () => {
  const { user, setUser } = useAuthStore(); 
  const [showEditIcon, setShowEditIcon] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [nama, setNama] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');

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
          ]
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
                quality: 1,
              },
              (response) => handleResponse(response)
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
              (response) => handleResponse(response)
            );
          },
        },
        {
          text: 'Batal',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const handleResponse = (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.assets && response.assets.length > 0) {
      const source = { uri: response.assets[0].uri };
      setUser({ ...user, avatar: source.uri });
    } else {
      console.log('No image was selected');
    }
  };

  const handleSave = () => {
    setUser({ ...user, nim, email }); // Update user data
    setModalVisible(false); // Close modal after saving
  };

  return (
    <Container>
      {/* Avatar */}
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={() => setShowEditIcon(true)}
        onPressOut={() => setShowEditIcon(false)}
        onPress={handleImagePick}
        style={{
          alignSelf: 'center',
          marginBottom: 20,
        }}>
        <Image
          source={{ uri: user?.avatar }}
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
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Icon name="mail" size={20} color="#666" />
            <Text
              style={{
                fontSize: 18,
                color: '#666',
              }}>
              {user?.email || '-'}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
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
        onPress={() => setModalVisible(true)}>
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

      {/* Modal Edit Profil */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
            <StatusBar backgroundColor="rgba(0, 0, 0, 0.5)" barStyle="light-content" />
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
          <View style={{
            width: '80%',
            backgroundColor: 'white',
            borderRadius: 10,
            padding: 20,
          }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
              Edit Profil
            </Text>
            <TextInput
              placeholder="Nama"
              value={nama}
              onChangeText={setNama}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 5,
                padding: 10,
                marginBottom: 20,
              }}
            />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 5,
                padding: 10,
                marginBottom: 20,
              }}
            />
            <TouchableOpacity
              onPress={handleSave}
              style={{
                backgroundColor: '#4CAF50',
                padding: 10,
                borderRadius: 5,
                alignItems: 'center',
              }}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Simpan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                marginTop: 10,
                alignItems: 'center',
              }}>
              <Text style={{ color: '#666' }}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Container>
  );
};

export default ProfileScreen;
