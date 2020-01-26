import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  GestureResponderEvent,
  GestureResponderHandlers,
} from 'react-native';
import {measures, colors} from '../../constants';

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

const RoundButton = ({
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
          {backgroundColor, borderColor},
        ]}>
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
    paddingHorizontal: 40,
    borderRadius: measures.borderRadius * 3,
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

export default RoundButton;
