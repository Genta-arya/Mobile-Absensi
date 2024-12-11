import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Modal,
  TouchableWithoutFeedback,
  Button
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getForm } from '../../Service/API/Agenda/Service_Agenda';
import MapView, { Marker } from 'react-native-maps';
import Loading from '../../Components/Loading';

const DetailForm = () => {
  const [formData, setFormData] = useState({
    detail: '',
    gambar1: '',
    gambar2: '',
    gps: '',
  });

  const [loading, setLoading] = useState(false);
  const [newImage, setNewImage] = useState({
    gambar1: null,
    gambar2: null,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const { id } = useRoute().params;

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getForm(id);
      setFormData({
        detail: response.data.detail,
        gambar1: response.data.gambar1_b64,
        gambar2: response.data.gambar2_b64,
        gps: response.data.gps,
      });
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to load form data');
    } finally {
      setLoading(false);
    }
  };

  const gpsCoordinates = formData.gps
    ? formData.gps.split(',').map(Number)
    : [37.78825, -122.4324];

  // Fungsi untuk membuka gambar dalam modal
  const openImageModal = (imageUri) => {
    setCurrentImage(imageUri);
    setIsModalVisible(true);
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setIsModalVisible(false);
    setCurrentImage(null);
  };

  // Render gambar dengan opsi untuk membuka modal
  const renderImageWithEditIcon = (imageUri, field) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => openImageModal(imageUri)}
    >
      <View style={{ position: 'relative', marginBottom: 16 }}>
        <Image
          source={{ uri: imageUri || 'https://via.placeholder.com/150' }}
          style={{
            width: '100%',
            height: 150,
            borderWidth: 1,
            borderColor: 'black',
            borderRadius: 10,
          }}
        />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ marginBottom: 8, color: 'black' }}>Detail Kegiatan</Text>
      <TextInput
        value={formData.detail}
        placeholder="Masukkan Detail"
        placeholderTextColor="gray"
        numberOfLines={3}
        textAlignVertical="top"
        maxLength={200}
        multiline
        style={{
          borderWidth: 1,
          borderColor: 'gray',
          borderRadius: 8,
          padding: 8,
          marginBottom: 16,
          color: 'black',
        }}
        editable={false}
        onChangeText={(text) => setFormData({ ...formData, detail: text })}
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
          }}
        >
          Bukti kegiatan
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            gap: 16,
          }}
        >
          <View style={{ width: '50%' }}>
            <Text
              style={{ marginBottom: 4, color: 'black', textAlign: 'center' }}
            >
              Foto 1
            </Text>
            {newImage.gambar1
              ? renderImageWithEditIcon(newImage.gambar1, 'gambar1')
              : renderImageWithEditIcon(formData.gambar1, 'gambar1')}
          </View>
          <View style={{ width: '50%' }}>
            <Text
              style={{ marginBottom: 4, color: 'black', textAlign: 'center' }}
            >
              Foto 2
            </Text>
            {newImage.gambar2
              ? renderImageWithEditIcon(newImage.gambar2, 'gambar2')
              : renderImageWithEditIcon(formData.gambar2, 'gambar2')}
          </View>
        </View>
      </View>

      <Text style={{ marginBottom: 8, color: 'black', textAlign: 'center' }}>
        Lokasi Absen
      </Text>
      <View
        style={{
          height: 300,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: 'gray',
          borderRadius: 10,
        }}
      >
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: gpsCoordinates[0],
            longitude: gpsCoordinates[1],
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: gpsCoordinates[0],
              longitude: gpsCoordinates[1],
            }}
            title="Lokasi Anda"
          />
        </MapView>
      </View>

      {/* Modal untuk menampilkan gambar */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={closeModal}
        animationType="fade"
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
       
            }}
          >
            <TouchableWithoutFeedback>
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'white',
                 
                }}
              >
                <Image
                  source={{ uri: currentImage }}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 10,
                    marginTop: -100,
                  }}
                  resizeMode="contain"
                />
                <Button title="Tutup" onPress={closeModal} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
};

export default DetailForm;
