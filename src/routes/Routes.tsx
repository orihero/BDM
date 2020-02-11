import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Header from '../components/navigation/Header';
import InnerHeader from '../components/navigation/InnerHeader';
import { strings } from '../locales/strings';
import { Account, Login, Main, Register } from '../views';

let MainStack = createStackNavigator(
    {
        Main: {
            screen: Main,
            navigationOptions: {
                header: props => <Header title={strings.inbox} {...props} />,
            },
        },
        Account: {
            screen: Account,
            navigationOptions: {
                header: props => (
                    <InnerHeader
                        {...props}
                        back={'Main'}
                        title={strings.personalCabinet}
                    />
                ),
            },
        },
    },
    {
        defaultNavigationOptions: {
            header: props => <InnerHeader {...props} />,
        },
    },
);

let AuthSwitch = createSwitchNavigator({ Login, Register, MainStack });

export default createAppContainer(AuthSwitch);