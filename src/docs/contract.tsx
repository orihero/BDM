import React from "react";
import { FieldType, FieldSize } from "../views";
import { strings } from "../locales/strings";
import { requests } from "../api/requests";

let contractFields = [
	{
		type: FieldType.AUTOCOMPLETE,
		title: strings.recieverInn,
		placeholder: strings.recieverInn,
		size: FieldSize.FULL,
		name: "buyer",
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

let contract = {
	contract: {
		buyerTin: "",
		buyer: {
			Name: "",
			Account: "",
			BankId: "",
			Address: "",
			Mobile: "",
			WorkPhone: "",
			Oked: "",
			DistrictId: "",
			Director: "",
			Accountant: "",
			VatRegCode: ""
		},
		document: {
			documentNo: "",
			documentDate: ""
		},
		currencyId: -1,
		sum: 0,
		description: "",
		filePath: "",
		fileName: "",
		sign: ""
	}
};
