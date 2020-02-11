import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Animated, Dimensions } from 'react-native';
import Document, { DocumentProps } from './Document';
import DrawerContent from '../../components/navigation/DrawerContent';
import { colors } from '../../constants';
import Header from '../../components/navigation/Header';
import { strings } from '../../locales/strings';

let data: DocumentProps[] = [
  {
    id: '#4465',
    number: '№001',
    date: '26.11.2019',
    name: 'OOO The Mind',
    amount: '150 000 сум',
    type: 'Электронный',
    sent: '15.10.2019',
    signed: 'Да',
    inn: '45862185',
  },
  {
    id: '#4465',
    number: '№001',
    date: '26.11.2019',
    name: 'OOO The Mind',
    amount: '150 000 сум',
    type: 'Электронный',
    sent: '15.10.2019',
    signed: 'Да',
    inn: '45862185',
  },
  {
    id: '#4465',
    number: '№001',
    date: '26.11.2019',
    name: 'OOO The Mind',
    amount: '150 000 сум',
    type: 'Электронный',
    sent: '15.10.2019',
    signed: 'Да',
    inn: '45862185',
  },
];
const minW = 60;
const maxW = 300;
let { height } = Dimensions.get('window');

const Main = ({ navigation }) => {
  const [width, setWidth] = useState(new Animated.Value(minW))
  const [expanded, setExpanded] = useState(false);
  let toggle = () => {
    Animated.spring(width, { toValue: expanded ? minW : maxW }).start(() =>
      setExpanded(!expanded),
    );
  };
  return (
    <View>
      <Header title={strings.inbox} toggleDrawer={toggle} />
      <View style={styles.row}>
        <FlatList
          contentContainerStyle={styles.flatContainer}
          data={data}
          showsVerticalScrollIndicator={false}
          keyExtractor={(e, i) => i.toString()}
          renderItem={({ item }) => <Document {...item} />}
        />
        <Animated.View
          style={{
            width,
            position: 'absolute',
            zIndex: 5,
            backgroundColor: colors.white,
            height,
            // elevation: 5
          }}>
          <DrawerContent navigation={navigation} expanded={expanded} onPress={toggle} />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  flatContainer: { paddingBottom: 30, marginLeft: minW },
});

export { Main };
