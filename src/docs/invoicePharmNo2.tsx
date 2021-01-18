import React from "react";
import { FieldType, FieldSize } from "../views";
import { strings } from "../locales/strings";
import { requests } from "../api/requests";

export let invoicePharmNo2Fields = [
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

export let invoicePharmNo2Model = {
	invoicePharmNo2: {
		invoicePharmNo2Content: {
			FacturaDoc: {
				FacturaNo: "439",
				FacturaDate: "2020-05-07"
			},
			ContractDoc: {
				ContractNo: "273",
				ContractDate: "2020-05-07"
			},
			FacturaEmpowermentDoc: {
				AgentFacturaId: "",
				EmpowermentNo: "",
				EmpowermentDate: "",
				EmpowermentDateOfIssue: "",
				AgentFio: "",
				AgentTin: ""
			},
			ItemReleasedDoc: {
				ItemReleasedFio: "ч/з"
			},
			SellerTin: "566584586",
			BuyerTin: "577777309",
			Seller: {
				Name: "BARATOV BEGZOD RUSTAM O‘G‘LI",
				Account: "12121212121212121212",
				BankId: "00444",
				Address: "ГОРОД ТАШКЕНТ ЧИЛОНЗАРСКИЙ РАЙОН Gagarin 12",
				Mobile: "998729056",
				WorkPhone: "998729056",
				Oked: "12121",
				DistrictId: "2606",
				Director: "12",
				Accountant: "112",
				VatRegCode: "112121212121"
			},
			Buyer: {
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
			ProductList: {
				Tin: "566584586",
				HasFuel: false,
				HasVat: true,
				Products: [
					{
						OrdNo: 1,
						Name: "Виона Пренатал Форте таб. №60 (6*10)",
						MeasureId: 38,
						Count: 36,
						Summa: 120960.68,
						DeliverySum: 4354584.35,
						VatRate: 15,
						VatSum: 653187.65,
						DeliverySumWithVat: 5007772,
						FuelRate: 0,
						FuelSum: 0,
						DeliverySumWithFuel: 0,
						WithoutVat: false,
						BasePrice: 120960.68
					}
				],
				FacturaProductId: "5eb3fc10fa0d0800010b6c51"
			},
			FacturaId: "5eb3fc10fa0d0800010b6c51"
		},
		filePath: "/566584586/2020/2/15",
		fileName: "7079745dced74cbe93f323f1ef3b0c0d.pdf",
		sum: 123132,
		description: "description",
		sign: "Sign content of invoice json`s sign"
	}
};
