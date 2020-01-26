import React, {Fragment} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {FieldType, FieldSize, FieldProps} from '../../views';
import DefaultCheckbox from '../common/DefaultCheckbox';
import RectangularSelect from '../common/RectangularSelect';
import RectangularInput from '../common/RectangularInput';
import {colors} from '../../constants';
import {strings} from '../../locales/strings';

interface FieldRendererProps {
  fields: FieldProps[];
}

const FieldsRenderer = ({fields}: FieldRendererProps) => {
  let renderFields = fields => {
    return fields.map(e => {
      switch (e.type) {
        case FieldType.CHECKBOX:
          return (
            <View style={{marginVertical: 15}}>
              <DefaultCheckbox title={e.title} />
            </View>
          );
        case FieldType.SELECT:
          if (e.size === FieldSize.FULL) {
            return (
              <Fragment>
                <Text style={styles.inputTitle}>{e.title}</Text>
                <RectangularSelect placeholder={e.placeholder} />
              </Fragment>
            );
          }
          return (
            <View style={styles[e.size]}>
              <RectangularSelect placeholder={e.placeholder} />
            </View>
          );
        case FieldType.INPUT:
          if (e.size === FieldSize.FULL) {
            return (
              <Fragment>
                <Text style={styles.inputTitle}>{e.title}</Text>
                <RectangularInput placeholder={e.placeholder} />
              </Fragment>
            );
          }
          return (
            <View style={styles[e.size]}>
              <RectangularInput placeholder={e.placeholder} />
            </View>
          );
        case FieldType.COMPLEX:
          return (
            <Fragment>
              <Text style={styles.inputTitle}>{strings.address}</Text>
              {e.rows &&
                e.rows.map(el => {
                  return <View style={styles.row}>{renderFields(el)}</View>;
                })}
            </Fragment>
          );
        case FieldType.LINE:
          return (
            <Fragment>
              <Text style={styles.inputTitle}>{e.title}</Text>
              <View style={styles.row}>{renderFields(e.columns)}</View>
            </Fragment>
          );
        default:
          return null;
      }
    });
  };
  return renderFields(fields);
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

export default FieldsRenderer;
