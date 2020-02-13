import React, { Fragment, useReducer, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { FieldType, FieldSize, FieldProps } from '../../views';
import DefaultCheckbox from '../common/DefaultCheckbox';
import RectangularSelect from '../common/RectangularSelect';
import RectangularInput from '../common/RectangularInput';
import { colors, Icons } from '../../constants';
import { strings } from '../../locales/strings';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DocumentPicker from 'react-native-document-picker';
import { reducer, SET } from '../../utils/state';
import RectangularDatePicker from '../common/RectangularDatePicker';

interface FieldRendererProps {
    fields: FieldProps[];
    footer?: any
}

const FieldsRenderer = ({ fields, footer: Footer }: FieldRendererProps) => {
    const [state, dispatch] = useReducer(reducer, {});
    let initialItems = () => fields.reduce((prev, current) => {
        if (current.type === FieldType.SELECT) {
            return { ...prev, [current.name]: { ...current, data: current.staticValue } || current }
        }
        return prev
    }, {});

    const [items, dispatchItems] = useReducer(reducer, {}, initialItems);
    console.warn(state);
    useEffect(() => {
        Object.keys(items).map(key => {
            if (typeof items[key].fetch === 'function') {
                items[key].fetch().then(res => {
                    dispatchItems({ type: SET, name: key, value: { ...items[key], data: res.data.map((e, index) => ({ value: index, label: e.docTypeName, actualValue: e.docTypeCode })) } })
                })
            }
        })
    }, [])
    let pickFile = async (e: FieldProps) => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            console.log(
                res.uri,
                res.type, // mime type
                res.name,
                res.size
            );
            updateState(e.name, res)
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
    }
    let updateState = (name, value) => {
        dispatch({ type: SET, name, value });
    }
    let renderFields = fields => {
        return fields.map(e => {
            switch (e.type) {
                case FieldType.CHECKBOX:
                    return (
                        <View style={{ marginVertical: 15 }}>
                            <DefaultCheckbox setActive={() => updateState(e.name, !state[e.name])} title={e.title} />
                        </View>
                    );
                case FieldType.SELECT:
                    if (!items[e.name]) {
                        dispatchItems({ type: SET, name: e.name, value: { ...e, data: e.staticValue } || e })
                    }
                    if (e.size === FieldSize.FULL) {
                        return (
                            <View>
                                <Text style={styles.inputTitle}>{e.title}</Text>
                                <RectangularSelect value={state[e.name]} items={items[e.name] ? items[e.name].data : []} onChange={(val) => updateState(e.name, val)} placeholder={e.placeholder} />
                            </View>
                        );
                    }
                    return (
                        <View style={styles[e.size]}>
                            {e.title && <Text numberOfLines={1} style={styles.inputTitle}>{e.title}</Text>}
                            <RectangularSelect value={state[e.name]} items={items[e.name] ? items[e.name].data : []} onChange={(val) => updateState(e.name, val)} placeholder={e.placeholder} />
                        </View>
                    );
                case FieldType.DATE_PICKER:
                    if (e.size === FieldSize.FULL) {
                        return (
                            <View>
                                <Text style={styles.inputTitle}>{e.title}</Text>
                                <RectangularDatePicker value={state[e.name]} onChange={(val) => updateState(e.name, val)} placeholder={e.placeholder} />
                            </View>
                        );
                    }
                    return (
                        <View style={styles[e.size]}>
                            {e.title && <Text numberOfLines={1} style={styles.inputTitle}>{e.title}</Text>}
                            <RectangularDatePicker value={state[e.name]} onChange={(val) => updateState(e.name, val)} placeholder={e.placeholder} />
                        </View>
                    );
                case FieldType.INPUT:
                    if (e.size === FieldSize.FULL) {
                        return (
                            <View>
                                <Text style={styles.inputTitle}>{e.title}</Text>
                                <RectangularInput onChange={val => updateState(e.name, val)} value={state[e.name]} placeholder={e.placeholder} />
                            </View>
                        );
                    }
                    return (
                        <View style={styles[e.size]}>
                            {e.title && <Text numberOfLines={1} style={styles.inputTitle}>{e.title}</Text>}
                            <RectangularInput onChange={val => updateState(e.name, val)} value={state[e.name]} placeholder={e.placeholder} />
                        </View>
                    );
                case FieldType.COMPLEX:
                    return (
                        <Fragment>
                            <Text style={styles.inputTitle}>{strings.address}</Text>
                            {e.rows &&
                                e.rows.map(el => {
                                    return <View style={styles.row}>{renderFields(el)}</View>;
                                })}
                        </Fragment>
                    );
                case FieldType.LINE:
                    return (
                        <Fragment>
                            {e.title && <Text style={styles.inputTitle}>{e.title}</Text>}
                            <View style={styles.row}>{renderFields(e.columns)}</View>
                        </Fragment>
                    );
                case FieldType.FILE:
                    return <View style={styles.row}>
                        <TouchableWithoutFeedback onPress={() => pickFile(e)}>
                            <View style={styles.filePicker}>
                                <Text numberOfLines={1} style={[styles.inputTitle, { width: 140 }]}>{state[e.name] ? state[e.name].name : strings.selectFile}</Text>
                                <Icons name={"paperclip"} size={20} />
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => updateState(e.name, null)}>
                            <View style={styles.button}>
                                <Text style={styles.inputTitle}>{strings.reset}</Text>
                                <AntDesign name={"close"} size={20} color={colors.red} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                default:
                    return null;
            }
        });
    };
    return <View>
        {renderFields(fields)}
        {Footer && <Footer data={state} />}
    </View>
};

const styles = StyleSheet.create({
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    container: {
        padding: 15,
    },
    inputTitle: {
        fontSize: 16,
        color: colors.gray,
        marginVertical: 10,
    },
    row: {
        flexDirection: 'row',
        // backgroundColor: 'red'
    },
    half: {
        flex: 1,
        paddingRight: 5,
        marginBottom: 7.5,
    },
    quarter: {
        flex: 0.4,
        paddingRight: 5,
        marginBottom: 7.5,
    },
    quarterThree: {
        flex: 0.6,
        paddingRight: 5,
        marginBottom: 7.5,
    },
    filePicker: {
        flex: .6,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderRadius: 6,
        borderColor: colors.lightGray,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 7.5,
        marginVertical: 15,
        marginRight: 10,
        alignItems: 'center',
    },
    button: {
        flex: .4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors.lightGray,
        marginVertical: 15,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    }
});

export default FieldsRenderer;
