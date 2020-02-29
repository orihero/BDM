import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Icons, colors } from '../../constants';
import Text from './CustomText';

export interface DefaultCheckboxProps {
  color?: string;
  backgroundColor?: string;
  size?: number;
  activeColor?: string;
  activeBackColor?: string;
  index?: number;
  parentIndex?: number;
  setActive?: Function;
  isActive?: boolean;
  title: string;
}

const DefaultCheckbox = ({
  backgroundColor = 'transparent',
  size = 20,
  activeBackColor = colors.blue,
  setActive = () => { },
  index,
  isActive,
  title,
}: DefaultCheckboxProps) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setActive();
      }}>
      <View style={styles.row}>
        <View
          style={[
            styles.container,
            { width: size, height: size, borderRadius: size },
            isActive && { borderColor: activeBackColor },
          ]}>
          <View
            style={[
              isActive ? { backgroundColor: activeBackColor } : { backgroundColor },
              { width: size * 0.6, height: size * 0.6, borderRadius: size },
            ]}
          />
        </View>
        <Text style={styles.promptText}>{title}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
  },
  promptText: {
    color: colors.lightGray,
    fontSize: 16,
  },
});

export default DefaultCheckbox;
