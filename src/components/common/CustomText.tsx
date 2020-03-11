import React from 'react';
import { View, Text as RnText, StyleSheet } from 'react-native';

const Text = ({ style, children, ...rest }) => {
  let baseStyle = styles.medium;
  if (style) {
    baseStyle = style.fontWeght === 'bold' ? styles.bold : styles.light;
  }
  return <RnText style={[baseStyle, style]} {...rest}>{children}</RnText>;
};

const styles = StyleSheet.create({
  bold: {
    fontFamily: 'Lato-Bold',
  },
  light: {
    fontFamily: 'Lato-Light',
  },
  medium: {
    fontFamily: 'Lato-Black',
  },
});

export default Text;
