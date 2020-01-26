import React, {Fragment} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {colors, Icons} from '../../constants';
import {strings} from '../../locales/strings';
import Text from '../../components/common/CustomText';
import idea from '../../assets/images/idea.png';
import {FieldType, FieldSize, FieldProps} from '../auth';
import RectangularInput from '../../components/common/RectangularInput';
import RectangularSelect from '../../components/common/RectangularSelect';
import DefaultCheckbox from '../../components/common/DefaultCheckbox';
import GradientButton from '../../components/common/GradientButton';

interface Props {}

let fields: FieldProps[] = [
  {
    type: FieldType.INPUT,
    size: FieldSize.FULL,
    title: strings.login1C,
    placeholder: strings.enterLogin,
  },
  {
    type: FieldType.INPUT,
    size: FieldSize.FULL,
    title: strings.password,
    placeholder: strings.enterPassword,
  },
];

export const Integration: React.FC<Props> = () => {
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
  return (
    <View style={styles.container}>
      <View style={[styles.flex, {flex: 0.6}]}>
        <View style={styles.prompt}>
          <View style={styles.row}>
            <Image source={idea} style={styles.image} />
            <Text style={styles.promptText}>
              {strings.prompt && strings.prompt.substr(0, 53)}
            </Text>
          </View>
          <Text style={styles.promptText}>
            {strings.prompt && strings.prompt.substr(53, strings.prompt.length)}
          </Text>
        </View>
      </View>
      <View style={styles.flex}>{renderFields(fields)}</View>
      <View
        style={[
          styles.flex,
          {
            justifyContent: 'flex-end',
            paddingHorizontal: 40,
            paddingVertical: 30,
          },
        ]}>
        <GradientButton full text={strings.register} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
    margin: 15,
  },
  prompt: {
    backgroundColor: colors.ultraLightGray,
    padding: 15,
  },
  promptText: {
    paddingLeft: 10,
    color: colors.gray,
    fontSize: 16,
    lineHeight: 25,
  },
  image: {
    width: 38,
    height: 44,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  inputTitle: {
    fontSize: 16,
    color: colors.gray,
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
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
