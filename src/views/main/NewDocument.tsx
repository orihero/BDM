import React from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
import { strings } from '../../locales/strings';
import InnerHeader from '../../components/navigation/InnerHeader';
import FieldsRenderer from '../../components/generators/FieldsRenderer';
import { FieldProps, FieldType, FieldSize } from '../auth';
import { colors } from '../../constants';

interface Props { }

let fields: FieldProps[] = [
  { type: FieldType.SELECT, title: strings.input, placeholder: strings.type, size: FieldSize.FULL },
  { type: FieldType.INPUT, title: strings.input, placeholder: strings.recieverInn, size: FieldSize.FULL },
  {
    type: FieldType.LINE, size: FieldSize.FULL, columns: [
      { type: FieldType.INPUT, title: strings.documentNumber, size: FieldSize.QUARTER, placeholder: strings.number, },
      { type: FieldType.SELECT, placeholder: strings.selectDate, size: FieldSize.QUERTER_THREE, title: strings.selectDate },
    ],
  },
  {
    type: FieldType.LINE, size: FieldSize.FULL, columns: [
      { type: FieldType.INPUT, title: strings.amount, size: FieldSize.QUERTER_THREE, placeholder: strings.enterAmount, },
      { type: FieldType.SELECT, placeholder: strings.uzs, size: FieldSize.QUARTER, title: strings.currency },
    ],
  },
  { type: FieldType.INPUT, title: strings.comments, placeholder: strings.enterComments, size: FieldSize.FULL },
  {
    type: FieldType.FILE, placeholder: strings.selectFile, size: FieldSize.FULL,
  },

]

const NewDocument: React.FC<Props> = () => {
  return <View style={styles.flex}>
    <InnerHeader
      back={'Main'}
      title={strings.newTwoSide}
    />
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <FieldsRenderer fields={fields} />
    </ScrollView>
  </View>
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: 15,
  },
  flex: { flex: 1 }
});

export { NewDocument };
