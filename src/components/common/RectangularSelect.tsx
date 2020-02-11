import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, Icons } from '../../constants';
import Picker from 'react-native-picker-select';
import Text from './CustomText';
import { strings } from '../../locales/strings';

interface RectangularSelectProps {
  placeholder?: string;
  containerStyle?: Object;
}

const RectangularSelect = ({
  placeholder = strings.certificate,
  containerStyle,
}: RectangularSelectProps) => {
  return (
    <Picker
      style={styles.container}
      onValueChange={e => {
      }}
      items={[]}>
      <View style={[styles.container, containerStyle]}>
        <Text style={styles.placeholder}>{placeholder}</Text>
        <Icons name={'down-chevron'} size={18} color={colors.gray} />
      </View>
    </Picker>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: colors.ultraLightGray,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  placeholder: {
    color: colors.gray,
  },
});

export default RectangularSelect;
