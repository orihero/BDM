import React, { useState } from 'react';
import { LayoutAnimation, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { withNavigation } from 'react-navigation';
import { colors, Icons } from '../../constants';
import Text from '../common/CustomText';
import { DrawerAction } from './DrawerContent';

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
  drawerVisible?: boolean;
  action?: DrawerAction,
  countPath?: string;
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
  drawerVisible
}) => {
  const [expanded, setExpanded] = useState(false);
  let closeDrawer = (action: DrawerAction) => {
    onPress(action)
    setExpanded(false);
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (!children && navigateTo) {
          navigation.navigate(navigateTo);
          return;
        }
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        if (!drawerVisible) {
          onPress({});
        }
        setExpanded(!expanded);
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
              <DrawerItem {...el} style={{ width: 40 }} onPress={() => closeDrawer(el.action)} />
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
