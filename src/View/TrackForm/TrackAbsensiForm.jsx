import { View, Text, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TrackAbsensiForm = () => {
  const [totalForms, setTotalForms] = useState(0);
  const [filledForms, setFilledForms] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const existingData = await AsyncStorage.getItem('formData');
      const formArray = existingData ? JSON.parse(existingData) : [];

      // Total form yang ada
      setTotalForms(formArray.length);

      // Menghitung berapa banyak form yang sudah diisi
      const filledCount = formArray.filter(data => 
        data.detail && data.gps && data.tanggal && data.gambar1 && data.gambar2
      ).length;

      setFilledForms(filledCount);
    };

    fetchData();
  }, []);

  const fillPercentage = totalForms > 0 ? (filledForms / totalForms) * 100 : 0;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black', marginBottom: 10 }}>
        Tracking Absensi Form
      </Text>
      <Text style={{ fontSize: 16, color: 'black', marginBottom: 10 }}>
        {filledForms} dari {totalForms} form sudah diisi
      </Text>
      <View style={{ height: 20, width: '100%', backgroundColor: '#ddd', borderRadius: 10, overflow: 'hidden' }}>
        <View style={{ height: '100%', width: `${fillPercentage}%`, backgroundColor: '#4CAF50' }} />
      </View>
      <Text style={{ textAlign: 'right', marginTop: 5, fontWeight: 'bold', color: 'black' }}>
        {Math.round(fillPercentage)}%
      </Text>
    </View>
  );
};

export default TrackAbsensiForm;
