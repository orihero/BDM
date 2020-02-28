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
import { connect } from 'react-redux';
import { requests } from '../../api/requests';

const Profile = ({ navigation, user }) => {
    let visible = user.data.legalUser;
    let fields: FieldProps[] = [
        {
            type: FieldType.INPUT,
            size: FieldSize.FULL,
            title: strings.inn,
            placeholder: '303911042 - Пономарев Дмитрий',
            disabled: true,
            name: 'tin'
        },
        {
            type: FieldType.INPUT,
            size: FieldSize.FULL,
            title: strings.legalName,
            placeholder: 'SMART BUSINESS LAB',
            disabled: true,
            name: 'name'
        },
        {
            type: FieldType.COMPLEX,
            size: FieldSize.FULL,
            title: strings.address,
            rows: [
                [
                    { name: 'regionId', type: FieldType.SELECT, placeholder: strings.region, size: FieldSize.HALF, fetch: requests.helper.getRegions, map: (e, index) => ({ value: index, label: e.name, actualValue: e.id }) },
                    { name: 'districtId', type: FieldType.SELECT, placeholder: strings.town, size: FieldSize.HALF, fetch: requests.helper.getDistricts, map: (e, index) => ({ value: index, label: e.name, actualValue: e.id }), fetchParamFromStateName: 'regionId' },
                ],
                [
                    {
                        type: FieldType.INPUT,
                        placeholder: strings.street,
                        size: FieldSize.HALF,
                        name: 'addressStreet'
                    },
                    { type: FieldType.INPUT, placeholder: strings.number, size: FieldSize.HALF, name: 'addressHomeNumber' },
                ],
            ],
        },
        {
            type: FieldType.INPUT,
            placeholder: '63110',
            size: FieldSize.FULL,
            title: strings.okedCode,
            name: 'okedId',
            visible
        },
        {
            type: FieldType.INPUT,
            placeholder: 'Каримов Шамсиддин Шавка угли',
            size: FieldSize.FULL,
            title: strings.director,
            name: 'mainDirector',
            visible
        },
        {
            type: FieldType.INPUT,
            placeholder: 'Каримов Шамсиддин Шавка угли',
            size: FieldSize.FULL,
            title: strings.accauntant,
            name: 'mainAccountant',
            visible
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
            visible
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
            visible
        },
        {
            type: FieldType.LINE,
            columns: [
                {
                    size: FieldSize.QUARTER,
                    type: FieldType.INPUT,
                    placeholder: strings.code,
                    name: 'phoneCode',
                    staticValue: [
                        { label: "99", value: 99, actualValue: 99 },
                        { label: "98", value: "98", actualValue: '99' },
                        { label: "97", value: "97", actualValue: '99' },
                        { label: "95", value: "95", actualValue: '99' },
                        { label: "94", value: "94", actualValue: '99' },
                        { label: "93", value: "93", actualValue: '99' },
                        { label: "90", value: "90", actualValue: '99' },
                        { label: "71", value: "71", actualValue: '99' },
                        { label: "66", value: "66", actualValue: '99' },
                    ]
                },
                {
                    type: FieldType.INPUT,
                    placeholder: strings.phoneNumber,
                    size: FieldSize.QUERTER_THREE,
                    name: "phoneNumber"
                },
            ],
            title: strings.phone,
        },
        {
            type: FieldType.INPUT,
            placeholder: 'Ваш email',
            size: FieldSize.FULL,
            title: strings.email,
            name: 'email'
        },
        {
            type: FieldType.CHECKBOX,
            title: `  ${strings.accept}`,
        },
    ];
    let footer = ({ getSubmitData }) => {
        let save = async () => {
            let data = getSubmitData();
            console.warn(data);

            requests.user.update(data)
        }
        let cancel = () => {
            navigation.navigate('Main');
        }
        return <View style={styles.row}>
            <View style={{ flex: 1 }}>
                <RoundButton
                    full
                    flex
                    backgroundColor={colors.gray}
                    text={strings.cancel}
                    onPress={cancel}
                />
            </View>
            <View style={{ flex: 1 }}>
                <GradientButton
                    textColor={colors.white}
                    fill
                    flex
                    text={strings.save}
                    onPress={save}
                />
            </View>
        </View>
    }
    return (
        <View>
            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}>
                <FieldsRenderer initialValue={user.data} fields={fields} footer={footer} />
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

const mapStateToProps = ({ user }) => ({
    user
})

const mapDispatchToProps = {

}

let Connected = connect(mapStateToProps, mapDispatchToProps)(Profile)

export { Connected as Profile };
