import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {getForm} from '../../Service/API/Agenda/Service_Agenda';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {requestCameraPermission} from '../../Library/Permisions/CameraPermission';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEdit, faSave} from '@fortawesome/free-solid-svg-icons';
import MapView, {Marker} from 'react-native-maps';
import {API_URL, Colors} from '../../Constant/Constant';
import axios from 'axios';
import {showMessage} from 'react-native-flash-message';
import Loading from '../../Components/Loading';

const EditForm = () => {
  const {agendaId} = useRoute().params;
  const [formData, setFormData] = useState({
    detail: '',
    gambar1: '',
    gambar2: '',
    gps: '',
    gambar1_b64: '',
    gambar2_b64: '',
  });

  const [newImage, setNewImage] = useState({
    gambar1: null,
    gambar2: null,
  });
  const [loading, setLoading] = useState(false);

  const fetchForm = async () => {
    try {
      setLoading(true);
      const response = await getForm(agendaId);
      setFormData(response.data);
    } catch (error) {
      console.log(error);
      showMessage({
        message: 'Gagal mengambil data formulir',
        type: 'danger',
        icon: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchForm();
    }, []),
  );

  const handleInputChange = (name, value) => {
    setFormData({...formData, [name]: value});
  };

  const handleImagePress = field => {
    Alert.alert(
      'Pilih Gambar',
      '',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Kamera',
          onPress: async () => {
            const permission = await requestCameraPermission();
            if (permission) {
              launchCamera({mediaType: 'photo'}, response => {
                if (response.assets && response.assets.length > 0) {
                  const image = response.assets[0];
                  setNewImage({
                    ...newImage,
                    [field]: image.uri,
                  });
                }
              });
            }
          },
        },
        {
          text: 'Galeri',
          onPress: () => {
            launchImageLibrary({mediaType: 'photo'}, response => {
              if (response.assets && response.assets.length > 0) {
                const image = response.assets[0];
                setNewImage({
                  ...newImage,
                  [field]: image.uri,
                });
              }
            });
          },
        },
      ],
      {cancelable: true},
    );
  };

  const validateFormData = () => {
    if (!formData.detail.trim()) {
      showMessage({
        message: 'Detail Kegiatan tidak boleh kosong!',
        type: 'info',
        icon: 'danger',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateFormData()) return;

    const form = new FormData();

    setLoading(true);

    form.append(
      'forms',
      JSON.stringify({
        detail: formData.detail,
        gps: formData.gps,
        id: agendaId,
      }),
    );

    if (newImage.gambar1) {
      form.append('files', {
        uri: newImage.gambar1,
        type: 'image/jpeg',
        name: 'gambar1.jpg',
      });
    }

    if (newImage.gambar2) {
      form.append('files', {
        uri: newImage.gambar2,
        type: 'image/jpeg',
        name: 'gambar2.jpg',
      });
    }

    try {
      const response = await axios.post(API_URL + `/edit/form`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      showMessage({
        message: 'Notifikasi',
        description: 'Formulir berhasil diperbarui',
        type: 'success',
        icon: 'success',
      });
      fetchForm();
    } catch (error) {
      console.log(error);
      showMessage({
        message: 'Notifikasi',
        description: 'Gagal menyimpan data , coba lagi',
        type: 'info',
        icon: 'info',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderImageWithEditIcon = (imageUri, field) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => handleImagePress(field)}>
      <View style={{position: 'relative', marginBottom: 16}}>
        <Image
          source={{
            uri: imageUri || 'https://via.placeholder.com/150',
          }}
          style={{
            width: '100%',
            height: 150,
            borderWidth: 1,
            borderColor: 'black',
            borderRadius: 10,
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: [{translateX: -15}, {translateY: -15}],
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: 30,
            width: 30,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <FontAwesomeIcon icon={faEdit} size={16} color="white" />
        </View>
      </View>
    </TouchableOpacity>
  );

  const gpsCoordinates = formData.gps
    ? formData.gps.split(',').map(Number)
    : [37.78825, -122.4324];

  if (loading) return <Loading />;

  return (
    <ScrollView contentContainerStyle={{padding: 20}}>
      <Text style={{marginBottom: 8, color: 'black'}}>Detail Kegiatan</Text>
      <TextInput
        value={formData.detail}
        placeholder="Masukkan Detail"
        placeholderTextColor="gray"
        numberOfLines={3}
        textAlignVertical="top"
        maxLength={200}
        multiline
        onChangeText={text => handleInputChange('detail', text)}
        style={{
          borderWidth: 1,
          borderColor: 'gray',
          borderRadius: 8,
          padding: 8,
          marginBottom: 16,
          color: 'black',
        }}
      />
      <View>
        <Text
          style={{
            marginBottom: 8,
            color: 'black',
            fontWeight: '900',
            textAlign: 'center',
            borderBottomColor: 'black',
            borderBottomWidth: 1,
            paddingBottom: 8,
          }}>
          Bukti kegiatan
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            gap: 16,
          }}>
          <View style={{width: '50%'}}>
            <Text
              style={{marginBottom: 4, color: 'black', textAlign: 'center'}}>
              Foto 1
            </Text>
            {newImage.gambar1 ? (
              <>{renderImageWithEditIcon(newImage.gambar1, 'gambar1')}</>
            ) : (
              <>{renderImageWithEditIcon(formData.gambar1, 'gambar1')}</>
            )}
          </View>
          <View style={{width: '50%'}}>
            <Text
              style={{marginBottom: 4, color: 'black', textAlign: 'center'}}>
              Foto 2
            </Text>
            {newImage.gambar2 ? (
              <>{renderImageWithEditIcon(newImage.gambar2, 'gambar2')}</>
            ) : (
              <>{renderImageWithEditIcon(formData.gambar2, 'gambar2')}</>
            )}
          </View>
        </View>
      </View>

      <Text style={{marginBottom: 8, color: 'black', textAlign: 'center'}}>
        Lokasi saya
      </Text>
      <View
        style={{
          height: 300,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: 'gray',
          borderRadius: 10,
        }}>
        <MapView
          style={{flex: 1}}
          initialRegion={{
            latitude: gpsCoordinates[0],
            longitude: gpsCoordinates[1],
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}>
          <Marker
            coordinate={{
              latitude: gpsCoordinates[0],
              longitude: gpsCoordinates[1],
            }}
            title="Lokasi Anda"
          />
        </MapView>
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        style={{padding: 10, backgroundColor: Colors.green, borderRadius: 8}}
        onPress={handleSubmit}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            justifyContent: 'center',
          }}>
          <FontAwesomeIcon icon={faSave} size={20} color="white" />
          <Text
            style={{color: 'white', fontWeight: 'bold', textAlign: 'center'}}>
            Simpan
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditForm;
