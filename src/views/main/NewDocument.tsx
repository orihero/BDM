import React from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
import { strings } from '../../locales/strings';
import InnerHeader from '../../components/navigation/InnerHeader';
import FieldsRenderer from '../../components/generators/FieldsRenderer';
import { FieldProps, FieldType, FieldSize } from '../auth';
import { colors } from '../../constants';
import GradientButton from '../../components/common/GradientButton';
import RoundButton from '../../components/common/RoundButton';

interface Props { }

let fields: FieldProps[] = [
  { type: FieldType.SELECT, title: strings.input, placeholder: strings.type, size: FieldSize.FULL, name: 'type' },
  { type: FieldType.INPUT, title: strings.input, placeholder: strings.recieverInn, size: FieldSize.FULL, name: 'buyerTin' },
  {
    type: FieldType.LINE, size: FieldSize.FULL, columns: [
      { type: FieldType.INPUT, title: strings.documentNumber, size: FieldSize.QUARTER, placeholder: strings.number, name: 'document.documentNumber' },
      { type: FieldType.SELECT, placeholder: strings.selectDate, size: FieldSize.QUERTER_THREE, title: strings.selectDate, name: 'document.documentDate' },
    ],
  },
  {
    type: FieldType.LINE, size: FieldSize.FULL, columns: [
      { type: FieldType.INPUT, title: strings.amount, size: FieldSize.QUERTER_THREE, placeholder: strings.enterAmount, name: 'sum' },
      {
        type: FieldType.SELECT, placeholder: strings.uzs, size: FieldSize.QUARTER, title: strings.currency, name: 'currencyId',
        staticValue: [{ label: 'UZS', value: 1 }, { label: 'USD', value: 2 }, { label: 'RUB', value: 3 }, { label: 'EUR', value: 4 },]
      },
    ],
  },
  { type: FieldType.INPUT, title: strings.comments, placeholder: strings.enterComments, size: FieldSize.FULL, name: 'description' },
  {
    type: FieldType.FILE, placeholder: strings.selectFile, size: FieldSize.FULL,
  },
]

const NewDocument: React.FC<Props> = ({ navigation }) => {
  let onSubmit = () => { }
  let onCancel = () => {
    navigation.goBack();
  }
  let footer = ({ data }) => {
    console.warn(data);

    return <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <RoundButton
          full
          flex
          backgroundColor={colors.gray}
          text={strings.cancel}
          onPress={() => navigation.navigate('Login')}
        />
      </View>
      <View style={{ flex: 1 }}>
        <GradientButton
          textColor={colors.white}
          fill
          flex
          text={strings.next}
          onPress={() => navigation.navigate('Main')}
        />
      </View>
    </View>
  }
  return <View style={styles.flex}>
    <InnerHeader
      back={'Main'}
      title={strings.newTwoSide}
    />
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <FieldsRenderer fields={fields} footer={footer} />
    </ScrollView>
  </View>
};



const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: 15,
  },
  flex: { flex: 1 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
});

export { NewDocument };
