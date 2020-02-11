import React from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { colors } from '../constants';
import { BlurView } from '@react-native-community/blur'

const Modal = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={'large'} color={colors.blue} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center'
    }
})


export default Modal
