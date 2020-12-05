import { FieldType, FieldSize } from "../views";
import { strings } from "../locales/strings";
import { requests } from "../api/requests";

export let comissionerReportFields = [
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
		type: FieldType.LINE,
		size: FieldSize.FULL,
		columns: [
			{
				type: FieldType.DATE_PICKER,
				title: strings.from,
				size: FieldSize.HALF,
				placeholder: strings.selectDate,
				name: "dateFrom"
			},
			{
				type: FieldType.DATE_PICKER,
				placeholder: strings.selectDate,
				size: FieldSize.HALF,
				title: strings.to,
				name: "dateTo"
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

export let comissionerReport = {
	comissionerReport: {
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
		contract: {
			contractNo: "",
			contractDate: ""
		},
		dateFrom: "",
		dateTo: "",
		filePath: "",
		fileName: "",
		description: "",
		sign: ""
	}
};
