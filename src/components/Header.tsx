import React from 'react';
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {Icons, colors} from '../constants';
import Text from './common/CustomText';
import {SafeAreaView} from 'react-navigation';

interface Props {
  title?: string;
  navigation: any;
}

export default ({title, navigation}: Props) => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <TouchableWithoutFeedback
          onPress={() => navigation.openDrawer && navigation.openDrawer()}>
          <Icons name={'menu'} color={colors.black} size={18} />
        </TouchableWithoutFeedback>
        <Text style={styles.title}>{title}</Text>
        <Icons name="down-chevron" color={colors.black} size={18} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    color: colors.black,
    fontWeight: 'bold',
  },
  wrapper: {
    backgroundColor: colors.white,
  },
});
