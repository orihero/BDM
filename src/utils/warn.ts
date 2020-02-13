import {Platform, ToastAndroid} from 'react-native';

export let warnUser = text => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(text, ToastAndroid.SHORT);
  } else {
    alert(text);
  }
};
