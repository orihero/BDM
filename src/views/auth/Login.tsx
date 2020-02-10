import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  LayoutAnimation,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Linking,
} from 'react-native';
import logo from '../../assets/images/logo.png';
import Text from '../../components/common/CustomText';
import DefaultCheckbox from '../../components/common/DefaultCheckbox';
import GradientButton from '../../components/common/GradientButton';
import RectangularInput from '../../components/common/RectangularInput';
import RectangularSelect from '../../components/common/RectangularSelect';
import {colors, commonStyles} from '../../constants';
import {strings} from '../../locales/strings';
import IntentLauncher from 'react-native-intent-launcher';
import base64 from 'react-native-base64';

let convertStringToByteArray = str => {
  var bytes = [];
  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }
  var byteArray = bytes;
  return byteArray;
};

let api_key =
  '86E2F10BA6CD237ADA76579102E1FD147561C390055B062FE5AC49957B1D1A54A266EF04A0E3C9AF6DFD65104E78B08524FF3FA769FDAB47C49DFEC1021A77D4';
let serial_number = 'number';
let message = convertStringToByteArray('77a76bf$1558607640$150308');
let append_pkcs7 = convertStringToByteArray('');

let intentLauncher = () => {
  // const Buffer = require('buffer').Buffer;
  // let encodedAuth = new Buffer('your text').toString('base64');
  let extra = {api_key, serial_number, message};
  IntentLauncher.startActivity({
    packageName: 'uz.yt.eimzo',
    className: 'uz.yt.eimzo.activity.MainActivity',
    extra,
    message: `{
"tin":"566584586",

"fullName":"BARATOV BEGZOD RUSTAM O‘G‘LI",
"organization":"BARATOV BEGZOD RUSTAM O‘G‘LI"
}`,
    serial_number,
    api_key,
  })
    .then(e => {
      console.warn(e);
    })
    .catch(e => console.warn(e));
};

let linking = () => {
  Linking.sendIntent('uz.yt.eimzo', {
    api_key,
    serial_number,
    append_pkcs7,
  }).then(res => {
    console.warn(res);
  });
};

let {width} = Dimensions.get('window');

const Login = ({navigation}) => {
  const [remember, setRemember] = useState(false);
  let onLogin = () => {
    intentLauncher();
  };
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          commonStyles.centeredContainer,
          {alignItems: 'flex-start', padding: 15},
        ]}>
        <Image source={logo} style={styles.image} />
      </View>
      <View style={styles.container}>
        <Text style={styles.promptText}>{strings.toBegin}</Text>
        <Text style={styles.enterAccount}>{strings.enterAccount}</Text>
        {!remember ? (
          <View style={{justifyContent: 'space-around', flex: 1}}>
            <RectangularInput placeholder={strings.enterLogin} />
            <RectangularInput placeholder={strings.enterPassword} />
          </View>
        ) : (
          <View style={{justifyContent: 'center', flex: 1}}>
            <RectangularSelect />
          </View>
        )}
      </View>
      <View style={styles.footer}>
        <View>
          <View style={styles.row}>
            <DefaultCheckbox
              isActive={remember}
              setActive={() => {
                LayoutAnimation.configureNext(
                  LayoutAnimation.create(
                    200,
                    LayoutAnimation.Types.easeInEaseOut,
                    LayoutAnimation.Properties.scaleXY,
                  ),
                );
                setRemember(!remember);
              }}
              title={`  ${strings.remember}`}
            />
            <Text style={styles.promptText}>{strings.forgotPassword}</Text>
          </View>
          <GradientButton onPress={onLogin} full text={strings.login} />
        </View>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('Register')}>
          <View style={styles.footerBottom}>
            <Text style={styles.promptSmallText}>{strings.noAccount}</Text>
            <Text style={styles.promptBoldText}>
              {'   '}
              {strings.register}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: colors.white,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  footerBottom: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  image: {
    width: width - 100,
    height: (width - 100) / 3.18,
  },
  promptText: {
    color: colors.lightGray,
    fontSize: 18,
  },
  promptBoldText: {
    color: colors.black,
    fontSize: 14,
    fontWeight: 'bold',
  },
  promptSmallText: {
    color: colors.black,
    fontSize: 14,
  },
  enterAccount: {
    color: colors.black,
    fontSize: 26,
    fontWeight: 'bold',
  },
  footer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export {Login};
