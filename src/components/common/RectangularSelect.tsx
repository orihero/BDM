import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, Icons } from '../../constants';
import Picker from 'react-native-picker-select';
import Text from './CustomText';
import { strings } from '../../locales/strings';

interface RectangularSelectProps {
    placeholder?: string;
    containerStyle?: Object;
    disabled?: boolean;
    items?: any[];
    onChange?: Function;
    value?: string;
}

const RectangularSelect = ({
    placeholder = strings.certificate,
    containerStyle,
    disabled = false,
    items = [],
    onChange = () => { },
    value
}: RectangularSelectProps) => {
    return (
        <Picker
            style={styles.container}
            onValueChange={(e) => {
                onChange(e)
            }}
            disabled={disabled}
            value={value}
            placeholder={{ label: placeholder, value: -1, color: colors.gray }}
            items={items}>
            <View style={[styles.container, containerStyle]}>
                <Text style={[styles.placeholder, value && styles.value]}>{value !== null && value !== undefined ? items[value].label : placeholder}</Text>
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

export default RectangularSelect;
