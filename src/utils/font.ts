import {Platform, StatusBar, Dimensions} from 'react-native';

function isIphoneX() {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 896 || dimen.width === 896)
  );
}

const {height, width} = Dimensions.get('window');
const standardLength = width > height ? width : height;

const deviceHeight = isIphoneX()
  ? standardLength - 78 // iPhone X style SafeAreaView size in portrait
  : Platform.OS === 'android'
  ? standardLength - StatusBar.currentHeight
  : standardLength;

export function RFPercentage(percent) {
  const heightPercent = (percent * deviceHeight) / 100;
  return Math.round(heightPercent);
}
