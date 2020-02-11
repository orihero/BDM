import React, { useEffect } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../constants';

export enum MessageTypes {
    Success = colors.green,
    Warning = colors.yellow,
    Danger = colors.red,
    Default = colors.white
}

export interface MessageProps {
    type: MessageTypes;
    text: String
}

const FloatingMessage = ({ text, type = MessageTypes.Default }: MessageProps) => {
    let translateY = new Animated.Value(-100)
    let animateIn = () => {
        Animated.timing(translateY, { toValue: 0, duration: 200 }).start();
    }
    let animateOut = () => {
        Animated.timing(translateY, { toValue: -100, duration: 200 }).start();
    }
    useEffect(() => {
        animateIn()
        setTimeout(animateOut, 2500);
    }, [])
    return (
        <Animated.View style={[styles.container, { backgroundColor: type, transform: [{ translateY }] }]}>
            <Text numberOfLines={3} style={styles.text}>{text}</Text>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        padding: 15,
        backgroundColor: colors.white
    },
    text: {
        color: colors.white,
    }
})


export default FloatingMessage
