import React from "react";
import { FieldType, FieldSize } from "../views";
import { strings } from "../locales/strings";
import { requests } from "../api/requests";

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
				name: "FacturaDoc.FacturaNo"
			},
			{
				type: FieldType.DATE_PICKER,
				placeholder: strings.selectDate,
				size: FieldSize.QUERTER_THREE,
				title: strings.selectDate,
				name: "FacturaDoc.FacturaDate"
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
				title: strings.documentNumber,
				size: FieldSize.QUARTER,
				placeholder: strings.number,
				name: "FacturaEmpowermentDoc.EmpowermentNo"
			},
			{
				type: FieldType.DATE_PICKER,
				placeholder: strings.selectDate,
				size: FieldSize.QUERTER_THREE,
				title: strings.selectDate,
				name: "FacturaEmpowermentDoc.EmpowermentDateOfIssue"
			}
		]
	},
	{
		type: FieldType.INPUT,
		title: strings.comments,
		placeholder: strings.productReleased,
		size: FieldSize.FULL,
		name: "ItemReleasedDoc.ItemReleasedFio"
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

export let invoiceStOrUnOrCom = {
	invoiceStandard: {
		invoiceContent: {
			FacturaId: "", //Filled in the end
			FacturaDoc: {
				FacturaNo: "",
				FacturaDate: ""
			},
			ContractDoc: {
				ContractNo: "",
				ContractDate: ""
			},
			FacturaEmpowermentDoc: {
				AgentFacturaId: "",
				EmpowermentNo: "",
				EmpowermentDateOfIssue: "",
				AgentFio: "",
				AgentTin: ""
			},
			ItemReleasedDoc: {
				ItemReleasedFio: ""
			},
			SellerTin: "",
			BuyerTin: "",
			Seller: {
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
			Buyer: {
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
			ProductList: {
				FacturaProductId: "",
				Tin: "",
				HasFuel: false,
				HasVat: false,
				Products: [
					{
						OrdNo: "0",
						Name: "",
						MeasureId: "-1",
						Count: "0",
						Summa: "0",
						DeliverySum: "0",
						VatRate: "0",
						VatSum: "0",
						DeliverySumWithVat: "0",
						WithoutVat: true
					}
				]
			}
		},
		filePath: "",
		fileName: "",
		sum: 0,
		description: "",
		sign: ""
	}
};
