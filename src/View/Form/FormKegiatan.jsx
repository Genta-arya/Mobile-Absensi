import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {requestCameraPermission} from '../../Library/Permisions/CameraPermission';
import Geolocation from '@react-native-community/geolocation';
import useFormStore from '../../Library/Zustand/useFormStore';
import Svg, {Rect, Text as SvgText} from 'react-native-svg';
import MapView, {Circle, Marker, Polyline} from 'react-native-maps';
import {Colors, pathScreen} from '../../Constant/Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useRoute} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCamera, faImage, faSave} from '@fortawesome/free-solid-svg-icons';
import {useAuthStore} from '../../Library/Zustand/AuthStore';
import Loading from '../../Components/Loading';

const FormKegiatan = () => {
  const {
    detail,
    setDetail,
    gps,
    setGps,
    tanggal,
    setTanggal,
    gambar1,
    setGambar1,
    gambar2,
    setGambar2,
  } = useFormStore();
  const [coordinates, setCoordinates] = useState({latitude: 0, longitude: 0});
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [road, setRoad] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadings, setLoadings] = useState(false);
  const route = useRoute();
  const {user} = useAuthStore();
  const [locationError, setLocationError] = useState(false);
  const navigate = useNavigation();
  const {agendaId, kegiatanId, name} = route.params;

  const getAddressFromCoordinates = async (latitude, longitude) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        {
          headers: {
            'User-Agent': 'YourAppName/1.0 (your.email@example.com)',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAddress(data.address.amenity);
      setCity(`${data.address.county}, ${data.address.state}`);
      setRoad(data.address.road);
    } catch (error) {
      console.error('Error getting address:', error);
      setAddress('Alamat tidak ditemukan');
    } finally {
      setLoading(false);
    }
  };

  const handleRetryLocation = () => {
    setLocationError(false);

    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        await getAddressFromCoordinates(latitude, longitude);
        setGps(`${latitude}, ${longitude}`);
        setCoordinates({latitude, longitude});
        setLocationError(false);
      },
      error => {
        console.error('Error mendapatkan lokasi:', error);
        setGps('Gagal mendapatkan lokasi');

        setLocationError(true);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  useEffect(() => {
    const currentDate = new Date()
      .toISOString()
      .split('T')[0]
      .split('-')
      .reverse()
      .join('-');

    const currentMonth = new Date().toLocaleString('default', {month: 'long'});
    const currentDay = new Date().toLocaleString('default', {day: 'numeric'});
    const currentYear = new Date().getFullYear();
    const currentDateFull = `${currentDay} ${currentMonth} ${currentYear}`;

    setTanggal(currentDateFull);
    Alert.alert(
      'Informasi',
      'Pastikan kamu berada dilokasi kegiatan yang akan dilaksanakan',
      [
        {
          text: 'OK',
          onPress: () => console.log('Pengguna mengonfirmasi berada di lokasi'),
        },
      ],
    );

    const fetchData = async () => {
      if (agendaId) {
        try {
          const existingData = await AsyncStorage.getItem('formData');
          const formArray = existingData ? JSON.parse(existingData) : [];
          const agendaData = formArray.find(
            item => item.agendaId === agendaId && item.userId === user.id,
          );

          if (agendaData) {
            setDetail(agendaData.detail);
            setGps(agendaData.gps);
            setTanggal(agendaData.tanggal);
            setGambar1(agendaData.gambar1);
            setGambar2(agendaData.gambar2);

            if (agendaData.gps) {
              const [lat, long] = agendaData.gps.split(', ');
              setCoordinates({
                latitude: parseFloat(lat),
                longitude: parseFloat(long),
              });
              await getAddressFromCoordinates(
                parseFloat(lat),
                parseFloat(long),
              );
            }
          } else {
            setDetail(null);

            setGambar1(null);
            setGambar2(null);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
    handleRetryLocation();
  }, []);

  const handleSubmit = async () => {
    const formData = {
      userId: user.id,
      detail,
      gps,
      tanggal,
      gambar1,
      gambar2,
      agendaId,
      kegiatanId,
      name,
    };
    setLoadings(true);

    try {
      const existingData = await AsyncStorage.getItem('formData');
      const formArray = existingData ? JSON.parse(existingData) : [];

      if (agendaId) {
        const index = formArray.findIndex(item => item.agendaId === agendaId);
        if (index !== -1) {
          formArray[index] = formData;
        } else {
          formArray.push(formData);
        }
      } else {
        formArray.push(formData);
      }

      await AsyncStorage.setItem('formData', JSON.stringify(formArray));
      showMessage({
        message: 'Form berhasil disimpan',
        type: 'success',
        icon: 'success',
      });
      navigate.navigate(pathScreen.Home);

      console.log('Data berhasil disimpan:', formArray);
    } catch (error) {
      console.error('Error menyimpan data:', error);
    } finally {
      setLoadings(false);
    }
  };

  const openImagePicker = async setGambar => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
    });
    if (!result.didCancel && result.assets) {
      setGambar(result.assets[0].uri);
    }
  };

  const openCamera = async setGambar => {
    const hasPermission = await requestCameraPermission();
    if (hasPermission) {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 1,
      });
      if (!result.didCancel && result.assets) {
        setGambar(result.assets[0].uri);
      }
    }
  };

  const renderImageWithCoordinates = uri => {
    return (
      <ImageBackground source={{uri}} style={styles.imagePreview}>
        <Svg height="100%" width="100%">
          <Rect x="0" y="85%" width="100%" height="20%" fill="white" />

          <SvgText
            x="5%"
            y="90%"
            textAnchor="start"
            fill="black"
            fontSize="10"
            fontWeight="bold">
            {address}
          </SvgText>

          <SvgText
            x="5%"
            y="93%"
            textAnchor="start"
            fill="black"
            fontSize="10"
            fontWeight="bold">
            {road}
          </SvgText>

          <SvgText
            x="5%"
            y="96%"
            textAnchor="start"
            fill="black"
            fontSize="10"
            fontWeight="bold">
            {city}
          </SvgText>
        </Svg>
      </ImageBackground>
    );
  };
  if (loadings) return <Loading />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Keterangan</Text>
      <TextInput
        value={detail}
        onChangeText={setDetail}
        placeholder="Masukkan Detail"
        placeholderTextColor="gray"
        numberOfLines={3}
        textAlignVertical="top"
        maxLength={200}
        multiline
        style={styles.textInput}
      />

      <Text style={styles.label}>Lokasi Saya</Text>
      <View style={styles.gpsContainer}>
        {loading ? (
          <ActivityIndicator
            style={{alignSelf: 'center'}}
            size="small"
            color={Colors.green}
          />
        ) : (
          <Text style={styles.gpsText}>{gps}</Text>
        )}
      </View>

      {locationError && ( // Tombol hanya muncul jika error
        <TouchableOpacity
          style={{
            marginTop: 10,
            marginBottom: 10,
            backgroundColor: Colors.green,
            padding: 10,
            borderRadius: 10,
          }}
          onPress={handleRetryLocation}>
          <Text
            style={{
              fontSize: 16,
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            {locationError ? 'Ambil Lokasi Ulang' : 'Loading...'}
          </Text>
        </TouchableOpacity>
      )}

      {coordinates.latitude !== 0 && locationError === false && (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            scrollEnabled={false}
            showsUserLocation
            followsUserLocation
            mapType="standard"
            zoomEnabled={false}
            zoomControlEnabled={false}>
            <Marker coordinate={coordinates} title="Lokasi Saya" />

            <Circle
              center={coordinates}
              radius={100}
              strokeColor="rgba(0, 0, 255, 0.2)"
              fillColor="rgba(0, 0, 255, 0.1)"
            />
          </MapView>
        </View>
      )}

      <Text style={styles.label}>Tanggal</Text>
      <TextInput
        value={tanggal}
        onChangeText={setTanggal}
        placeholder="DD/MM/YYYY"
        editable={false}
        placeholderTextColor="gray"
        style={styles.dateInput}
      />

      {Array.from({length: 2}, (_, index) => (
        <View key={index} style={styles.imageSection}>
          <Text style={styles.label}>Bukti kegiatan ( {index + 1} )</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() =>
                openImagePicker(index === 0 ? setGambar1 : setGambar2)
              }
              style={styles.button}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <FontAwesomeIcon
                  icon={faImage}
                  size={20}
                  color={Colors.white}
                />
                <Text style={styles.buttonText}>Pilih Gambar</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openCamera(index === 0 ? setGambar1 : setGambar2)}
              style={styles.button}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <FontAwesomeIcon
                  icon={faCamera}
                  size={20}
                  color={Colors.white}
                />

                <Text style={styles.buttonText}>Ambil Gambar</Text>
              </View>
            </TouchableOpacity>
          </View>
          {index === 0 && gambar1 && renderImageWithCoordinates(gambar1)}
          {index === 1 && gambar2 && renderImageWithCoordinates(gambar2)}
        </View>
      ))}
      {gps && (
        <View style={{paddingBottom: 50}}>
          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              backgroundColor: '#4CAF50',
              padding: 10,
              borderRadius: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <FontAwesomeIcon
                icon={faSave}
                size={20}
                color={Colors.white}
                style={{marginRight: 10}}
              />

              <Text style={{color: 'white', textAlign: 'center'}}>Simpan</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  label: {
    color: '#333',
    marginBottom: 5,

    fontSize: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,

    padding: 10,
    marginBottom: 10,
    color: '#333',
    backgroundColor: '#fff',
  },
  gpsContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#e8f0fe',
  },
  gpsText: {
    color: '#333',
  },
  dateInput: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    paddingLeft: 10,
    color: '#333',
    backgroundColor: '#fff',
  },
  imageSection: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  button: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 500,
    marginBottom: 10,
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 10,
  },
  mapContainer: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    height: '100%',
  },
});

export default FormKegiatan;
