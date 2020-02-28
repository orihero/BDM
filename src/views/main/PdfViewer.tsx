import React from 'react';
import { Dimensions, StyleSheet, View, ActivityIndicator } from 'react-native';
import Pdf from 'react-native-pdf';
import { connect } from 'react-redux';
import { } from 'rn-fetch-blob';
import { url } from '../../api/requests';
import GradientButton from '../../components/common/GradientButton';
import RoundButton from '../../components/common/RoundButton';
import { colors } from '../../constants';
import { strings } from '../../locales/strings';
import { NavigationProps } from '../../utils/defaultPropTypes';
import { SET_DANGER_ERROR } from '../../redux/types';
import { hideError, acceptDocument } from '../../redux/actions';
import BlurWrapper from '../../components/containers/BlurWrapper';
import InnerHeader from '../../components/navigation/InnerHeader';
import { BoxType, DocumentStatus } from '../../components/navigation/DrawerContent';

let { width, height } = Dimensions.get('window')

const PdfViewer = ({ navigation, accessToken, dispatch, document }: NavigationProps) => {
    let docId = navigation.getParam('docId');
    console.warn(docId);
    let { boxType, status } = document;
    let accept = () => {
        console.warn('accepting');

        dispatch(acceptDocument(docId))
    }
    let reject = () => { }
    return (
        <BlurWrapper>
            <View style={styles.container}>
                <InnerHeader />
                <Pdf
                    source={{ uri: `${url}/document/view/pdf/${docId}`, headers: { Authorization: `Bearer ${accessToken}` } }}
                    onError={(error) => {
                        console.warn(error);
                        try {
                            dispatch({ type: SET_DANGER_ERROR, payload: JSON.stringify(error) })
                            setTimeout(() => dispatch(hideError()), 3000)
                        } catch (err) {
                            console.warn(err);
                        }

                    }}
                    activityIndicator={(e) => {
                        console.warn(e);
                        return <ActivityIndicator />
                    }}
                    enablePaging
                    style={styles.container} />
                {(boxType === BoxType.inbox && status === DocumentStatus.sentOrRecieved) && <View style={styles.row}>
                    {/* <View style={{ flex: 1 }}> */}
                    <RoundButton
                        full
                        flex
                        backgroundColor={colors.red}
                        text={strings.reject}
                        onPress={reject}
                    />
                    {/* </View> */}
                    {/* <View style={{ flex: 1 }}> */}
                    <GradientButton
                        textColor={colors.white}
                        fill
                        flex
                        text={strings.confirm}
                        onPress={accept}
                    />

                    {/* </View> */}
                </View>}
            </View>

        </BlurWrapper>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    }
})

let mapStateToProps = ({ user: { accessToken }, document }) => ({ accessToken, document })

let Connected = connect(mapStateToProps)(PdfViewer)

export { Connected as PdfViewer };

