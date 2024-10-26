import {
  View,
  Text,
  Modal,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React from 'react';
import { showMessage } from 'react-native-flash-message';
import { updateProfile } from '../../../Service/API/Profile/service_Profile';

const ModalProfile = ({
  name,
  email,
  isOpen,
  onClose,
  user,
  setUser,
  setNama,
  setEmail,
}) => {
  const handleSave = async () => {
    if (!name || !email) {
      Alert.alert('Notifikasi', 'Mohon lengkapi semua data');
      return;
    }

    try {
      await updateProfile(user.id, {name: name, email});
      showMessage({
        message: 'Berhasil',
        description: 'Data profil Anda telah diperbarui',
        type: 'success',
        icon: 'success',
      });
      setUser({...user, name: name, email}); // Update user data
      onClose();
    } catch (error) {
      console.log(error);
      showMessage({
        message: 'Gagal',
        description: 'Terjadi kesalahan saat menyimpan data profil',
        type: 'danger',
      });
    }
  };
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isOpen}
      onRequestClose={() => onClose()}>
      <StatusBar
        backgroundColor="rgba(0, 0, 0, 0.5)"
        barStyle="light-content"
      />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
        <View
          style={{
            width: '90%',
            backgroundColor: 'white',
            borderRadius: 10,
            padding: 20,
          }}>
          <View style={{fontSize: 20, fontWeight: 'bold', marginBottom: 20}}>
            <Text style={{fontSize: 20, fontWeight: '900'}}>Edit Profil</Text>
          </View>
          <TextInput
            placeholder="Nama"
            value={name}
            onChangeText={setNama}
            maxLength={20}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 5,
              padding: 5,
              paddingLeft: 10,
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
              padding: 5,
              paddingLeft: 10,
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
            <Text style={{color: '#fff', fontWeight: 'bold'}}>Simpan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onClose()}
            disabled={user?.name === null}
            style={{
              marginTop: 10,
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: '#666',
                backgroundColor: user?.name === null ? '#ccc' : '#fff',
                borderWidth: 1,
                borderColor: '#ccc',
                width: '100%',
                padding: 8,
                textAlign: 'center',
                borderRadius: 5,
              }}>
              Batal
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ModalProfile;