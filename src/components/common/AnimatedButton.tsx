import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  LayoutAnimation,
  ActivityIndicator,
} from 'react-native';
import {measures, colors} from '../../constants';

export interface AnimatedButtonProps {
  fill?: boolean;
  borderColor?: string;
  backgroundColor?: string;
  text?: string;
  full?: boolean;
  loading?: boolean;
  bold?: boolean;
  onPress?: Function;
  maxSize?: number;
  minSize?: number;
}

const AnimatedButton = ({
  fill,
  borderColor = colors.white,
  backgroundColor = 'transparent',
  text = '',
  full,
  loading,
  onPress,
  maxSize = 200,
  minSize = 60,
  bold,
}: AnimatedButtonProps) => {
  const [width, setWidth] = useState(maxSize);
  const [expanded, setExpanded] = useState(false);
  let onLayout = ({nativeEvent}) => {
    if (width === 0) {
      console.warn(nativeEvent);
      setWidth(nativeEvent.layout.width);
    }
  };
  let animation = new Animated.Value(width);
  let revert = () => {};
  useEffect(() => {
    if (loading) {
    } else {
    }
  }, [loading]);
  let animate = () => {
    Animated.timing(animation, {
      duration: 100,
      toValue: width === maxSize ? minSize : maxSize,
    }).start(() => setWidth(width === maxSize ? minSize : maxSize));
  };
  let localPress = () => {
    animate();
    if (width === maxSize) {
      setTimeout(() => {
        animate();
      }, 1000);
    }
    onPress();
  };
  let opacity = animation.interpolate({
    inputRange: [minSize, maxSize],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  let height = animation.interpolate({
    inputRange: [minSize, maxSize],
    outputRange: [minSize, 55],
  });
  return (
    <TouchableWithoutFeedback onPress={localPress}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Animated.View
          onLayout={onLayout}
          style={[
            styles.base,
            fill && styles.fill,
            full && styles.full,
            {backgroundColor, borderColor, width: animation, height},
          ]}>
          <Animated.Text style={{opacity, fontWeight: bold ? 'bold' : '400'}}>
            {text}
          </Animated.Text>
          {width === minSize && (
            <View style={{position: 'absolute'}}>
              <ActivityIndicator size={'large'} color={colors.accent} />
            </View>
          )}
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: measures.borderRadius * 3,
    borderWidth: 1,
    borderColor: colors.white,
    margin: 5,
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
});

export default AnimatedButton;
