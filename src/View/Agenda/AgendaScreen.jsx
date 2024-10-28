import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { useAuthStore } from '../../Library/Zustand/AuthStore';
import { getAgenda } from '../../Service/API/Agenda/Service_Agenda';
import Container from '../../Components/Container';
import { Colors } from '../../Constant/Constant';
import { showMessage } from 'react-native-flash-message';

const AgendaScreen = () => {
    const route = useRoute();
    const { grupId } = route.params;
    const { user } = useAuthStore();
    const [agendas, setAgendas] = useState([]);

    const fetchData = async () => {
        try {
            const response = await getAgenda({
                groupId: grupId,
                userId: user.id,
            });

            if (response && response.agendas) {
                setAgendas(response.agendas);
            }
        } catch (error) {
            console.log('Error fetching agendas:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleKegiatan = (item) => {
        if (!item.status) {
            // Logika untuk mengambil kegiatan
            console.log(`Mengambil kegiatan: ${item.id}`);
            showMessage({
                message: 'Agenda Berhasil Diambil',
                type: 'success',
                icon: 'success',
            })
        }
    };

    const renderAgendaItem = ({ item }) => (
        <View
            style={{
                padding: 10,
                marginVertical: 5,
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 5,
                flexDirection: 'row',
                justifyContent: 'space-between', // Mengatur jarak antara nama dan tombol
                alignItems: 'center', // Menyelaraskan tombol dan teks
            }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'black' }}>
                {item.nama}
            </Text>
            <TouchableOpacity
                onPress={() => handleKegiatan(item)}
                disabled={item.status} // Nonaktifkan tombol jika status true
                style={{
                    backgroundColor: item.status ? 'red' : Colors.green, // Merah jika status true, biru jika false
                    padding: 10,
                    borderRadius: 5,
                }}>
                <Text style={{ color: 'white' }}>
                    {item.status ? 'Agenda Sudah Diambil' : 'Ambil Agenda'}
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <Container>
            <FlatList
                data={agendas}
                renderItem={renderAgendaItem}
                keyExtractor={item => item.id}
                ListEmptyComponent={
                    <Text style={{ textAlign: 'center', color: 'black' }}>
                        No agenda found.
                    </Text>
                }
            />
        </Container>
    );
};

export default AgendaScreen;
