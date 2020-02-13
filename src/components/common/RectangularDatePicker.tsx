import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, Icons } from '../../constants';
import Picker from '@react-native-community/datetimepicker';
import Text from './CustomText';
import { strings } from '../../locales/strings';

interface DatePickerProps {
    placeholder?: string;
    containerStyle?: Object;
    disabled?: boolean;
    items?: any[];
    onChange?: Function;
    value?: string;
}

const RectangularDatePicker = ({
    placeholder = strings.certificate,
    containerStyle,
    items = [],
    onChange = () => { },
    value
}: DatePickerProps) => {
    return (
        <Picker
            value={value}
            style={styles.container}
            onChange={(e) => {
                console.warn(e);
            }}>
            <View style={[styles.container, containerStyle]}>
                <Text style={[styles.placeholder, value && styles.value]}>{value ? value : placeholder}</Text>
                <Icons name={'down-chevron'} size={18} color={colors.gray} />
            </View>
        </Picker>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        backgroundColor: colors.ultraLightGray,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    placeholder: {
        color: colors.gray,
    },
    value: {
        color: colors.black
    }
});

export default RectangularDatePicker;
