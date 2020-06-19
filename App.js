/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ProgressCircle from 'react-native-progress-circle';

const App: () => React$Node = () => {
  let [settingSelected, setSettingSelected] = useState(false);
  let [progressSelected, setProgressSelected] = useState(false);
  return (
    <>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#372DAE', '#7970E5']} style={styles.background}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              setProgressSelected(!progressSelected);
              setSettingSelected(false);
            }}>
            <Image
              style={{height: 30, width: 30}}
              source={require('./assets/progress.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSettingSelected(!settingSelected);
              setProgressSelected(false);
            }}>
            <Image
              style={{height: 30, width: 30}}
              source={require('./assets/setting.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.main}>
          <View style={styles.timer}>
            <ProgressCircle
              percent={28}
              radius={120}
              borderWidth={15}
              color="#4138A9"
              shadowColor="#8A87FF"
              bgColor="#FFF">
              <Text style={{fontSize: 60, color: '#D589F9'}}>{'02:10'}</Text>
              <Text style={{fontSize: 22, color: '#D589F9'}}>Remaining</Text>
            </ProgressCircle>
          </View>
          <View style={styles.quiz}></View>
        </View>
      </LinearGradient>
      {settingSelected && (
        <View style={styles.modalView}>
          <Text>Setting</Text>
        </View>
      )}
      {progressSelected && (
        <View style={styles.modalView}>
          <Text>Progress</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '15%',
    paddingHorizontal: 20,
  },
  main: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: (Dimensions.get('window').height * 4) / 10,
  },
  quiz: {
    marginTop: 10,
    width: Dimensions.get('window').width - 30,
    height: (Dimensions.get('window').height * 4.5) / 10,
    borderRadius: 20,
    backgroundColor: '#ffffff',
  },
  modalView: {
    borderRadius: 20,
    position: 'absolute',
    bottom: 32,
    left: 15,
    backgroundColor: '#ffffff',
    height: (Dimensions.get('window').height * 7) / 10,
    width: Dimensions.get('window').width - 30,
  },
});

export default App;
