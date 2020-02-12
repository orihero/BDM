import React from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import { HeaderBackButton } from 'react-navigation-stack';
import { colors } from '../../constants';
import { strings } from '../../locales/strings';
import Text from '../common/CustomText';

const InnerHeader = withNavigation(
  ({ navigation, back, transparent, title = strings.settings }) => {
    return (
      <SafeAreaView
        style={[
          styles.container,
          transparent && { backgroundColor: colors.white },
        ]}>
        {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
        <View style={styles.header}>
          <View style={[styles.side]}>
            <HeaderBackButton
              tintColor={colors.black}
              onPress={() => {
                if (back) navigation.navigate(back);
                else navigation.goBack();
              }}
            />
          </View>
          <View style={styles.headerMiddle}>
            <Text style={styles.headerText}>{title}</Text>
          </View>
          <View style={styles.side} />
        </View>
        {!transparent && <View style={styles.border} />}
      </SafeAreaView>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    paddingBottom: 10,
    alignItems: 'center',
  },
  side: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: colors.black,
    fontSize: 18,
    fontWeight: 'bold'
  },
  headerMiddle: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flex: 0.8,
  },
  border: {
    height: 1,
    backgroundColor: colors.extraGray,
    flexDirection: 'row',
    marginHorizontal: 15,
  },
});

export default InnerHeader;
