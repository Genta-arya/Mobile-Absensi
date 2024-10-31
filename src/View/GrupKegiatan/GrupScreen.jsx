import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, images, pathScreen} from '../../Constant/Constant';
import {useNavigation} from '@react-navigation/native';
import {useGroupStore} from '../../Library/Zustand/GrupStore';

const GrupScreen = ({user, refresh}) => {
  const navigate = useNavigation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {setGroupName} = useGroupStore();
  const onRefresh = async () => {
    setIsRefreshing(true);

    await refresh();
    setIsRefreshing(false);
  };

  const handlePress = item => {
    navigate.navigate(pathScreen.ListAgenda, {grupId: item.id});
    setGroupName(item.nama_grup);
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handlePress(item)}
        style={{
          marginRight: 15,
          padding: 16,
          backgroundColor: '#f0f0f0',
          borderRadius: 8,
          borderWidth: 1,
          width: 250,
          borderLeftColor: Colors.green,
          borderLeftWidth: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}>
        <Text
          style={{
            fontSize: 16,
            marginBottom: 5,
            color: 'black',
            fontWeight: '900',
            borderBottomColor: 'gray',
            width: '100%',
            borderBottomWidth: 1,
            textTransform: 'uppercase',
          }}>
          {item.kegiatan.nama}
        </Text>

        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: 'black',
          }}>
          {item.nama_grup}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            marginTop: 10,
            alignContent: 'flex-end',
            alignSelf: 'center',
          }}>
          <View style={{flexDirection: 'row', gap: 5}}>
            <Text style={{fontSize: 14, color: 'black'}}>
              {new Date(item.kegiatan.waktumulai).toLocaleDateString('id-ID')}
            </Text>
            <Text style={{fontSize: 14, color: 'black'}}> - </Text>
            <Text style={{fontSize: 14, color: 'black'}}>
              {new Date(item.kegiatan.waktuselesai).toLocaleDateString('id-ID')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 40,
          marginBottom: 10,
        }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '900',

            color: 'black',
          }}>
          Grup Kegiatan
        </Text>
        {user?.Group?.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigate.navigate(pathScreen.ListGrups)}>
            <Text
              style={{fontSize: 14, color: Colors.green, fontWeight: '800'}}>
              Lihat semua
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={user?.Group?.slice(0, 5)}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        horizontal={user?.Group?.length > 0 ? true : false}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20,
            }}>
            <Image
              source={images.Empty}
              style={{
                width: 200,
                height: 200,
                alignSelf: 'center',
                borderRadius: 50,
                borderWidth: 0.5,
                borderColor: 'gray',
              }}
            />

            <Text
              style={{
                fontSize: 16,
                alignSelf: 'center',
                textAlign: 'center',
                fontWeight: '600',
                color: 'gray',
                marginTop: 15,
              }}>
              Belum punya Grup Kegiatan
            </Text>
          </View>
        }
        contentContainerStyle={{paddingBottom: 20}}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

export default GrupScreen;
