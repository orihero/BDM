import React, { useEffect, useState } from 'react'
import { Dimensions, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { requests } from '../../api/requests'
import Text from '../../components/common/CustomText'
import GradientButton from '../../components/common/GradientButton'
import FieldsRenderer from '../../components/generators/FieldsRenderer'
import { colors, commonStyles } from '../../constants'
import { strings } from '../../locales/strings'
import { NavigationProps } from '../../utils/defaultPropTypes'
import { FieldProps, FieldSize, FieldType } from '../auth'

const Products = ({ navigation }: NavigationProps) => {
    let parent = navigation.getParam('products');
    let setParent = navigation.getParam('setProducts');
    const [products, setProducts] = useState(parent);
    const [editingIndex, setEditingIndex] = useState(-1);
    let Product = ({ item, index }) => {
        let initialFields: FieldProps[] = [
            { type: FieldType.INPUT, title: strings.productName, placeholder: strings.productName, size: FieldSize.FULL, name: 'Name', disabled: index !== editingIndex },
            {
                type: FieldType.LINE, size: FieldSize.FULL, columns: [
                    { type: FieldType.INPUT, title: strings.quantity, size: FieldSize.HALF, placeholder: strings.quantity, name: 'Count', disabled: index !== editingIndex },
                    {
                        type: FieldType.SELECT, placeholder: strings.measure, size: FieldSize.HALF, title: strings.measure, name: 'MeasureId',
                        fetch: requests.helper.getMeasures,
                        map: (e, i) => ({ label: e.name, actualValue: e.id, value: i }), disabled: index !== editingIndex
                    },
                ],
            },
            {
                type: FieldType.LINE, size: FieldSize.FULL, columns: [
                    { type: FieldType.INPUT, title: strings.amount, size: FieldSize.HALF, placeholder: strings.quantity, name: 'Summa', disabled: index !== editingIndex },
                    { type: FieldType.INPUT, title: strings.cost, size: FieldSize.HALF, placeholder: strings.cost, name: 'DeliverySum', disabled: index !== editingIndex },
                ],
            },
            {
                type: FieldType.LINE, size: FieldSize.FULL, title: strings.ndsInput, columns: [
                    { type: FieldType.SELECT, title: strings.bet, size: FieldSize.QUARTER, placeholder: strings.bet, name: 'VatRate', disabled: index !== editingIndex, staticValue: [{ label: '20%', value: 0, actualValue: 20, }, { label: '15%', value: 1, actualValue: 15, }, { label: '7%', value: 2, actualValue: 7 }, { label: "0%", value: 2, actualValue: 0, }, { label: "Без НДС", value: 3, actualValue: -1, }] },
                    { type: FieldType.INPUT, title: strings.amount, size: FieldSize.QUERTER_THREE, placeholder: strings.amount, name: 'VatSum', disabled: index !== editingIndex },
                ],
            },
            { type: FieldType.INPUT, title: strings.totalCostWithNDS, placeholder: strings.totalCostWithNDS, size: FieldSize.FULL, name: 'DeliverySumWithVat', disabled: index !== editingIndex },
        ];
        const [fields, setFields] = useState(initialFields);
        useEffect(() => {
        }, []);
        let footer = ({ getSubmitData, getRawData }) => {
            return <View style={styles.removeContainer}>
                {editingIndex === index ? <TouchableOpacity onPress={() => {
                    setEditingIndex(-1);
                    let pr = products.reduce((prev, current, i) => (index === i ? [...prev, { ...getRawData(), submitData: getSubmitData() }] : [...prev, current]), []);
                    setProducts(pr);
                    setParent(pr);
                }}>
                    <Ionicons name="md-checkmark" size={26} style={{ padding: 15, borderRadius: 40, backgroundColor: colors.ultraLightGray, paddingHorizontal: 18 }} color={colors.green} />
                </TouchableOpacity> : <TouchableOpacity onPress={() => setEditingIndex(index)}>
                        <Ionicons name="md-create" size={26} style={{ padding: 15, borderRadius: 40, backgroundColor: colors.ultraLightGray, paddingHorizontal: 18 }} color={colors.green} />
                    </TouchableOpacity>}
                <TouchableOpacity onPress={() => setProducts(products.filter((e, i) => index !== i))}>
                    <Ionicons name="ios-trash" size={26} style={{ padding: 15, borderRadius: 40, backgroundColor: colors.ultraLightGray, paddingHorizontal: 20, marginHorizontal: 10 }} color={colors.red} />
                </TouchableOpacity>
            </View>
        }
        return <View style={styles.productContainer}>
            <FieldsRenderer fields={fields} initialValue={item} footer={footer} />
        </View>
    }
    let listEmptyComponent = () => (<View style={[commonStyles.centeredContainer, { height: Dimensions.get('window').height }]}><Text>{strings.noData}</Text></View>)
    return (
        <View style={styles.container}>
            <FlatList showsVerticalScrollIndicator={false} ListEmptyComponent={listEmptyComponent} keyExtractor={(e, i) => i.toString()} data={products} renderItem={({ item, ...rest }) => <Product {...{ item, ...rest }} />} />
            <View style={styles.fixedButton}>
                <GradientButton onPress={() => {
                    setProducts([...products, {}])
                }} text={() => <AntDesign name="plus" color={colors.white} size={26} />} fontSize={30} style={{ padding: 15, paddingHorizontal: 15 }} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        flex: 1
    },
    fixedButton: {
        position: 'absolute',
        bottom: 15,
        right: 15,
    },
    productContainer: {
        backgroundColor: colors.white,
        elevation: 2,
        margin: 15,
        padding: 10,
        borderRadius: 20
    },
    removeContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        margin: 5
    }
})


export { Products }

