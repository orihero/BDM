import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  GestureResponderEvent,
  Dimensions,
} from 'react-native';
import {measures, colors} from '../../constants';

import LinearGradient from 'react-native-linear-gradient';

export interface RoundButtonProps {
  fill?: boolean;
  borderColor?: string;
  backgroundColor?: string;
  text?: string;
  textColor?: string;
  flex?: boolean;
  full?: boolean;
  big?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
}

const GradientButton = ({
  fill,
  borderColor = 'transparent',
  backgroundColor = 'transparent',
  text,
  full,
  onPress,
  textColor,
  big,
  flex,
}: RoundButtonProps) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={[
          styles.base,
          fill && styles.fill,
          full && styles.full,
          big && styles.big,
          flex && {flex: 1},
          {
            backgroundColor,
            borderColor,
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={StyleSheet.absoluteFill}
          colors={[colors.darkBlue, colors.blue]}
        />
        <Text
          style={[
            styles.textBase,
            fill && styles.textFill,
            textColor && {color: textColor},
          ]}>
          {text}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  base: {
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 200,
    borderWidth: 1,
    borderColor: colors.white,
    margin: 5,
    shadowOpacity: 0.33,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 2,
  },
  full: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: 55,
    // width: Dimensions.get('window').width - 30,
  },
  fill: {
    borderColor: colors.white,
    backgroundColor: colors.white,
  },
  textBase: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  textFill: {
    color: colors.black,
  },
  big: {
    height: 50,
    paddingHorizontal: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default GradientButton;
