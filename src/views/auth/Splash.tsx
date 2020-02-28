import React, { useEffect } from 'react';
import { Image, StyleSheet, View, Dimensions } from 'react-native';
import logo from '../../assets/images/logo.png';
import { colors } from '../../constants/index';
import { connect } from 'react-redux';
import { userLoaded, getDocumentsCount } from '../../redux/actions'
import AsyncStorage from '@react-native-community/async-storage';
import { storeName } from '../../redux/reducers/user';
import { requests } from '../../api/requests';
import { NavigationProps } from '../../utils/defaultPropTypes';

let { width } = Dimensions.get('window');

const Splash = ({ user, userLoaded, navigation }: NavigationProps) => {
    let effect = async () => {
        try {
            let credentials = await AsyncStorage.getItem(storeName);
            let data = JSON.parse(credentials);
            userLoaded(data)
            let res = await requests.user.me();
            userLoaded({ data: res.data.data, ...data });
            navigation.navigate('Main');
        } catch (error) {
            console.warn(error);
            navigation.navigate('Login')
        }
    }
    useEffect(() => {
        effect()
    }, [])
    return (
        <View style={styles.container}>
            <Image style={styles.image} source={logo} />
        </View>
    )
}

let ratio = 1250 / (width - 40)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        height: 400 / ratio,
        width: 1250 / ratio
    }
})

const mapStateToProps = ({ user }) => ({
    user
})

const mapDispatchToProps = {
    userLoaded
}


export default connect(mapStateToProps, mapDispatchToProps)(Splash)
