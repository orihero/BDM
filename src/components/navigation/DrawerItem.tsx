import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  LayoutAnimation,
} from 'react-native';
import { Icons, colors } from '../../constants';
import Text from '../common/CustomText';
import { withNavigation } from 'react-navigation';
import Feather from 'react-native-vector-icons/Feather';

export interface DrawerItemProps {
  iconName?: string;
  title?: string;
  children?: DrawerItemProps[];
  bottom?: boolean;
  navigateTo?: string;
  iconSize?: number;
  navigation?: any;
  feather?: boolean;
  style?: any;
  onPress?: Function;
}

const DrawerItem: React.FC<DrawerItemProps> = ({
  iconName,
  title,
  children,
  iconSize = 40,
  navigation,
  navigateTo,
  feather,
  style,
  onPress,
}) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (!children && navigateTo) {
          navigation.navigate(navigateTo);
          return;
        }
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
        onPress();
      }}>
      <View>
        <View style={styles.container}>
          <View style={styles.left}>
            <View style={[styles.iconWrapper, style]}>
              {iconName &&
                iconName !== '' &&
                (feather ? (
                  <Feather
                    name={iconName}
                    size={iconSize}
                    color={colors.black}
                  />
                ) : (
                    <Icons name={iconName} size={iconSize} color={colors.black} />
                  ))}
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.title}>{title}</Text>
            </View>
          </View>
          {children && (
            <Icons
              name={'down-chevron'}
              style={{ transform: [{ rotateX: expanded ? '180deg' : '0deg' }] }}
              size={18}
            />
          )}
        </View>
        <View style={styles.childsContainer}>
          {expanded &&
            children &&
            children.map(el => (
              <DrawerItem {...el} style={{ width: 40 }} onPress={onPress} />
            ))}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconWrapper: {
    justifyContent: 'center',
    width: 60,
  },
  title: {
    fontWeight: '400',
    fontSize: 18,
    textAlignVertical: 'center',
    width: 150,
  },
  left: {
    flexDirection: 'row',
  },
  childsContainer: {
    paddingLeft: 10,
  },
});

export default withNavigation(DrawerItem);
