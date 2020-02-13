import React, { Fragment } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import InnerHeader from '../../components/navigation/InnerHeader';
import { strings } from '../../locales/strings';
import { colors } from '../../constants';
import RectangularSelect from '../../components/common/RectangularSelect';
import RectangularInput from '../../components/common/RectangularInput';
import DefaultCheckbox from '../../components/common/DefaultCheckbox';
import GradientButton from '../../components/common/GradientButton';
import RoundButton from '../../components/common/RoundButton';
import { FieldType, FieldSize, FieldProps } from '../auth';
import FieldsRenderer from '../../components/generators/FieldsRenderer';

let fields: FieldProps[] = [
  {
    type: FieldType.SELECT,
    size: FieldSize.FULL,
    title: strings.inn,
    placeholder: '303911042 - Пономарев Дмитрий',
  },
  {
    type: FieldType.SELECT,
    size: FieldSize.FULL,
    title: strings.legalName,
    placeholder: 'SMART BUSINESS LAB',
  },
  {
    type: FieldType.COMPLEX,
    size: FieldSize.FULL,
    title: strings.address,
    placeholder: 'SMART BUSINESS LAB',
    rows: [
      [
        { type: FieldType.SELECT, placeholder: 'Ташкент', size: FieldSize.HALF },
        { type: FieldType.SELECT, placeholder: 'Ташкент', size: FieldSize.HALF },
      ],
      [
        {
          type: FieldType.INPUT,
          placeholder: 'Махмуд Тараби',
          size: FieldSize.HALF,
        },
        { type: FieldType.INPUT, placeholder: '25', size: FieldSize.HALF },
      ],
    ],
  },
  {
    type: FieldType.INPUT,
    placeholder: '63110',
    size: FieldSize.FULL,
    title: strings.okedCode,
  },
  {
    type: FieldType.INPUT,
    placeholder: 'Каримов Шамсиддин Шавка угли',
    size: FieldSize.FULL,
    title: strings.director,
  },
  {
    type: FieldType.INPUT,
    placeholder: 'Каримов Шамсиддин Шавка угли',
    size: FieldSize.FULL,
    title: strings.accauntant,
  },
  {
    type: FieldType.LINE,
    columns: [
      { size: FieldSize.QUARTER, type: FieldType.SELECT, placeholder: 'Да' },
      {
        type: FieldType.INPUT,
        placeholder: 'Рег.номер налогоплат…',
        size: FieldSize.QUERTER_THREE,
      },
    ],
    title: strings.nds,
  },
  {
    type: FieldType.LINE,
    columns: [
      {
        size: FieldSize.QUARTER,
        type: FieldType.INPUT,
        placeholder: strings.mfo,
      },
      {
        type: FieldType.INPUT,
        placeholder: strings.lightAccount,
        size: FieldSize.QUERTER_THREE,
      },
    ],
    title: strings.bankAccount,
  },
  {
    type: FieldType.LINE,
    columns: [
      {
        size: FieldSize.QUARTER,
        type: FieldType.SELECT,
        placeholder: strings.code,
      },
      {
        type: FieldType.INPUT,
        placeholder: strings.phoneNumber,
        size: FieldSize.QUERTER_THREE,
      },
    ],
    title: strings.phone,
  },
  {
    type: FieldType.INPUT,
    placeholder: 'Ваш email',
    size: FieldSize.FULL,
    title: strings.email,
  },
  {
    type: FieldType.CHECKBOX,
    title: `  ${strings.accept}`,
  },
];

const Profile = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}>
        <FieldsRenderer fields={fields} />
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <RoundButton
              full
              flex
              backgroundColor={colors.gray}
              text={strings.cancel}
            // onPress={() => navigation.navigate('Login')}
            />
          </View>
          <View style={{ flex: 1 }}>
            <GradientButton
              textColor={colors.white}
              fill
              flex
              text={strings.save}
            // onPress={() => navigation.navigate('Main')}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  container: {
    padding: 15,
  },
  inputTitle: {
    fontSize: 16,
    color: colors.gray,
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  half: {
    flex: 1,
    paddingRight: 5,
    marginBottom: 7.5,
  },
  quarter: {
    flex: 0.25,
    paddingRight: 5,
    marginBottom: 7.5,
  },
  quarterThree: {
    flex: 0.75,
    paddingRight: 5,
    marginBottom: 7.5,
  },
});

export { Profile };