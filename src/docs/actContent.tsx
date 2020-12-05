import { requests } from "../api/requests";
import { strings } from "../locales/strings";
import { FieldSize, FieldType } from "../views";

export let invoiceStOrUnOrComFields = [
	{
		type: FieldType.AUTOCOMPLETE,
		title: strings.recieverInn,
		placeholder: strings.recieverInn,
		size: FieldSize.FULL,
		name: "BuyerTin",
		fetch: requests.user.getRequisite
	},
	{
		type: FieldType.LINE,
		size: FieldSize.FULL,
		columns: [
			{
				type: FieldType.INPUT,
				title: strings.documentNumber,
				size: FieldSize.QUARTER,
				placeholder: strings.number,
				name: "ActDoc.ActNo"
			},
			{
				type: FieldType.DATE_PICKER,
				placeholder: strings.selectDate,
				size: FieldSize.QUERTER_THREE,
				title: strings.selectDate,
				name: "ActDoc.ActDate"
			}
		]
	},
	{
		type: FieldType.LINE,
		size: FieldSize.FULL,
		columns: [
			{
				type: FieldType.INPUT,
				title: strings.documentNumber,
				size: FieldSize.QUARTER,
				placeholder: strings.number,
				name: "ContractDoc.ContractNo"
			},
			{
				type: FieldType.DATE_PICKER,
				placeholder: strings.selectDate,
				size: FieldSize.QUERTER_THREE,
				title: strings.selectDate,
				name: "ContractDoc.ContractDate"
			}
		]
	},
	{
		type: FieldType.LINE,
		size: FieldSize.FULL,
		columns: [
			{
				type: FieldType.INPUT,
				title: strings.amount,
				size: FieldSize.QUERTER_THREE,
				placeholder: strings.enterAmount,
				name: "sum"
			},
			{
				type: FieldType.SELECT,
				placeholder: strings.uzs,
				size: FieldSize.QUARTER,
				title: strings.currency,
				name: "currencyId",
				staticValue: [
					{ label: "UZS", actualValue: 1, value: 0 },
					{ label: "USD", actualValue: 2, value: 1 },
					{ label: "RUB", actualValue: 3, value: 2 },
					{ label: "EUR", actualValue: 4, value: 3 }
				]
			}
		]
	},
	{
		type: FieldType.INPUT,
		title: strings.comments,
		placeholder: strings.enterComments,
		size: FieldSize.FULL,
		name: "description"
	}
];

export let actContent = {
	actTax: {
		actContent: {
			ContractDoc: {
				ContractNo: "0",
				ContractDate: "0"
			},
			SellerTin: "0",
			BuyerTin: "0",
			ProductList: {
				Tin: "0",
				Products: [
					{
						OrdNo: "0",
						Name: "0",
						MeasureId: "0",
						Count: "0",
						Summa: "0",
						TotalSum: "0"
					}
				],
				ActProductId: "0"
			},
			ActId: "0",
			ActDoc: {
				ActNo: "0",
				ActDate: "0",
				ActText: ""
			},
			SellerName: "",
			BuyerName: ""
		},
		filePath: "",
		fileName: "",
		sum: 0,
		description: "",
		sign: ""
	}
};
