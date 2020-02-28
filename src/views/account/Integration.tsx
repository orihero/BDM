import React, { Fragment } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, ScrollView } from 'react-native';
import { colors, Icons } from '../../constants';
import { strings } from '../../locales/strings';
import Text from '../../components/common/CustomText';
import idea from '../../assets/images/idea.png';
import { FieldType, FieldSize, FieldProps } from '../auth';
import RectangularInput from '../../components/common/RectangularInput';
import RectangularSelect from '../../components/common/RectangularSelect';
import DefaultCheckbox from '../../components/common/DefaultCheckbox';
import GradientButton from '../../components/common/GradientButton';
import { connect } from 'react-redux';
import FieldsRenderer from '../../components/generators/FieldsRenderer';
import { requests } from '../../api/requests';
import { SET_DANGER_ERROR, SET_SUCCESS_ERROR } from '../../redux/types';
import { showModal, hideModal, hideError } from '../../redux/actions';
import BlurWrapper from '../../components/containers/BlurWrapper';

interface Props { }



const Integration: React.FC<Props> = ({ user, dispatch }) => {
    let fields: FieldProps[] = [
        {
            type: FieldType.INPUT,
            size: FieldSize.FULL,
            title: strings.login1C,
            placeholder: strings.enterLogin,
            name: 'loginOf1C',
            disabled: true
        },
        {
            type: FieldType.INPUT,
            size: FieldSize.FULL,
            title: strings.oldPassword,
            placeholder: strings.enterPassword,
            visible: user.data.hasAccountOf1C,
            name: 'oldPassword'
        },
        {
            type: FieldType.INPUT,
            size: FieldSize.FULL,
            title: strings.password,
            placeholder: strings.enterPassword,
            name: user.data.hasAccountOf1C ? 'newPassword' : 'password'
        },
        {
            type: FieldType.INPUT,
            size: FieldSize.FULL,
            title: strings.confirmPassword,
            placeholder: strings.enterPassword,
            name: 'passwordConfirmation',
        },
    ];

    let update = async (data) => {
        let { oldPassword, newPassword } = data;
        try {
            dispatch(showModal())
            let res = await requests.user.change1CAccount({ oldPassword, newPassword });
            console.warn(res);
            dispatch({ type: SET_SUCCESS_ERROR, payload: res.data.message })
        } catch (error) {
            if (error.response)
                dispatch({ type: SET_DANGER_ERROR, payload: error.response.data.message })
            else {
                console.warn(error);
            }
        } finally {
            dispatch(hideModal());
            setTimeout(() => {
                dispatch(hideError());
            }, 3000)
        }
    }
    let register = async (data) => {
        let { password } = data;
        try {
            dispatch(showModal())
            let res = await requests.user.create1CAccount({ password });
            console.warn(res);
            dispatch({ type: SET_SUCCESS_ERROR, payload: res.data.message })
        } catch (error) {
            if (error.response)
                dispatch({ type: SET_DANGER_ERROR, payload: error.response.data.message })
            else {
                console.warn(error);
            }
        } finally {
            dispatch(hideModal());
            setTimeout(() => {
                dispatch(hideError());
            }, 3000)
        }
    }

    let footer = ({ getSubmitData }) => {
        return <View
            style={[
                styles.flex,
                {
                    justifyContent: 'flex-end',
                    paddingHorizontal: 40,
                    marginTop: 40,
                },
            ]}>
            <GradientButton full text={user.data.hasAccountOf1C ? strings.save : strings.register} onPress={user.data.hasAccountOf1C ? () => update(getSubmitData()) : () => register(getSubmitData())} />
        </View>
    }

    return (
        <BlurWrapper>
            <ScrollView>
                <View >
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
                <View style={styles.flex}>
                    <FieldsRenderer footer={footer} initialValue={user.data} fields={fields} />
                </View>
            </ScrollView>
        </BlurWrapper>
    );
};

const mapStateToProps = ({ user }) => ({
    user
})

let Connected = connect(mapStateToProps)(Integration)

export { Connected as Integration }

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
