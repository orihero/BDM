import React from "react";
import { FieldType, FieldSize } from "../views";
import { strings } from "../locales/strings";
import { requests } from "../api/requests";

export let baseDocumentFields = [
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

export let baseDocument = {
	baseDocument: {
		buyerTin: "566584586",
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
			documentNo: "",
			documentDate: ""
		},
		contract: {
			contractNo: "",
			contractDate: ""
		},
		sum: 0,
		filePath: "",
		fileName: ".pdf",
		description: "",
		sign: "",
		currencyId: ""
	}
};
