import React from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
import { strings } from '../../locales/strings';
import InnerHeader from '../../components/navigation/InnerHeader';
import FieldsRenderer from '../../components/generators/FieldsRenderer';
import { FieldProps, FieldType, FieldSize } from '../auth';
import { colors } from '../../constants';
import GradientButton from '../../components/common/GradientButton';
import RoundButton from '../../components/common/RoundButton';
import { requests } from '../../api/requests';
import { createDocument } from '../../redux/actions'
import { connect } from 'react-redux';
import BlurWrapper from '../../components/containers/BlurWrapper';

interface Props { }

let fields: FieldProps[] = [
  { type: FieldType.SELECT, title: strings.input, placeholder: strings.type, size: FieldSize.FULL, name: 'type', fetch: requests.documents.getDocumentTypes },
  { type: FieldType.INPUT, title: strings.input, placeholder: strings.recieverInn, size: FieldSize.FULL, name: 'buyerTin' },
  {
    type: FieldType.LINE, size: FieldSize.FULL, columns: [
      { type: FieldType.INPUT, title: strings.documentNumber, size: FieldSize.QUARTER, placeholder: strings.number, name: 'document.documentNumber' },
      { type: FieldType.DATE_PICKER, placeholder: strings.selectDate, size: FieldSize.QUERTER_THREE, title: strings.selectDate, name: 'document.documentDate' },
    ],
  },
  {
    type: FieldType.LINE, size: FieldSize.FULL, columns: [
      { type: FieldType.INPUT, title: strings.amount, size: FieldSize.QUERTER_THREE, placeholder: strings.enterAmount, name: 'sum' },
      {
        type: FieldType.SELECT, placeholder: strings.uzs, size: FieldSize.QUARTER, title: strings.currency, name: 'currencyId',
        staticValue: [{ label: 'UZS', actualValue: 1, value: 0 }, { label: 'USD', actualValue: 2, value: 1 }, { label: 'RUB', actualValue: 3, value: 2 }, { label: 'EUR', actualValue: 4, value: 3 },]
      },
    ],
  },
  { type: FieldType.INPUT, title: strings.comments, placeholder: strings.enterComments, size: FieldSize.FULL, name: 'description' },
  {
    type: FieldType.FILE, placeholder: strings.selectFile, size: FieldSize.FULL, name: 'file'
  },
]

const NewDocument: React.FC<Props> = ({ navigation, createDocument }) => {
  let footer = ({ getSubmitData }) => {
    let onSubmit = () => {
      //TODO On submit
      //* Indices are stored
      // switch (data.type) {
      //   case :

      //     break;

      //   default:
      //     break;
      // }
      let data = getSubmitData();
      createDocument(data)
    }
    let onCancel = () => {
      navigation.goBack();
    }
    return <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <RoundButton
          full
          flex
          backgroundColor={colors.gray}
          text={strings.cancel}
          onPress={onCancel}
        />
      </View>
      <View style={{ flex: 1 }}>
        <GradientButton
          textColor={colors.white}
          fill
          flex
          text={strings.create}
          onPress={onSubmit}
        />
      </View>
    </View>
  }
  return <BlurWrapper>
    <View style={styles.flex}>
      <InnerHeader
        back={'Main'}
        title={strings.newTwoSide}
      />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <FieldsRenderer fields={fields} footer={footer} />
      </ScrollView>
    </View>
  </BlurWrapper>
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

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {
  createDocument
}


let Connected = connect(mapStateToProps, mapDispatchToProps)(NewDocument)

export { Connected as NewDocument };
