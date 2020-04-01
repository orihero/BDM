import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { TariffProps, Tariff } from "./Tariff";
import { requests } from "../../api/requests";
import { connect } from "react-redux";
import {
	showModal,
	hideModal,
	userLoaded,
	hideError
} from "../../redux/actions";
import BlurWrapper from "../../components/containers/BlurWrapper";
import { SET_SUCCESS_ERROR } from "../../redux/types";
import Text from "../../components/common/CustomText";
import { strings } from "../../locales/strings";
import { colors } from "../../constants";

interface TariffsProps {}

let tariffs: TariffProps[] = {
	14: {
		id: 14,
		title: "Плата за документ",
		// shortDescription: 'Некое пояснение',
		price: "1000 сум",
		period: "за исходящий документ",
		description: `   Плата за исходящий документ

    Плата за входящий документ не взимается

    Срок хранения всех документов 5 лет
    
    При нулевом балансе ограничивается возможность отправки документа`
		// reason: 'Некое пояснение',
	},
	15: {
		id: 15,
		title: "Абонентская плата",
		// shortDescription: 'Некое пояснение',
		price: "2 МРЗП",
		period: "За месяц",
		description: `     Плата за исходящий документ

    Плата за входящий документ не взимается

    Срок хранения всех документов 5 лет
    
    При нулевом балансе ограничивается возможность отправки документа`
		// reason: 'Некое пояснение',
	}
};

const Tariffs: React.FC<TariffsProps> = ({ dispatch, user }) => {
	let subscribe = async billingPlanId => {
		try {
			dispatch(showModal());
			let res = await requests.user.changeTariff({ billingPlanId });
			dispatch({ type: SET_SUCCESS_ERROR, payload: res.data.message });
			dispatch(userLoaded({ data: { ...user.data, billingPlanId } }));
		} catch (error) {
			let { response: res } = error;
			dispatch({ type: SET_SUCCESS_ERROR, payload: res.data.message });
		} finally {
			dispatch(hideModal());
			dispatch(hideError());
		}
	};
	let balance = user.data && user.data.funds;

	return (
		<BlurWrapper>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.balanceContainer}>
					<Text style={styles.balance}>{`${strings.balance}: `}</Text>
					<Text
						style={{
							color: balance > 0 ? colors.green : colors.red,
							fontSize: 18,
							fontWeight: "bold"
						}}
					>{`${user.data.funds} ${strings.uzs}`}</Text>
				</View>
				{user.data.billingPlanId && (
					<Text
						style={{
							margin: 15,
							textAlign: "center",
							fontWeight: "bold",
							fontSize: 18
						}}
					>
						{strings.yourPlan}{" "}
						{tariffs[user.data.billingPlanId].title}
					</Text>
				)}
				{Object.keys(tariffs).map(key => {
					let e = tariffs[key];
					return <Tariff {...e} onPress={() => subscribe(e.id)} />;
				})}
			</ScrollView>
		</BlurWrapper>
	);
};

const styles = StyleSheet.create({
	balance: {
		fontSize: 18,
		textAlign: "center",
		fontWeight: "bold"
	},
	balanceContainer: {
		marginVertical: 10,
		flexDirection: "row",
		justifyContent: "center"
	}
});

const mapStateToProps = ({ user }) => ({
	user
});

let Connected = connect(mapStateToProps)(Tariffs);

export { Connected as Tariffs };
