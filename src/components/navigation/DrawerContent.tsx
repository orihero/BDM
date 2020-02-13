import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { strings } from '../../locales/strings';
import DrawerItem, { DrawerItemProps } from './DrawerItem';
import { connect } from 'react-redux';

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
  type?: DrawerActionTypes;
  navigateTo?: string;
  boxType?: BoxType;
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
          navigateTo: 'NewDocument'
        },
      },
      {
        title: strings.threeSide,
        iconName: 'triple',
        iconSize: 24,
        action: {
          navigateTo: 'NewDocument'
        },
      },
    ],
  },
  {
    iconName: 'file-down',
    title: strings.inbox,
    action: {
      boxType: BoxType.inbox,
      type: DrawerActionTypes.changeBox
    },
    children: [
      {
        title: strings.recieved,
        iconName: 'download',
        feather: true,
        iconSize: 24,
        action: {
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
          status: DocumentStatus.deleted
        }
      },
    ],
  },
  {
    iconName: 'file-up',
    title: strings.outbox,
    action: {
      boxType: BoxType.outbox,
      type: DrawerActionTypes.changeBox
    },
    children: [
      {
        title: strings.recieved,
        iconName: 'send',
        feather: true,
        iconSize: 24,
        action: {
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
          status: DocumentStatus.deleted
        },
      },
    ],
  },
  {
    iconName: 'user',
    title: strings.personalCabinet,
    iconSize: 35,
    feather: true,
    action: {
      navigateTo: 'Account',
    }
  },
  {
    iconName: 'logout',
    // title: strings.logout,
    bottom: true,
    iconSize: 30,
    action: {
      navigateTo: 'Login',
    }
  },
];

const DrawerContent: React.FC<DrawerContentProps> = ({ navigation, onPress, expanded, boxType }) => {
  console.warn(boxType);

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
            return <DrawerItem key={i} {...e} active={boxType === e.action?.boxType} drawerVisible={expanded} onPress={onPress} />;
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

const mapStateToProps = ({ documents: { boxType, status, count } }) => ({
  boxType, status, count
});

const mapDispatchToProps = {

}


export default connect(mapStateToProps)(DrawerContent);