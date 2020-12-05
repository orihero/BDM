import { requests } from "../api/requests";
import { strings } from "../locales/strings";
import { FieldSize, FieldType } from "../views";

export let latterFields = [
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

export let latterModel = {
	latter: {
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
		filePath: "",
		fileName: "",
		description: "",
		sign: ""
	}
};
