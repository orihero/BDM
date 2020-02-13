import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Icons, colors } from '../../constants';
import Text from '../common/CustomText';
import { SafeAreaView, withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { strings } from '../../locales/strings';

interface Props {
  title?: string;
  navigation: any;
  toggleDrawer?: Function
}

let Header = ({ navigation, toggleDrawer = () => { }, boxType }: Props) => {
  let title = boxType === 2 ? strings.outbox : strings.inbox;
  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <TouchableWithoutFeedback
          onPress={toggleDrawer}>
          <Icons name={'menu'} color={colors.black} size={18} />
        </TouchableWithoutFeedback>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.row}>
          <Icons name="filter" color={colors.black} style={styles.mr10} size={18} />
          <Icons name="search" color={colors.black} size={18} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = ({ documents: { boxType, status } }) => ({
  boxType, status
})



export default connect(mapStateToProps)(withNavigation(Header))

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    color: colors.black,
    fontWeight: 'bold',
  },
  wrapper: {
    backgroundColor: colors.white,
  },
  row: {
    flexDirection: 'row'
  },
  mr10: {
    marginRight: 10
  },
});
