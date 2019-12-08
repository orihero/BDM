import React from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {Icons, colors} from '../../constants';

export interface DefaultCheckboxProps {
  color?: string;
  backgroundColor?: string;
  size?: number;
  activeColor?: string;
  activeBackColor?: string;
  index?: number;
  parentIndex?: number;
  setActive: Function;
  isActive?: boolean;
}

const DefaultCheckbox = ({
  backgroundColor = 'transparent',
  size = 20,
  activeBackColor = colors.yellow,
  setActive,
  index,
  isActive,
}: DefaultCheckboxProps) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setActive();
      }}>
      <View
        style={[
          styles.container,
          {width: size, height: size, borderRadius: size},
        ]}>
        <View
          style={[
            styles.innerContainer,
            isActive ? {backgroundColor: activeBackColor} : {backgroundColor},
            {width: size * 0.6, height: size * 0.6, borderRadius: size},
          ]}></View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.black,
  },
  innerContainer: {},
});

export default DefaultCheckbox;
