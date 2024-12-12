import React, {useState, useEffect} from 'react';
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
  Button,
  StatusBar,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {getForm} from '../../Service/API/Agenda/Service_Agenda';
import MapView, {Marker} from 'react-native-maps';
import Loading from '../../Components/Loading';
import {Colors} from '../../Constant/Constant';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAngleLeft, faAngleRight} from '@fortawesome/free-solid-svg-icons';

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const {id} = useRoute().params;

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
  const openImageModal = imageUri => {
    setCurrentImageIndex(imageUri);
    setIsModalVisible(true);
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setIsModalVisible(false);
  };

  const images = [
    newImage.gambar1 || formData.gambar1,
    newImage.gambar2 || formData.gambar2,
  ];
  const prevImage = () => {
    setCurrentImageIndex(prevIndex =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  // Fungsi untuk pindah ke gambar berikutnya
  const nextImage = () => {
    setCurrentImageIndex(prevIndex =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  // Render gambar dengan opsi untuk membuka modal
  const renderImageWithEditIcon = (imageUri, field) => (
    <TouchableOpacity activeOpacity={0.9} onPress={() => openImageModal(field)}>
      <View style={{position: 'relative', marginBottom: 16}}>
        <Image
          source={{uri: imageUri || 'https://via.placeholder.com/150'}}
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
        style={{
          borderWidth: 1,
          borderColor: 'gray',
          borderRadius: 8,
          padding: 8,
          marginBottom: 16,
          color: 'black',
        }}
        editable={false}
        onChangeText={text => setFormData({...formData, detail: text})}
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
            justifyContent: 'space-between',
            gap: 16,
          }}>
          {images.map((image, index) => (
            <View key={index} style={{flex: 1, marginHorizontal: 4}}>
              <View>
                <Text
                  style={{
                    color: 'black',
                    fontWeight: '600',
                    textAlign: 'center',
                    marginBottom: 8,
                  }}>
                  Gambar {index + 1}
                </Text>
                <View>{renderImageWithEditIcon(image, index)}</View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <Text style={{marginBottom: 8, color: 'black', textAlign: 'center'}}>
        Lokasi Absen
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

      {/* Modal untuk menampilkan gambar */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={closeModal}
        animationType="fade">
        <StatusBar
          backgroundColor="rgba(0, 0, 0, 0.8)"
          barStyle="light-content"
        />
        <TouchableWithoutFeedback onPress={closeModal}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.8)',
            }}>
            <Image
              source={{uri: images[currentImageIndex]}}
              style={{width: '90%', height: '70%', borderRadius: 10}}
              resizeMode="contain"
            />
            <View style={{flexDirection: 'row', marginTop: 20}}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={prevImage}
                style={{
                  marginHorizontal: 20,
                  padding: 10,
                  backgroundColor: Colors.green,
                  borderRadius: 10,
                }}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>
                  <FontAwesomeIcon icon={faAngleLeft} color="white" />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={nextImage}
                style={{
                  marginHorizontal: 20,
                  padding: 10,
                  backgroundColor: Colors.green,
                  borderRadius: 10,
                }}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>
                  <FontAwesomeIcon icon={faAngleRight} color="white" />
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
};

export default DetailForm;
