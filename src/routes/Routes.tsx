import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Header from '../components/navigation/Header';
import InnerHeader from '../components/navigation/InnerHeader';
import { strings } from '../locales/strings';
import { Account, Login, Main, Register, NewDocument, PdfViewer } from '../views';

let MainStack = createStackNavigator(
    {
        Main: {
            screen: Main,
            navigationOptions: {
                header: null,
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
        NewDocument: {
            screen: NewDocument,
            navigationOptions: {
                header: null
            },
        },
        PdfViewer: {
            screen: PdfViewer,
            navigationOptions: {
                header: null
            },
        }
    },
    {
        defaultNavigationOptions: {
            header: props => <InnerHeader {...props} />,
        },

    },
);

let AuthSwitch = createSwitchNavigator({ Login, Register, MainStack });

export default createAppContainer(AuthSwitch);