import { requests } from "../api/requests";
import { strings } from "../locales/strings";
import { FieldSize, FieldType } from "../views";

export let otherFields = [
	{
		type: FieldType.AUTOCOMPLETE,
		title: strings.recieverInn,
		placeholder: strings.recieverInn,
		size: FieldSize.FULL,
		name: "buyerTin",
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
				name: "document.documentNo"
			},
			{
				type: FieldType.DATE_PICKER,
				placeholder: strings.selectDate,
				size: FieldSize.QUERTER_THREE,
				title: strings.selectDate,
				name: "document.documentDate"
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
				name: "contract.contractNo"
			},
			{
				type: FieldType.DATE_PICKER,
				placeholder: strings.selectDate,
				size: FieldSize.QUERTER_THREE,
				title: strings.selectDate,
				name: "contract.contractDate"
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
	},
	{
		type: FieldType.FILE,
		placeholder: strings.selectFile,
		size: FieldSize.FULL,
		name: "file"
	}
];

export let otherModel = {
	other: {
		buyerTin: "577777309",
		buyer: {
			Name: "YO‘LDOSHEV ISMOIL IBROHIM O‘G‘LI",
			Account: "12121212121212121212",
			BankId: "01084",
			Address: "ТАШКЕНТСКАЯ ОБЛАСТЬ АХАНГАРАНСКИЙ РАЙОН",
			Mobile: "998729056",
			WorkPhone: "998729056",
			Oked: "null",
			DistrictId: "0301",
			Director: "Baratov Begzod",
			Accountant: "Begzod",
			VatRegCode: "112121212121"
		},
		document: {
			documentNumber: "N1",
			documentDate: "2019-08-07"
		},
		contract: {
			contractNo: "N2",
			contractDate: "2019-08-07"
		},
		filePath: "/566584586/2020/2/13",
		fileName: "7cd90cd349d94b3190c39f925f2a9f20.pdf",
		realFileName: " document name",
		currencyId: 1,
		sum: 0,
		description: "string",
		sign: "Sign content of pdf`s sign"
	}
};
