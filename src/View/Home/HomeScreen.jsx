import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import useCheckLogin from '../../Hooks/useCheckLogin';
import Loading from '../../Components/Loading';
import Container from '../../Components/Container';
import Header from './components/Header';
import GrupScreen from '../GrupKegiatan/GrupScreen';
import TrackAbsensiForm from '../TrackForm/TrackAbsensiForm';
import HistoryScreen from '../History/HistoryScreen';

const HomeScreen = () => {
  const {loading, fetchData, user} = useCheckLogin();

  if (loading) return <Loading />;

  return (
    <ScrollView style={{backgroundColor: 'white'}}>
      <Container>
        <View style={{flexDirection: 'column'}}>
          <Header user={user} />

          <GrupScreen user={user} refresh={fetchData} />

          <HistoryScreen user={user} />

          <View style={{marginBottom: 50 , paddingBottom: 50}}>
            <TrackAbsensiForm />
          </View>
        </View>
      </Container>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
