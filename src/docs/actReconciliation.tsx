import React from "react";
import { FieldType, FieldSize } from "../views";
import { strings } from "../locales/strings";
import { requests } from "../api/requests";

export let actReconciliationFields = [
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

export let actReconciliationModel = {
	actReconciliation: {
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
		contract: {
			contractNo: "N2",
			contractDate: "2019-08-07"
		},
		filePath: "/566584586/2020/2/13",
		fileName: "7cd90cd349d94b3190c39f925f2a9f20.pdf",
		description: "description",
		sign: "Sign content of pdf`s sign"
	}
};
