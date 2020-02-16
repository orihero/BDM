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
import { hideError } from '../../redux/actions';
import BlurWrapper from '../../components/containers/BlurWrapper';
import InnerHeader from '../../components/navigation/InnerHeader';

let { width, height } = Dimensions.get('window')

const PdfViewer = ({ navigation, accessToken, dispatch }: NavigationProps) => {
    let docId = navigation.getParam('docId');
    console.warn(docId);
    let accept = () => { }
    let reject = () => { }
    return (
        <BlurWrapper>
            <View style={styles.container}>
                <InnerHeader />
                <Pdf
                    source={{ uri: `${url}/document/view/pdf/${docId}`, headers: { Authorization: `Bearer ${accessToken}` } }}
                    onLoadComplete={(numberOfPages, filePath) => {
                        console.log(`number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page, numberOfPages) => {
                        console.log(`current page: ${page}`);
                    }}
                    onError={(error) => {
                        console.warn(error);
                        try {
                            dispatch({ type: SET_DANGER_ERROR, payload: JSON.stringify(error) })
                            setTimeout(() => dispatch(hideError()), 3000)
                        } catch (err) {
                            console.warn(err);
                        }

                    }}
                    onPressLink={(uri) => {
                        console.log(`Link presse: ${uri}`)
                    }}
                    activityIndicator={<View />}
                    enablePaging
                    style={styles.container} />
                <View style={styles.row}>
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
                </View>
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

let mapStateToProps = ({ user: { accessToken } }) => ({ accessToken })

let Connected = connect(mapStateToProps)(PdfViewer)

export { Connected as PdfViewer };

