import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors } from '../constants';
import Text from './common/CustomText';

const Modal = ({ loadingMessage }) => {
    console.warn(loadingMessage);

    return (
        <View style={styles.container}>
            <ActivityIndicator size={'large'} color={colors.blue} />
            {loadingMessage && <Text style={styles.text}>{loadingMessage}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: colors.black,
        margin: 15,
        fontWeight: 'bold',
        fontSize: 18
    }
})


export default Modal
