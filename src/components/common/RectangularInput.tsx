import React from 'react';
import {View, TextInput, StyleSheet, Platform} from 'react-native';
import {colors} from '../../constants';
import {strings} from '../../locales/strings';

interface RectangularInputProps {
  placeholder?: string;
}

const RectangularInput = ({placeholder}: RectangularInputProps) => {
  return (
    <View style={styles.container}>
      <TextInput placeholder={placeholder} placeholderTextColor={colors.gray} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: colors.ultraLightGray,
    padding: Platform.select({android: 6, ios: 20}),
    paddingHorizontal: 20,
  },
});

export default RectangularInput;
