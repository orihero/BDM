import React, { useState } from 'react';
import { Dimensions, Image, LayoutAnimation, SafeAreaView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { connect } from 'react-redux';
import logo from '../../assets/images/logo.png';
import Text from '../../components/common/CustomText';
import DefaultCheckbox from '../../components/common/DefaultCheckbox';
import GradientButton from '../../components/common/GradientButton';
import RectangularSelect from '../../components/common/RectangularSelect';
import { colors, commonStyles } from '../../constants';
import { strings } from '../../locales/strings';
import { requestUserLogin } from '../../redux/actions';
import BlurWrapper from '../../components/containers/BlurWrapper'

let { width } = Dimensions.get('window');

const mapDispatchToProps = {
  requestUserLogin
}


const Login = ({ navigation, requestUserLogin }) => {
  const [remember, setRemember] = useState(true);
  let onLogin = () => {
    requestUserLogin(remember);
  };
  return (
    <BlurWrapper >
      <SafeAreaView style={styles.container}>
        <View
          style={[
            commonStyles.centeredContainer,
            { alignItems: 'flex-start', padding: 15, flex: 1.2 },
          ]}>
          <Image source={logo} style={styles.image} />
        </View>
        {/* <View style={[styles.container,]}>
          <Text style={styles.promptText}>{strings.toBegin}</Text>
          <Text style={styles.enterAccount}>{strings.enterAccount}</Text>
        </View> */}
        <View style={{ paddingHorizontal: 20 }}>
          <DefaultCheckbox
            style={{ marginBottom: 20 }}
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
          <GradientButton onPress={onLogin} full text={strings.login} />
        </View>
        <View style={styles.footer}>
          <Text style={{ textAlign: 'center' }}>
            ТЕХНИЧЕСКАЯ ПОДДЕРЖКА {'\n'}
            +998 95 194 24 24{'\n'}
            info@24m.uz
            </Text>
        </View>
      </SafeAreaView>
    </BlurWrapper>
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
    flex: .8,
    justifyContent: 'flex-end',
  },
});

let WrappedLogin = connect(null, mapDispatchToProps)(Login)

export { WrappedLogin as Login };

{/* <TouchableWithoutFeedback
            onPress={() => navigation.navigate('Register')}>
            <View style={styles.footerBottom}>
              <Text style={styles.promptSmallText}>{strings.noAccount}</Text>
              <Text style={styles.promptBoldText}>
                {'   '}
                {strings.register}
              </Text>
            </View>
          </TouchableWithoutFeedback> */}

{/* <View style={{ justifyContent: 'center', flex: 1 }}>
            <RectangularSelect disabled />
          </View> */}