import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import Text from '../../components/common/CustomText';
import GradientButton from '../../components/common/GradientButton';
import RectangularSelect from '../../components/common/RectangularSelect';
import RoundButton from '../../components/common/RoundButton';
import BlurWrapper from '../../components/containers/BlurWrapper';
import FieldsRenderer from '../../components/generators/FieldsRenderer';
import InnerHeader from '../../components/navigation/InnerHeader';
import { colors } from '../../constants';
import { strings } from '../../locales/strings';
import { createDocument } from '../../redux/actions';
import { NavigationProps } from '../../utils/defaultPropTypes';
import { FieldProps, FieldSize, FieldType, TitleType } from '../auth';
import { requests } from '../../api/requests';

interface Props {
  createDocument: Function;
}

const NewDocument: React.FC<Props & NavigationProps> = ({ navigation, createDocument }) => {
  const [documentType, setDocumentType] = useState(null);
  const [documentTypes, setDocumentTypes] = useState([]);
  let docType = documentType && documentTypes.length > 0 ? documentTypes[documentType].actualValue : 0
  let initialFields: FieldProps[] = [
    // { type: FieldType.SELECT, title: strings.type, placeholder: strings.type, size: FieldSize.FULL, name: 'type', fetch: () => requests.documents.getDocumentTypes(2), map: (e, index) => ({ value: index, label: e.docTypeName, actualValue: e.docTypeCode }) },
    { type: FieldType.INPUT, title: strings.documentName, placeholder: strings.documentName, size: FieldSize.FULL, name: 'other', visible: docType === 10 },
    { type: FieldType.INPUT, title: strings.recieverInn, placeholder: strings.recieverInn, size: FieldSize.FULL, name: 'buyerTin' },
    { type: FieldType.INPUT, title: strings.companyName, placeholder: strings.companyName, size: FieldSize.FULL, name: 'buyerCompanyName' },
    {
      type: FieldType.LINE, size: FieldSize.FULL, columns: [
        { type: FieldType.INPUT, title: strings.documentNumber, size: FieldSize.QUARTER, placeholder: strings.number, name: 'document.documentNumber' },
        { type: FieldType.DATE_PICKER, placeholder: strings.selectDate, size: FieldSize.QUERTER_THREE, title: strings.selectDate, name: 'document.documentDate' },
      ],
    },
    {
      type: FieldType.LINE, size: FieldSize.FULL, columns: [
        { type: FieldType.INPUT, title: strings.documentNumber, size: FieldSize.QUARTER, placeholder: strings.contractNumber, name: 'contract.contractNumber' },
        { type: FieldType.DATE_PICKER, placeholder: strings.selectDate, size: FieldSize.QUERTER_THREE, title: strings.contractDate, name: 'contract.contractDate' },
      ],
      visible: docType === 3 || docType === 4 || docType === 6
    },
    { type: FieldType.CHECKBOX, title: strings.hasIndividualPerson, placeholder: strings.recieverInn, size: FieldSize.FULL, name: 'hasIndividualPerson' },
    { type: FieldType.INPUT, placeholder: strings.individualTin, size: FieldSize.FULL, name: 'individualPerson.tin' },
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
      type: FieldType.FILE, placeholder: strings.selectFile, size: FieldSize.FULL, name: 'file', visible: docType !== 2
    },
  ];
  const [fields, setFields] = useState(initialFields)
  let effect = async () => {
    try {
      let res = await requests.documents.getDocumentTypes(2);
      console.warn(res);
      setDocumentTypes(res.data.map((e, i) => ({ label: e.docTypeName, value: i, actualValue: e.docTypeCode })))
    } catch (res) {
      console.warn(res.response);
    }
  }
  useEffect(() => {
    setFields(initialFields)
    console.warn(initialFields[3].visible);

  }, [documentType])
  useEffect(() => {
    effect();
  }, [])

  let footer = ({ getSubmitData }) => {
    let onSubmit = () => {
      let data = getSubmitData();
      createDocument(data)
    }
    let onCancel = () => {
      navigation.goBack();
    }
    return <View>
      <View style={styles.productsContainer}>
        <Text style={styles.inputTitle}>{strings.products}</Text>
      </View>
      <View style={styles.row}>
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
            text={strings.send}
            onPress={onSubmit}
          />
        </View>
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
        <View>
          <Text style={styles.inputTitle}>{strings.type}</Text>
          <RectangularSelect value={documentType} items={documentTypes} onChange={(val) => { setDocumentType(val); }} placeholder={strings.type} />
        </View>
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
  },
  inputTitle: {
    fontSize: 16,
    color: colors.gray,
    marginVertical: 10,
  },
  productsContainer: {
    margin: 15,
    padding: 15,
    borderWidth: 1,
    borderStyle: 'dashed'
  }
});

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {
  createDocument
}


let Connected = connect(mapStateToProps, mapDispatchToProps)(NewDocument)

export { Connected as NewDocument };

