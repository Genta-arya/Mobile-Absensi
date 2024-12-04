import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import useCheckLogin from '../../Hooks/useCheckLogin';
import Loading from '../../Components/Loading';
import Container from '../../Components/Container';
import Header from './components/Header';
import GrupScreen from '../GrupKegiatan/GrupScreen';
import ErrorScreen from '../../Components/ErrorScreen';
import TrackAbsensiForm from '../TrackForm/TrackAbsensiForm';
import HistoryScreen from '../History/HistoryScreen';

const HomeScreen = () => {
  const {loading, fetchData, user } = useCheckLogin();

  if (loading) return <Loading />;

  return (
    <Container>
      <View style={{flexDirection: 'column'}}>
        <Header user={user} />

        <GrupScreen user={user} refresh={fetchData} />

        <TrackAbsensiForm />

        <HistoryScreen user={user} />
      </View>
    </Container>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
