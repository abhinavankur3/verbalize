/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
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
  Button,
  Switch,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ProgressCircle from 'react-native-progress-circle';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import AsyncStorage from '@react-native-community/async-storage';
import Modal from 'react-native-modal';

const tenses = [
  {name: 'Indicative Present', selected: true},
  {name: 'Indicative Preterite', selected: false},
  {name: 'Perfect Present', selected: false},
  {name: 'Perfect Past', selected: false},
  {name: 'Perfect Future', selected: false},
  {name: 'Continuous Future', selected: false},
  {name: 'Continuous Present', selected: false},
  {name: 'Continuous Past', selected: false},
  {name: 'Conditional Present', selected: false},
  {name: 'Conditional Past', selected: false},
  {name: 'Imperative', selected: false},
];

const Settings = (props) => {
  const [wordCount, setWordCount] = useState(0);
  const [verb, setVerb] = useState(0);
  const [timing, setTiming] = useState(0);
  const [retries, setRetries] = useState(0);
  const [mode, setMode] = useState(0);
  const [tensesSelected, setTensesSelected] = useState(tenses);
  const [savingSettings, setSavingSettings] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('settings').then((settings) => {
      if (settings) {
        settings = JSON.parse(settings);
        setWordCount(settings.word_count_selected.value);
        setVerb(settings.verb_selected.value);
        setTiming(settings.timing_selected.value);
        setRetries(settings.retries_selected.value);
        setMode(settings.mode_selected.value);
        setTensesSelected(settings.tenses_selected);
      }
      setLoadingSettings(false);
    });
  }, []);

  const handleTenseSelector = (name) => {
    const tmpState = tensesSelected.map((val) => {
      if (val.name === name) {
        return {...val, selected: !val.selected};
      }
      return {...val};
    });
    setTensesSelected(tmpState);
  };

  const word_count_radio_props = [
    {label: '10', value: 0},
    {label: '25', value: 1},
    {label: '50', value: 2},
  ];

  const verb_radio_props = [
    {label: 'All', value: 0},
    {label: 'Essential 50', value: 1},
    {label: 'Choose', value: 2},
  ];

  const timing_radio_props = [
    {label: 'None', value: 0},
    {label: '10', value: 1},
    {label: '20', value: 2},
    {label: '30', value: 3},
    {label: '60', value: 4},
  ];

  const retries_radio_props = [
    {label: 'None', value: 0},
    {label: '1', value: 1},
    {label: '2', value: 2},
    {label: '3', value: 3},
  ];

  const mode_radio_props = [
    {label: 'Choose word', value: 0},
    {label: 'Enter word', value: 1},
  ];

  const handleSettingsDone = async () => {
    setSavingSettings(true);
    const settings = {};
    const word_count_selected = word_count_radio_props.filter(
      (e) => e.value === wordCount,
    );
    const verb_selected = verb_radio_props.filter((e) => e.value === verb);
    const timing_selected = timing_radio_props.filter(
      (e) => e.value === timing,
    );
    const retries_selected = retries_radio_props.filter(
      (e) => e.value === retries,
    );
    const mode_selected = mode_radio_props.filter((e) => e.value === mode);
    settings.word_count_selected = word_count_selected[0];
    settings.verb_selected = verb_selected[0];
    settings.timing_selected = timing_selected[0];
    settings.retries_selected = retries_selected[0];
    settings.mode_selected = mode_selected[0];
    settings.tenses_selected = tensesSelected;

    await AsyncStorage.setItem('settings', JSON.stringify(settings));
    props.setSettingSelected(false);
  };

  return (
    <View style={styles.modalView}>
      <View style={styles.settingsHeader}>
        <Text style={{fontSize: 26, color: '#43484D'}}>Settings</Text>
        <TouchableOpacity onPress={() => props.setSettingSelected(false)}>
          <Image source={require('./assets/cross.png')} />
        </TouchableOpacity>
      </View>
      {loadingSettings ? (
        <View
          style={{
            height: (Dimensions.get('window').height * 7) / 10,
            width: Dimensions.get('window').width - 60,
          }}>
          <ActivityIndicator size={'large'} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            height: (Dimensions.get('window').height * 7) / 10,
            width: Dimensions.get('window').width - 60,
          }}>
          <View>
            <Text style={styles.settingsText}>Tenses</Text>
            <View style={styles.tenses}>
              {tensesSelected.map((obj, i) => {
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingVertical: 5,
                    }}
                    key={i}>
                    <Text style={{fontSize: 18, marginTop: 4}}>{obj.name}</Text>
                    <Switch
                      trackColor={{false: '#767577', true: '#9593FF'}}
                      thumbColor={'#ffffff'}
                      ios_backgroundColor="#EEEEEE"
                      onValueChange={() => handleTenseSelector(obj.name)}
                      value={obj.selected}
                    />
                  </View>
                );
              })}
            </View>
          </View>
          <View>
            <Text style={styles.settingsText}>Verbs</Text>
            <RadioForm style={{margin: 10}} formHorizontal={true}>
              {verb_radio_props.map((obj, i) => (
                <RadioButton labelHorizontal={true} key={i}>
                  <RadioButtonInput
                    obj={obj}
                    index={i}
                    isSelected={verb === i}
                    onPress={(value) => {
                      setVerb(value);
                    }}
                    borderWidth={2}
                    buttonInnerColor={'#9593FF'}
                    buttonOuterColor={verb === i ? '#423FDA' : '#000'}
                    buttonSize={12}
                    buttonOuterSize={24}
                    buttonStyle={{}}
                    buttonWrapStyle={{}}
                  />
                  <RadioButtonLabel
                    obj={obj}
                    index={i}
                    labelHorizontal={true}
                    onPress={(value) => {
                      setVerb(value);
                    }}
                    labelStyle={{fontSize: 20, color: '#43484D'}}
                    labelWrapStyle={{marginRight: 10}}
                  />
                </RadioButton>
              ))}
            </RadioForm>
          </View>
          <View>
            <Text style={styles.settingsText}>Word Shown</Text>
            <RadioForm style={{margin: 10}} formHorizontal={true}>
              {word_count_radio_props.map((obj, i) => (
                <RadioButton labelHorizontal={true} key={i}>
                  <RadioButtonInput
                    obj={obj}
                    index={i}
                    isSelected={wordCount === i}
                    onPress={(value) => {
                      setWordCount(value);
                    }}
                    borderWidth={2}
                    buttonInnerColor={'#9593FF'}
                    buttonOuterColor={wordCount === i ? '#423FDA' : '#000'}
                    buttonSize={12}
                    buttonOuterSize={24}
                    buttonStyle={{}}
                    buttonWrapStyle={{}}
                  />
                  <RadioButtonLabel
                    obj={obj}
                    index={i}
                    labelHorizontal={true}
                    onPress={(value) => {
                      setWordCount(value);
                    }}
                    labelStyle={{fontSize: 20, color: '#43484D'}}
                    labelWrapStyle={{marginRight: 10}}
                  />
                </RadioButton>
              ))}
            </RadioForm>
          </View>
          <View>
            <Text style={styles.settingsText}>Timing</Text>
            <RadioForm style={{margin: 10}} formHorizontal={true}>
              {timing_radio_props.map((obj, i) => (
                <RadioButton labelHorizontal={true} key={i}>
                  <RadioButtonInput
                    obj={obj}
                    index={i}
                    isSelected={timing === i}
                    onPress={(value) => {
                      setTiming(value);
                    }}
                    borderWidth={2}
                    buttonInnerColor={'#9593FF'}
                    buttonOuterColor={timing === i ? '#423FDA' : '#000'}
                    buttonSize={12}
                    buttonOuterSize={24}
                    buttonStyle={{}}
                    buttonWrapStyle={{}}
                  />
                  <RadioButtonLabel
                    obj={obj}
                    index={i}
                    labelHorizontal={true}
                    onPress={(value) => {
                      setTiming(value);
                    }}
                    labelStyle={{fontSize: 20, color: '#43484D'}}
                    labelWrapStyle={{marginRight: 8}}
                  />
                </RadioButton>
              ))}
            </RadioForm>
          </View>
          <View>
            <Text style={styles.settingsText}>Retries</Text>
            <RadioForm style={{margin: 10}} formHorizontal={true}>
              {retries_radio_props.map((obj, i) => (
                <RadioButton labelHorizontal={true} key={i}>
                  <RadioButtonInput
                    obj={obj}
                    index={i}
                    isSelected={retries === i}
                    onPress={(value) => {
                      setRetries(value);
                    }}
                    borderWidth={2}
                    buttonInnerColor={'#9593FF'}
                    buttonOuterColor={retries === i ? '#423FDA' : '#000'}
                    buttonSize={12}
                    buttonOuterSize={24}
                    buttonStyle={{}}
                    buttonWrapStyle={{}}
                  />
                  <RadioButtonLabel
                    obj={obj}
                    index={i}
                    labelHorizontal={true}
                    onPress={(value) => {
                      setRetries(value);
                    }}
                    labelStyle={{fontSize: 18, color: '#43484D'}}
                    labelWrapStyle={{marginRight: 10}}
                  />
                </RadioButton>
              ))}
            </RadioForm>
          </View>
          <View>
            <Text style={styles.settingsText}>Mode</Text>
            <RadioForm style={{margin: 10}} formHorizontal={true}>
              {mode_radio_props.map((obj, i) => (
                <RadioButton labelHorizontal={true} key={i}>
                  <RadioButtonInput
                    obj={obj}
                    index={i}
                    isSelected={mode === i}
                    onPress={(value) => {
                      setMode(value);
                    }}
                    borderWidth={2}
                    buttonInnerColor={'#9593FF'}
                    buttonOuterColor={mode === i ? '#423FDA' : '#000'}
                    buttonSize={12}
                    buttonOuterSize={24}
                    buttonStyle={{}}
                    buttonWrapStyle={{}}
                  />
                  <RadioButtonLabel
                    obj={obj}
                    index={i}
                    labelHorizontal={true}
                    onPress={(value) => {
                      setMode(value);
                    }}
                    labelStyle={{fontSize: 18, color: '#43484D'}}
                    labelWrapStyle={{marginRight: 10}}
                  />
                </RadioButton>
              ))}
            </RadioForm>
          </View>
        </ScrollView>
      )}
      <View style={styles.settingsFooter}>
        <TouchableOpacity onPress={handleSettingsDone}>
          <View style={styles.settingsDone}>
            {savingSettings ? (
              <ActivityIndicator size={'large'} />
            ) : (
              <Text
                style={{color: '#ffffff', fontSize: 24, fontWeight: 'bold'}}>
                Done
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const AnswerItem = (props) => (
  <View
    style={{
      paddingVertical: 10,
      paddingHorizontal: 15,
      backgroundColor: 'rgba(138,135,255,0.45)',
      borderRadius: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 5,
    }}>
    <Text style={{fontSize: 18}}>Que No. {props.item.question}</Text>
    <Image
      style={{
        height: 24,
        width: 24,
      }}
      source={
        props.item.correct
          ? require('./assets/tick.png')
          : require('./assets/red-cross.png')
      }
    />
  </View>
);
const Progress = (props) => {
  const [quizScore, setQuizScore] = useState([
    {question: '1', correct: true},
    {question: '2', correct: true},
    {question: '3', correct: true},
    {question: '4', correct: false},
    {question: '5', correct: true},
    {question: '6', correct: false},
    {question: '7', correct: true},
    {question: '8', correct: true},
    {question: '9', correct: true},
    {question: '10', correct: true},
  ]);
  return (
    <View style={styles.modalView}>
      <View style={styles.settingsHeader}>
        <Text style={{fontSize: 26, color: '#43484D'}}>Score Board</Text>
        <TouchableOpacity onPress={() => props.setProgressSelected(false)}>
          <Image source={require('./assets/cross.png')} />
        </TouchableOpacity>
      </View>
      <View style={styles.progress}>
        <View style={styles.progressCard}>
          <Text style={styles.progressCardText}>Answered/Total</Text>
          <Text style={styles.progressCardText}>8/10</Text>
        </View>
        <View style={styles.progressCard}>
          <Text style={styles.progressCardText}>Time Taken</Text>
          <Text style={styles.progressCardText}>3:10</Text>
        </View>
        <View style={styles.progressCard}>
          <Text style={styles.progressCardText}>Percentage</Text>
          <Text style={styles.progressCardText}>{(8 / 10) * 100}%</Text>
        </View>
      </View>
      <FlatList
        style={styles.answeList}
        data={quizScore}
        renderItem={({item}) => <AnswerItem item={item} />}
        keyExtractor={(item) => item.question}
      />
    </View>
  );
};

const App: () => React$Node = () => {
  let [settingSelected, setSettingSelected] = useState(false);
  let [progressSelected, setProgressSelected] = useState(false);
  let [settings, setSettings] = useState({
    mode_selected: {label: 'Choose word', value: 0},
    retries_selected: {label: 'None', value: 0},
    timing_selected: {label: 'None', value: 0},
    verb_selected: {label: 'All', value: 0},
    word_count_selected: {label: '10', value: 0},
    tenses_selected: [
      {name: 'Indicative Present', selected: true},
      {name: 'Indicative Preterite', selected: false},
      {name: 'Perfect Present', selected: false},
      {name: 'Perfect Past', selected: false},
      {name: 'Perfect Future', selected: false},
      {name: 'Continuous Future', selected: false},
      {name: 'Continuous Present', selected: false},
      {name: 'Continuous Past', selected: false},
      {name: 'Conditional Present', selected: false},
      {name: 'Conditional Past', selected: false},
      {name: 'Imperative', selected: false},
    ],
  });
  let [loading, setLoading] = useState(true);
  let [timerPercent, setTimerPercent] = useState(0);
  let [quizStarted, setQuizStarted] = useState(false);
  let [timeMs, setTimeMs] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem('settings').then((fetchedSettings) => {
      if (fetchedSettings) {
        fetchedSettings = JSON.parse(fetchedSettings);
        const time = Number(fetchedSettings.timing_selected.label);
        time && setTimeMs(time * 60 * 1000);
        setSettings(fetchedSettings);
      }
      setLoading(false);
    });
  }, [settingSelected]);

  const msToTime = (timeInMs) => {
    const ms = timeInMs % 1000;
    timeInMs = (timeInMs - ms) / 1000;
    let secs = timeInMs % 60;
    timeInMs = (timeInMs - secs) / 60;
    let mins = timeInMs % 60;
    let hrs = (timeInMs - mins) / 60;
    if (secs / 10 < 1) {
      secs = '0' + secs;
    }
    if (mins / 10 < 1) {
      mins = '0' + mins;
    }
    return hrs ? hrs + ':' + mins + ':' + secs : mins + ':' + secs;
  };

  const handleQuizStart = () => {
    setQuizStarted(true);
    let count = 0;
    timeMs &&
      setInterval(() => {
        count = count + 1;
        const timeRemaining = timeMs - count * 1000;
        const percentTime = 100 - (timeRemaining / timeMs) * 100;
        setTimeMs(timeRemaining);
        setTimerPercent(percentTime);
      }, 1000);
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#372DAE', '#7970E5']} style={styles.background}>
        <Modal isVisible={loading}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size={'large'} />
          </View>
        </Modal>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              if (!quizStarted) {
                setProgressSelected(true);
                setSettingSelected(false);
              }
            }}>
            <Image
              style={{height: 30, width: 30}}
              source={require('./assets/progress.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (!quizStarted) {
                setSettingSelected(true);
                setProgressSelected(false);
              }
            }}>
            <Image
              style={{height: 30, width: 30}}
              source={require('./assets/setting.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.main}>
          {quizStarted && (
            <View style={styles.timer}>
              <ProgressCircle
                percent={timerPercent}
                radius={120}
                borderWidth={15}
                color="#4138A9"
                shadowColor="#8A87FF"
                bgColor="#FFF">
                <Text style={{fontSize: 40, color: '#D589F9'}}>
                  {settings.timing_selected.label === 'None'
                    ? 'Unlimited'
                    : `${msToTime(timeMs)}`}
                </Text>
                <Text style={{fontSize: 22, color: '#D589F9'}}>Remaining</Text>
              </ProgressCircle>
            </View>
          )}
          <View
            style={{
              ...styles.quiz,
              backgroundColor: quizStarted ? '#ffffff' : 'transparent',
            }}>
            {!quizStarted && (
              <View style={styles.startQuiz}>
                <Text
                  style={{fontSize: 40, color: '#ffffff', marginBottom: 150}}>
                  WELCOME
                </Text>
                <TouchableOpacity
                  onPress={handleQuizStart}
                  style={{
                    height: 60,
                    width: '60%',
                    backgroundColor: '#ffffff',
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: 'bold',
                      color: '#4138A9',
                    }}>
                    START QUIZ
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
      {settingSelected && <Settings setSettingSelected={setSettingSelected} />}
      {progressSelected && (
        <Progress setProgressSelected={setProgressSelected} />
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
  },
  startQuiz: {
    width: Dimensions.get('window').width - 30,
    height: (Dimensions.get('window').height * 8.5) / 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    padding: 20,
    borderRadius: 20,
    position: 'absolute',
    bottom: 32,
    left: 15,
    backgroundColor: '#ffffff',
    height: (Dimensions.get('window').height * 7) / 10,
    width: Dimensions.get('window').width - 30,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  settingsHeader: {
    paddingRight: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  settingsText: {color: '#A0A0A0', fontSize: 20, fontWeight: 'bold'},
  tenses: {
    paddingLeft: 5,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  progress: {
    flexDirection: 'column',
    // backgroundColor: 'rgba(138,135,255,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    // borderRadius: 15,
  },
  progressCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 5,
    width: '100%',
    height: 50,
  },
  progressCardText: {
    padding: 5,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6A61D9',
  },
  answeList: {
    marginTop: 10,
    width: '100%',
    padding: 10,
  },
  settingsFooter: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsDone: {
    height: 50,
    width: 250,
    backgroundColor: '#4138A9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 15,
  },
});

export default App;
