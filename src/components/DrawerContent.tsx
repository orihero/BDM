import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import {strings} from '../locales/strings';
import DrawerItem, {DrawerItemProps} from './DrawerItem';

interface DrawerContentProps {
  navigation: any;
  onPress?: Function;
}

let menus: DrawerItemProps[] = [
  {
    iconName: 'add-file',
    title: strings.create,
    children: [
      {
        title: strings.twoSide,
        iconName: 'double',
        iconSize: 24,
      },
      {
        title: strings.threeSide,
        iconName: 'triple',
        iconSize: 24,
      },
    ],
  },
  {
    iconName: 'file-down',
    title: strings.inbox,
    children: [
      {
        title: strings.recieved,
        iconName: 'download',
        feather: true,
        iconSize: 24,
      },
      {
        title: strings.signed,
        iconName: 'check-circle',
        feather: true,
        iconSize: 24,
      },
      {
        title: strings.rejected,
        iconName: 'delete',
        feather: true,
        iconSize: 24,
      },
      {title: strings.trash, iconName: 'trash-2', feather: true, iconSize: 24},
    ],
  },
  {
    iconName: 'file-up',
    title: strings.outbox,
    children: [
      {
        title: strings.recieved,
        iconName: 'send',
        feather: true,
        iconSize: 24,
      },
      {
        title: strings.signed,
        iconName: 'check-circle',
        feather: true,
        iconSize: 24,
      },
      {
        title: strings.rejected,
        iconName: 'delete',
        feather: true,
        iconSize: 24,
      },
      {title: strings.trash, iconName: 'trash-2', feather: true, iconSize: 24},
    ],
  },
  {
    iconName: 'user',
    title: strings.personalCabinet,
    iconSize: 35,
    navigateTo: 'Account',
    feather: true,
  },
  {
    iconName: 'logout',
    title: strings.logout,
    bottom: true,
    iconSize: 30,
    navigateTo: 'Login',
  },
];

const DrawerContent: React.FC<DrawerContentProps> = ({navigation, onPress}) => {
  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={styles.container}>
        {/* <View
          style={{
            paddingVertical: 30,
          }}>
          <Image source={logo} style={styles.logo} />
        </View> */}
        <ScrollView
          contentContainerStyle={{flex: 1}}
          showsVerticalScrollIndicator={false}>
          {menus.map((e, i) => {
            if (e.bottom) {
              return null;
            }
            return <DrawerItem key={i} {...e} onPress={onPress} />;
          })}
        </ScrollView>
      </SafeAreaView>
      <View style={styles.logoutWrapper}>
        <DrawerItem {...menus[menus.length - 1]} onPress={onPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {paddingVertical: 30, paddingHorizontal: 5, flex: 1},
  logo: {width: 200, height: 200 / 3.18},
  logoutWrapper: {
    padding: 15,
  },
});

export default DrawerContent;
