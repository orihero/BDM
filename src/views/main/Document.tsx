import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { commonStyles, Icons, colors } from '../../constants';
import Text from '../../components/common/CustomText';
import { strings } from '../../locales/strings';
import { withNavigation } from 'react-navigation';
import { NavigationProps } from '../../utils/defaultPropTypes';

export interface DocumentProps {
  documentId: string;
  documentNumber: string;
  documentSentDate: string;
  documentDate: string;
  buyerName: string;
  sum: string;
  buyerTin: string;
  navigation: NavigationProps;
}

const Document: React.FC<DocumentProps> = ({
  documentId,
  documentDate,
  documentNumber,
  buyerName,
  sum,
  buyerTin,
  documentSentDate,
  navigation,
}) => {
  return (
    <TouchableWithoutFeedback onPress={() => {
      navigation.navigate('PdfViewer', { docId: documentId })
    }}>
      <View style={[commonStyles.shadow, styles.container]}>
        <View style={styles.row}>
          <Icons name={'stop'} color={colors.red} size={32} />
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.secondaryText}>#{documentId}</Text>
            <Text style={styles.secondaryText}>{`${documentDate}   №${documentNumber}`}</Text>
          </View>
        </View>
        <Text style={styles.title}>{buyerName}</Text>
        <View>
          <View
            style={[
              styles.row,
              {
                borderBottomWidth: 1,
                borderBottomColor: colors.ultraLightGray,
              },
            ]}>
            <Text style={styles.regularText}>{strings.amount}</Text>
            <Text style={styles.regularText}>{sum} сум</Text>
          </View>
          <View
            style={[
              styles.row,
              {
                borderBottomWidth: 1,
                borderBottomColor: colors.ultraLightGray,
              },
            ]}>
            <Text style={styles.regularText}>{strings.documentSentDate}</Text>
            <Text style={styles.regularText}>{documentSentDate}</Text>
          </View>
          <View
            style={[
              styles.row,
              {
                borderBottomWidth: 1,
                borderBottomColor: colors.ultraLightGray,
              },
            ]}>
            <Text style={styles.regularText}>{strings.signed}</Text>
            <Text style={styles.regularText}>{strings.yes}</Text>
          </View>
          <View
            style={[
              styles.row,
              {
                borderBottomWidth: 1,
                borderBottomColor: colors.ultraLightGray,
              },
            ]}>
            <Text style={styles.regularText}>{strings.inn}</Text>
            <Text style={styles.regularText}>{buyerTin}</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    borderRadius: 10,
    padding: 15,
    backgroundColor: colors.white,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 10,
  },
  secondaryText: {
    color: colors.gray,
    fontWeight: '100',
    fontSize: 16,
  },
  title: {
    fontWeight: 'bold',
    color: colors.blue,
    fontSize: 20,
  },
  regularText: {
    fontWeight: '400',
    color: colors.black,
    fontSize: 16,
  },
});

export default withNavigation(Document);
