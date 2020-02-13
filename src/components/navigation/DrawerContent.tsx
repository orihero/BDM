import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { strings } from '../../locales/strings';
import DrawerItem, { DrawerItemProps } from './DrawerItem';

interface DrawerContentProps {
  navigation: any;
  onPress?: Function;
  expanded?: boolean;
}

export enum BoxType {
  inbox = 1,
  outbox = 2
}

export enum DocumentStatus {
  sentOrRecieved = 10,
  uploaded = 11,
  signed = 30,
  rejected = 60,
  deleted = 71
}

export enum DrawerActionTypes {
  navigate = 0,
  changeBox = 1
}

export interface DrawerAction {
  type: DrawerActionTypes;
  navigateTo?: string;
  box?: BoxType;
  status?: DocumentStatus;
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
        action: {
          type: DrawerActionTypes.navigate,
          navigateTo: 'NewDocument'
        },
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
        action: {
          type: DrawerActionTypes.changeBox,
          box: BoxType.inbox,
          status: DocumentStatus.sentOrRecieved
        },
        countPath: 'inputBox.recieved'
      },
      {
        title: strings.signed,
        iconName: 'check-circle',
        feather: true,
        iconSize: 24,
        action: {
          type: DrawerActionTypes.changeBox,
          box: BoxType.inbox,
          status: DocumentStatus.signed
        },
        countPath: 'inputBox.signature'
      },
      {
        title: strings.rejected,
        iconName: 'delete',
        feather: true,
        iconSize: 24,
        action: {
          type: DrawerActionTypes.changeBox,
          box: BoxType.inbox,
          status: DocumentStatus.rejected
        },
        countPath: 'inputBox.reject'
      },
      {
        title: strings.trash,
        iconName: 'trash-2',
        feather: true,
        iconSize: 24,
        action: {
          type: DrawerActionTypes.changeBox,
          box: BoxType.inbox,
          status: DocumentStatus.deleted
        }
      },
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
        action: {
          type: DrawerActionTypes.changeBox,
          box: BoxType.outbox,
          status: DocumentStatus.sentOrRecieved
        },
        countPath: 'outputBox.sent'
      },
      {
        title: strings.signed,
        iconName: 'check-circle',
        feather: true,
        iconSize: 24,
        action: {
          type: DrawerActionTypes.changeBox,
          box: BoxType.outbox,
          status: DocumentStatus.signed
        },
        countPath: 'outputBox.signed'
      },
      {
        title: strings.rejected,
        iconName: 'delete',
        feather: true,
        iconSize: 24,
        action: {
          type: DrawerActionTypes.changeBox,
          box: BoxType.outbox,
          status: DocumentStatus.rejected
        },
        countPath: 'outputBox.rejected'
      },
      {
        title: strings.trash,
        iconName: 'trash-2',
        feather: true,
        iconSize: 24,
        action: {
          type: DrawerActionTypes.changeBox,
          box: BoxType.outbox,
          status: DocumentStatus.deleted
        },
      },
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

const DrawerContent: React.FC<DrawerContentProps> = ({ navigation, onPress, expanded }) => {
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* <View
          style={{
            paddingVertical: 30,
          }}>
          <Image source={logo} style={styles.logo} />
        </View> */}
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          showsVerticalScrollIndicator={false}>
          {menus.map((e, i) => {
            if (e.bottom) {
              return null;
            }
            return <DrawerItem key={i} {...e} drawerVisible={expanded} onPress={onPress} />;
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
  container: { paddingVertical: 30, paddingHorizontal: 5, flex: 1 },
  logo: { width: 200, height: 200 / 3.18 },
  logoutWrapper: {
    padding: 15,
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 80
  },
});

export default DrawerContent;
