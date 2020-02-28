import React from 'react';
import { ScrollView } from 'react-native';
import { TariffProps, Tariff } from './Tariff';
import { requests } from '../../api/requests';
import { connect } from 'react-redux';
import { showModal, hideModal, userLoaded, hideError } from '../../redux/actions';
import BlurWrapper from '../../components/containers/BlurWrapper';
import { SET_SUCCESS_ERROR } from '../../redux/types';
import Text from '../../components/common/CustomText';
import { strings } from '../../locales/strings';

interface TariffsProps { }

let tariffs: TariffProps[] = {
    14: {
        id: 14,
        title: 'Плата за документ',
        // shortDescription: 'Некое пояснение',
        price: '1000 сум',
        period: 'за исходящий документ',
        description: `   Плата за исходящий документ

    Плата за входящий документ не взимается

    Срок хранения всех документов 5 лет
    
    При нулевом балансе ограничивается возможность отправки документа`,
        // reason: 'Некое пояснение',
    },
    15: {
        id: 15,
        title: 'Абонентская плата',
        // shortDescription: 'Некое пояснение',
        price: '2 МРЗП',
        period: 'За месяц',
        description: `     Плата за исходящий документ

    Плата за входящий документ не взимается

    Срок хранения всех документов 5 лет
    
    При нулевом балансе ограничивается возможность отправки документа`,
        // reason: 'Некое пояснение',
    },
}

const Tariffs: React.FC<TariffsProps> = ({ dispatch, user }) => {
    let subscribe = async (billingPlanId) => {
        try {
            dispatch(showModal());
            let res = await requests.user.changeTariff({ billingPlanId });
            dispatch({ type: SET_SUCCESS_ERROR, payload: res.data.message })
            dispatch(userLoaded({ data: { ...user.data, billingPlanId } }))
        } catch (error) {
            let { response: res } = error;
            dispatch({ type: SET_SUCCESS_ERROR, payload: res.data.message })
        } finally {
            dispatch(hideModal())
            dispatch(hideError())
        }
    }
    return (
        <BlurWrapper>
            <ScrollView showsVerticalScrollIndicator={false}>
                {user.data.billingPlanId && <Text style={{ margin: 15, textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>
                    {strings.yourPlan} {tariffs[user.data.billingPlanId].title}
                </Text>}
                {Object.keys(tariffs).map(key => {
                    let e = tariffs[key];
                    return <Tariff {...e} onPress={() => subscribe(e.id)} />;
                })}
            </ScrollView>
        </BlurWrapper>
    );
};

const mapStateToProps = ({ user }) => ({
    user
})

let Connected = connect(mapStateToProps)(Tariffs)

export { Connected as Tariffs }