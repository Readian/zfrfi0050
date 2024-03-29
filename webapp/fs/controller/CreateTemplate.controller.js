sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"sap/m/MessageToast",
		"sap/m/MessageBox",
		"sap/ui/core/ValueState",
		"fi/zfrfi0050/model/models",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/core/Fragment",
		"sap/m/Label",
		"sap/m/SearchField",
		"sap/m/Text",
		"sap/ui/table/Column",
		"sap/ui/core/BusyIndicator",
	],
	function (
		Controller,
		JSONModel,
		History,
		MessageToast,
		MessageBox,
		ValueState,
		Model,
		Filter,
		FilterOperator,
		Fragment,
		Label,
		SearchField,
		Text,
		UIColumn,
		BusyIndicator
	) {
		"use strict";

		return Controller.extend("fi.zfrfi0050.fs.controller.CreateTemplate", {
			//View Controller ID

			onInit: function () {
				this.getView().setModel(Model.createBaseDataModel(), "BaseData");
				this.getView().setModel(
					Model.createValueHelpDataModel(),
					"ValueHelpData"
				);
				this.getView().getModel("BaseData").setProperty("VATAmount", 0);
				this.getView().getModel("BaseData").setProperty("TaxPer", 0);
				this.getView().setModel(Model.createViewDataModel(), "ViewData");
				this.getView().byId("T_Items").getBinding("items").refresh(true);
				const oRouter = this.getOwnerComponent().getRouter();
				oRouter
					.getRoute("CreateTemplate")
					.attachPatternMatched(this.onObjectMatched, this);
				//      _oVHDialog ,   v4SelectInput

				// //초기값
				// let oBaseData = this.getView().getModel('BaseData');

				// let oDate = new Date();
				// let oMonth = oDate.getMonth() + 1;
				// let oYear = oDate.getFullYear();
				// let oDay = oDate.getDate();
				// if(oDay < 10) {
				//     oDay = "0"+oDay;
				// }
				// let oEnd = oYear+'-'+oMonth+'-'+oDay;

				// oBaseData.setProperty('/Parameters/InputData',oEnd);
			},

			onObjectMatched(oEvent) {
				this.getView().setModel(Model.createBaseDataModel(), "BaseData");
				this.getView().setModel(
					Model.createValueHelpDataModel(),
					"ValueHelpData"
				);
				this.getView().setModel(Model.createViewDataModel(), "ViewData");
				let oBaseData = this.getView().getModel("BaseData");
				oBaseData.setProperty(
					"/Parameters/CompanyCode",
					atob(oEvent.getParameter("arguments").companyCode)
				);
				oBaseData.setProperty("/Items", [
					{
						DebitCreditCode: "H",
						DebitCreditCodeEnable: false,
						GLAccount: "",
						GLAccountEnable: false,
						GLAccountName: "",
						Budgetbalance: 0,
						Currency: "KRW",
						Amount: 0,
						AmountEnable: false,
						Costcenter: "",
						CostcenterEnable: false,
						AmountTax: 0,
						DocumentItemText: "",
						Visible: false,
					},
				]);
				this.onAddBtnPress();
				this.getView().byId("T_Items").getBinding("items").refresh(true);

				let oModel = this.getView().getModel();

				let sUrl = `/sap/opu/odata4/sap/zfi_c_other_receipt_ui_v4/srvd/sap/zfi_c_other_receipt_ui/0001/ZFI_V_PROFITCENTER?$filter=ProfitCenter%20eq%20%270000001000%27`;

				const headers = {
					"X-Csrf-Token": oModel.getHttpHeaders()["X-CSRF-Token"],
				};

				axios
					.get(sUrl, { headers: headers })
					.then(
						function (oResult) {
							if (oResult.data.value.length > 0) {
								oBaseData.setProperty("/profitcenter", "1000");
								oBaseData.setProperty(
									"/profitcentername",
									oResult.data.value[0].ProfitCenterName
								);
							} else {
								oBaseData.setProperty("/profitcenter", "");
								oBaseData.setProperty("/profitcentername", "");
							}
						}.bind(this)
					)
					.catch(
						function (error) {
							oBaseData.setProperty("/profitcenter", "");
							oBaseData.setProperty("/profitcentername", "");
						}.bind(this)
					);
			},

			onAfterRendering: function () {
				let oBaseData = this.getView().getModel("BaseData");
				// oBaseData.setProperty('/View', this.getView());
				let oViewData = this.getView().getModel("ViewData");
				oViewData.setProperty("/_View", this.getView());

				Model.I18n = this.getView().getModel("i18n");
			},

			onAddBtnPress: function (oEvent) {
				//Table Add 버튼
				let oBaseData = this.getView().getModel("BaseData");
				let oBaseDataData = oBaseData.getData();

				oBaseDataData.Items.push({
					DebitCreditCode:
						oBaseData.getProperty("/Items/0/DebitCreditCode") == "S"
							? "H"
							: "S",
					Costcenter: "",
					CostcenterName: "",
					GLAccount: "",
					GLAccountName: "",
					Budgetbalance: 0,
					Amount: 0,
					balance: 0,
					balanceKRW: 0,
					Currency: oBaseDataData.Parameters.Currency,
					AmountTax: 0,
					DocumentItemText: "",
					profitcenterEnable: false,
					profitcenterState: "None",
					profitcenter: "",
					profitcenterName: "",
					CostcenterEnable: false,
					balanceCheck: false,
					balanceEnable: false,
					balanceState: "None",
					balanceCurrency: "KRW",
				});

				oBaseData.setProperty("/Items", oBaseDataData.Items);
				this.getView().byId("T_Items").getBinding("items").refresh(true);
			},

			onRemoveBtnPress: function (oEvent) {
				//Table Remove 버튼
				MessageBox.confirm(Model.I18n.getProperty("Info0010"), {
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function (oAction) {
						let BaseData = this.getView().getModel("BaseData");
						let oTable = this.byId("T_Items");

						if (oAction === sap.m.MessageBox.Action.YES) {
							_(oTable.getSelectedItems().reverse()).forEach(function (n) {
								if (n.getBindingContext("BaseData").getPath() !== "/Items/0") {
									BaseData.getProperty("/Items").splice(
										n.getId().match(/(\d+)$/)[0],
										1
									);
								}
							});
							this.onCalculation();
							BaseData.refresh(true);
							oTable.removeSelections();
						}
					}.bind(this),
				});
			},

			onOpenBusinessPlace: function (oEvent) {
				let oBaseData = this.getView().getModel("BaseData");
				let oValueHelpData = this.getView().getModel("ValueHelpData");
				if (!oValueHelpData.getProperty("/_oVHDialog/VHBusinessPlace")) {
					this.loadFragment({
						name: "fi.zfrfi0050.fs.view.f4.F4BusinessPlace",
					}).then(
						function (oDialog) {
							oValueHelpData.setProperty(
								"/_oVHDialog/VHBusinessPlace",
								oDialog
							);
							this.getView().addDependent(oDialog);
							let oFilterBar = oDialog.getFilterBar();
							let oBasicSearchField = new SearchField();
							oFilterBar.setFilterBarExpanded(false);
							oFilterBar.setBasicSearch(oBasicSearchField);
							oBasicSearchField.attachSearch(function () {
								oFilterBar.search();
							});
							oDialog.getTableAsync().then(
								function (oTable) {
									let vCompanyCode = oBaseData.getProperty(
										"/Parameters/CompanyCode"
									);

									oTable.setModel(this.getView().getModel());
									oTable.setThreshold(100);
									if (oTable.bindRows) {
										oTable.bindAggregation("rows", {
											path: "/ZFI_V_BUSINESSPLACE",
											filters: [
												new Filter({
													path: "CompanyCode",
													operator: FilterOperator.EQ,
													value1: vCompanyCode,
												}),
											],
											events: {
												dataReceived: function () {
													oDialog.update();
												},
											},
										});
										oTable.addColumn(
											new UIColumn({
												label: new Label({ text: "사업장" }),
												template: new Text({ text: "{BusinessPlace}" }),
											})
										);
										oTable.addColumn(
											new UIColumn({
												label: new Label({ text: "사업장내역" }),
												template: new Text({ text: "{BusinessPlaceName}" }),
											})
										);

										// if (vCompanyCode !== '') {
										//     oTable.getBinding('rows').attachFilter(new Filter({
										//         path: 'CompanyCode',
										//         operator: FilterOperator.EQ,
										//         value1: vCompanyCode
										//     }))
										// }
									}

									oDialog.update();
								}.bind(this)
							);
							oDialog.open();
						}.bind(this)
					);
				} else {
					oValueHelpData.getProperty("/_oVHDialog/VHBusinessPlace").open();
				}
			},

			onOpenCurrency: function (oEvent) {
				let oBaseData = this.getView().getModel("BaseData");
				let oValueHelpData = this.getView().getModel("ValueHelpData");
				if (!oValueHelpData.getProperty("/_oVHDialog/VHCurrency")) {
					this.loadFragment({
						name: "fi.zfrfi0050.fs.view.f4.F4Currency",
					}).then(
						function (oDialog) {
							oValueHelpData.setProperty("/_oVHDialog/VHCurrency", oDialog);
							this.getView().addDependent(oDialog);
							let oFilterBar = oDialog.getFilterBar();
							let oBasicSearchField = new SearchField();
							oFilterBar.setFilterBarExpanded(false);
							oFilterBar.setBasicSearch(oBasicSearchField);
							oBasicSearchField.attachSearch(function () {
								oFilterBar.search();
							});
							oDialog.getTableAsync().then(
								function (oTable) {
									oTable.setModel(this.getView().getModel());
									oTable.setThreshold(100);
									if (oTable.bindRows) {
										oTable.bindAggregation("rows", {
											path: "/ZFI_CURRENCY",
											events: {
												dataReceived: function () {
													oDialog.update();
												},
											},
										});
										oTable.addColumn(
											new UIColumn({
												label: new Label({ text: "Currency" }),
												template: new Text({ text: "{Currency}" }),
											})
										);
										oTable.addColumn(
											new UIColumn({
												label: new Label({ text: "CurrencyName" }),
												template: new Text({ text: "{CurrencyName}" }),
											})
										);
									}
									oDialog.update();
								}.bind(this)
							);
							oDialog.open();
						}.bind(this)
					);
				} else {
					oValueHelpData.getProperty("/_oVHDialog/VHCurrency").open();
				}
			},

			onOpenSupplier: function (oEvent) {
				let oBaseData = this.getView().getModel("BaseData");
				let oValueHelpData = this.getView().getModel("ValueHelpData");
				if (!oValueHelpData.getProperty("/_oVHDialog/VHSupplier")) {
					this.loadFragment({
						name: "fi.zfrfi0050.fs.view.f4.F4Supplier",
					}).then(
						function (oDialog) {
							oValueHelpData.setProperty("/_oVHDialog/VHSupplier", oDialog);
							this.getView().addDependent(oDialog);
							let oFilterBar = oDialog.getFilterBar();
							let oBasicSearchField = new SearchField();
							oFilterBar.setFilterBarExpanded(false);
							oFilterBar.setBasicSearch(oBasicSearchField);
							oBasicSearchField.attachSearch(function () {
								oFilterBar.search();
							});
							oDialog.getTableAsync().then(
								function (oTable) {
									oTable.setModel(this.getView().getModel());
									oTable.setThreshold(1000);
									if (oTable.bindRows) {
										oTable.bindAggregation("rows", {
											path: "/ZFI_V_SUPPLIER",
											// parameters: {
											// 	autoExpandSelect: true,
											// 	$$ownRequest: true,
											// 	$expand: "_Company,_PaymentTerms",
											// },
											events: {
												dataReceived: function () {
													oDialog.update();
												},
											},
											// parameters: {
											// 	expand: "_Company",
											// },
										});
										oTable.addColumn(
											new UIColumn({
												label: new Label({ text: "공급업체" }),
												template: new Text({ text: "{Supplier}" }),
											})
										);
										oTable.addColumn(
											new UIColumn({
												label: new Label({ text: "공급업체명" }),
												template: new Text({ text: "{SupplierName}" }),
											})
										);
									}
									oDialog.update();
								}.bind(this)
							);
							oDialog.open();
						}.bind(this)
					);
				} else {
					oValueHelpData.getProperty("/_oVHDialog/VHSupplier").open();
				}
			},

			onOpenVHTaxcode: function (oEvent) {
				let oBaseData = this.getView().getModel("BaseData");
				let oValueHelpData = this.getView().getModel("ValueHelpData");
				if (!oValueHelpData.getProperty("/_oVHDialog/VHTaxcode")) {
					this.loadFragment({
						name: "fi.zfrfi0050.fs.view.f4.F4Taxcode",
					}).then(
						function (oDialog) {
							oValueHelpData.setProperty("/_oVHDialog/VHTaxcode", oDialog);
							this.getView().addDependent(oDialog);
							let oFilterBar = oDialog.getFilterBar();
							let oBasicSearchField = new SearchField();
							oFilterBar.setFilterBarExpanded(false);
							oFilterBar.setBasicSearch(oBasicSearchField);
							oBasicSearchField.attachSearch(function () {
								oFilterBar.search();
							});
							oDialog.getTableAsync().then(
								function (oTable) {
									oTable.setModel(this.getView().getModel());
									oTable.setThreshold(100);
									if (oTable.bindRows) {
										oTable.bindAggregation("rows", {
											path: "/ZFI_V_TAXCODE_C_ETC",
											events: {
												dataReceived: function () {
													oDialog.update();
												},
											},
										});
										oTable.addColumn(
											new UIColumn({
												label: new Label({ text: "세금코드" }),
												template: new Text({ text: "{CodeId}" }),
											})
										);
										oTable.addColumn(
											new UIColumn({
												label: new Label({ text: "세금코드명" }),
												template: new Text({ text: "{CodeName}" }),
											})
										);
									}
									oDialog.update();
								}.bind(this)
							);
							oDialog.open();
						}.bind(this)
					);
				} else {
					oValueHelpData.getProperty("/_oVHDialog/VHTaxcode").open();
				}
			},

			onOpenVHCostCenter: function (oEvent) {
				let oBaseData = this.getView().getModel("BaseData");
				let oValueHelpData = this.getView().getModel("ValueHelpData");
				if (!oValueHelpData.getProperty("/_oVHDialog/VHCostCenter")) {
					this.loadFragment({
						name: "fi.zfrfi0050.fs.view.f4.F4CostCenter",
					}).then(
						function (oDialog) {
							oValueHelpData.setProperty("/_oVHDialog/VHCostCenter", oDialog);
							this.getView().addDependent(oDialog);
							let oFilterBar = oDialog.getFilterBar();
							let oBasicSearchField = new SearchField();
							oFilterBar.setFilterBarExpanded(false);
							oFilterBar.setBasicSearch(oBasicSearchField);
							oBasicSearchField.attachSearch(function () {
								oFilterBar.search();
							});
							oDialog.getTableAsync().then(
								function (oTable) {
									oTable.setModel(this.getView().getModel());
									oTable.setThreshold(100);
									if (oTable.bindRows) {
										oTable.bindAggregation("rows", {
											path: "/ZFI_V_COSTCENTER",
											events: {
												dataReceived: function () {
													oDialog.update();
												},
											},
										});
										oTable.addColumn(
											new UIColumn({
												label: new Label({ text: "비용귀속" }),
												template: new Text({ text: "{CostCenter}" }),
											})
										);
										oTable.addColumn(
											new UIColumn({
												label: new Label({ text: "비용귀속명" }),
												template: new Text({ text: "{CostCenterName}" }),
											})
										);
									}
									oDialog.update();
								}.bind(this)
							);
							oDialog.open();
						}.bind(this)
					);
				} else {
					oValueHelpData.getProperty("/_oVHDialog/VHCostCenter").open();
				}
			},

			onActionVHTBBusinessPlace: function (oEvent) {
				let oBaseData = this.getView().getModel("BaseData");
				let oValueHelpData = this.getView().getModel("ValueHelpData");

				switch (oEvent.sId) {
					case "cancel":
						oValueHelpData.getProperty("/_oVHDialog/VHBusinessPlace").close();
						break;

					case "ok":
						if (oEvent.getParameter("tokens")[0] !== undefined) {
							let token = oEvent.getParameter("tokens")[0].getProperty("key");
							oBaseData.setProperty("/Parameters/BusinessPlace", token);
						}

						oValueHelpData.getProperty("/_oVHDialog/VHBusinessPlace").close();
						break;

					case "search":
						let oFilterBar = oValueHelpData
							.getProperty("/_oVHDialog/VHBusinessPlace")
							.getFilterBar();
						let sSearchQuery = oFilterBar.getBasicSearchValue();
						let aSelectionSet = oEvent.getParameter("selectionSet");

						let aFilters = aSelectionSet.reduce(function (aResult, oControl) {
							if (oControl.getValue()) {
								aResult.push(
									new Filter({
										path: oControl.getName(),
										operator: FilterOperator.Contains,
										value1: oControl.getValue(),
									})
								);
							}

							return aResult;
						}, []);

						aFilters.push(
							new Filter({
								filters: [
									new Filter({
										path: "BusinessPlace",
										operator: FilterOperator.Contains,
										value1: sSearchQuery.substr(0, 10),
									}),
									new Filter({
										path: "BusinessPlaceName",
										operator: FilterOperator.Contains,
										value1: sSearchQuery.substr(0, 20),
									}),
								],
								and: false,
							})
						);

						oValueHelpData
							.getProperty("/_oVHDialog/VHBusinessPlace")
							.getTableAsync()
							.then(
								function (oTable) {
									if (oTable.bindRows) {
										oTable.getBinding("rows").filter(
											new Filter({
												filters: aFilters,
												and: true,
											})
										);
									}
									if (oTable.bindItems) {
										oTable.getBinding("items").filter(
											new Filter({
												filters: aFilters,
												and: true,
											})
										);
									}
									oValueHelpData
										.getProperty("/_oVHDialog/VHBusinessPlace")
										.update();
								}.bind(this)
							);
						break;

					case "afterClose":
						break;
				}
			},

			onChangeAllCurrency: function (oEvent) {
				let oBaseData = this.getView().getModel("BaseData");
				let oBaseDataData = oBaseData.getData();
				let oModel = this.getView().getModel();
				let vPostingDate = oBaseData.getProperty("/Parameters/PostingDate");
				let sUrl = `/sap/opu/odata4/sap/zfi_c_other_receipt_ui_v4/srvd/sap/zfi_c_other_receipt_ui/0001/ZFI_C_EXCHANGERATE(iDate=${vPostingDate})/Set?$expand=_Rate`;

				const headers = {
					"X-Csrf-Token": oModel.getHttpHeaders()["X-CSRF-Token"],
				};

				axios
					.get(sUrl, { headers: headers })
					.then(
						function (oResult) {
							oBaseData.setProperty("/ExchangeRates", oResult.data.value);
							let vCurrency = oBaseData.getProperty("/Parameters/Currency");
							if (vCurrency === "KRW") {
								oBaseData.setProperty("/ExchangeRate", 1);
								oBaseData.setProperty("/ValidityStartDate", "");
								oBaseData.setProperty("/NumberOfSourceCurrencyUnits", 100);
							} else if (oResult.data.value.length > 0) {
								let oNowRate = oResult.data.value.find(
									(e) => e.SourceCurrency == vCurrency
								);
								oBaseData.setProperty(
									"/ExchangeRate",
									oNowRate._Rate.CalExchange
								);
								// oBaseData.setProperty('/ExchangeRate', oNowRate._Rate.ExchangeRate * 100)
								oBaseData.setProperty(
									"/ValidityStartDate",
									oNowRate._Rate.ValidityStartDate
								);
								oBaseData.setProperty(
									"/NumberOfSourceCurrencyUnits",
									oNowRate._Rate.NumberOfSourceCurrencyUnits
								);
							} else {
								oBaseData.setProperty("/ExchangeRate", 0);
								oBaseData.setProperty("/ValidityStartDate", "");
								oBaseData.setProperty("/NumberOfSourceCurrencyUnits", 0);
							}
							let aDetailItems = oBaseData.getProperty("/Items");
							for (let i = 0; i < oBaseDataData.Items.length; i++) {
								oBaseData.setProperty(
									"/Items/" + i + "/Currency",
									oBaseDataData.Parameters.Currency
								);
							}
							aDetailItems.forEach((element, idx) => {
								if (idx === 0) return;
								let sPath = `/Items/${idx}`;
								if (oBaseData.getProperty(`${sPath}/balanceEnable`)) {
									this._changeBalance(sPath);
								}
							});
						}.bind(this)
					)
					.catch(
						function (error) {
							oBaseData.setProperty("/ExchangeRate", 0);
							oBaseData.setProperty("/ValidityStartDate", "");
							oBaseData.setProperty("/NumberOfSourceCurrencyUnits", 0);
							let aDetailItems = oBaseData.getProperty("/Items");
							for (let i = 0; i < oBaseDataData.Items.length; i++) {
								oBaseData.setProperty(
									"/Items/" + i + "/Currency",
									oBaseDataData.Parameters.Currency
								);
							}
							aDetailItems.forEach((element, idx) => {
								if (idx === 0) return;
								let sPath = `/Items/${idx}`;
								if (oBaseData.getProperty(`${sPath}/balanceEnable`)) {
									this._changeBalance(sPath);
								}
							});
						}.bind(this)
					);
			},
			onActionVHCurrency: function (oEvent) {
				let oBaseData = this.getView().getModel("BaseData");
				let oValueHelpData = this.getView().getModel("ValueHelpData");

				switch (oEvent.sId) {
					case "cancel":
						oValueHelpData.getProperty("/_oVHDialog/VHCurrency").close();
						break;

					case "ok":
						if (oEvent.getParameter("tokens")[0] !== undefined) {
							let token = oEvent.getParameter("tokens")[0].getProperty("key");
							oBaseData.setProperty("/Parameters/Currency", token);
							this.onChangeAllCurrency();
						}

						oValueHelpData.getProperty("/_oVHDialog/VHCurrency").close();
						break;

					case "search":
						let oFilterBar = oValueHelpData
							.getProperty("/_oVHDialog/VHCurrency")
							.getFilterBar();
						let sSearchQuery = oFilterBar.getBasicSearchValue();
						let aSelectionSet = oEvent.getParameter("selectionSet");

						let aFilters = aSelectionSet.reduce(function (aResult, oControl) {
							if (oControl.getValue()) {
								aResult.push(
									new Filter({
										path: oControl.getName(),
										operator: FilterOperator.Contains,
										value1: oControl.getValue(),
									})
								);
							}

							return aResult;
						}, []);

						aFilters.push(
							new Filter({
								filters: [
									new Filter({
										path: "Currency",
										operator: FilterOperator.Contains,
										value1: sSearchQuery.substr(0, 10),
									}),
									new Filter({
										path: "CurrencyName",
										operator: FilterOperator.Contains,
										value1: sSearchQuery.substr(0, 20),
									}),
								],
								and: false,
							})
						);

						oValueHelpData
							.getProperty("/_oVHDialog/VHCurrency")
							.getTableAsync()
							.then(
								function (oTable) {
									if (oTable.bindRows) {
										oTable.getBinding("rows").filter(
											new Filter({
												filters: aFilters,
												and: true,
											})
										);
									}
									if (oTable.bindItems) {
										oTable.getBinding("items").filter(
											new Filter({
												filters: aFilters,
												and: true,
											})
										);
									}
									oValueHelpData.getProperty("/_oVHDialog/VHCurrency").update();
								}.bind(this)
							);
						break;

					case "afterClose":
						break;
				}
			},

			onActionVHSupplier: function (oEvent) {
				let oBaseData = this.getView().getModel("BaseData");
				let oValueHelpData = this.getView().getModel("ValueHelpData");

				switch (oEvent.sId) {
					case "cancel":
						oValueHelpData.getProperty("/_oVHDialog/VHSupplier").close();
						break;

					case "ok":
						if (oEvent.getParameter("tokens")[0] !== undefined) {
							let token = oEvent.getParameter("tokens")[0].getProperty("key");
							let oTable = oEvent.oSource.getTable();
							oBaseData.setProperty("/Parameters/Supplier", token);
							oBaseData.setProperty("/Parameters/Bank", "");
							oBaseData.setProperty("/Parameters/BankCountry", "");
							oBaseData.setProperty("/Parameters/Bankaccount", "");

							oBaseData.setProperty("/Parameters/PaymentTerms", "");
							if (
								!oBaseData.getProperty("/Parameters/PostingDate") ||
								oBaseData.getProperty("/Parameters/PostingDate") == ""
							) {
								oBaseData.setProperty("/Parameters/Paymentscheduled", "");
							} else {
								oBaseData.setProperty(
									"/Parameters/Paymentscheduled",
									oBaseData.getProperty("/Parameters/PostingDate")
								);
							}

							let sCompanyCode = oBaseData.getProperty(
								"/Parameters/CompanyCode"
							);
							let oModel = this.getView().getModel();
							let sUrl = `/sap/opu/odata4/sap/zfi_c_other_receipt_ui_v4/srvd/sap/zfi_c_other_receipt_ui/0001/ZFI_V_SUPPLIER
                ?$filter=Supplier%20eq%20%27${
									"0".repeat(10 - token.length) + token
								}%27
                &$expand=_Company($filter=CompanyCode%20eq%20%27${
									"0".repeat(4 - sCompanyCode.length) + sCompanyCode
								}%27),_PaymentTerms($filter=CompanyCode%20eq%20%27${
								"0".repeat(4 - sCompanyCode.length) + sCompanyCode
							}%27),_PaymentMthoed($filter=CompanyCode%20eq%20%27${
								"0".repeat(4 - sCompanyCode.length) + sCompanyCode
							}%27)`;

							const headers = {
								"X-Csrf-Token": oModel.getHttpHeaders()["X-CSRF-Token"],
							};

							axios
								.get(sUrl, { headers: headers })
								.then(
									function (oResult) {
										if (oResult.data.value.length > 0) {
											oBaseData.setProperty(
												"/Parameters/AccountRecon",
												oResult.data.value[0]._Company[0].ReconciliationAccount
											);
											oBaseData.setProperty(
												"/Parameters/PaymentTerms",
												oResult.data.value[0]._PaymentTerms[0].PaymentTerms
											);
											oBaseData.setProperty(
												"/Parameters/CashDiscount1Days",
												oResult.data.value[0]._PaymentTerms[0].CashDiscount1Days
											);
											oBaseData.setProperty(
												"/Parameters/PaymentMethod",
												oResult.data.value[0]._PaymentMthoed[0]
													.PaymentMethodsList
											);
										} else {
											oBaseData.setProperty("/Parameters/AccountRecon", "");
											oBaseData.setProperty("/Parameters/PaymentTerms", "");
											oBaseData.setProperty("/Parameters/CashDiscount1Days", 0);
											oBaseData.setProperty("/Parameters/PaymentMethod", "");
										}
										if (
											!oBaseData.getProperty("/Parameters/PostingDate") ||
											oBaseData.getProperty("/Parameters/PostingDate") == ""
										) {
											oBaseData.setProperty("/Parameters/Paymentscheduled", "");
										} else if (
											!oBaseData.getProperty("/Parameters/PaymentTerms") ||
											oBaseData.getProperty("/Parameters/PaymentTerms") == ""
										) {
											oBaseData.setProperty(
												"/Parameters/Paymentscheduled",
												oBaseData.getProperty("/Parameters/PostingDate")
											);
										} else {
											this.onCalculationPaymentscheduled();
										}
										this.getView().byId("iptAcctRecon").fireChange();
									}.bind(this)
								)
								.catch(
									function (sPath, error) {
										oBaseData.setProperty("/Parameters/AccountRecon", "");
										oBaseData.setProperty("/Parameters/PaymentTerms", "");
										oBaseData.setProperty("/Parameters/CashDiscount1Days", 0);
										oBaseData.setProperty("/Parameters/PaymentMethod", "");
										if (
											!oBaseData.getProperty("/Parameters/PostingDate") ||
											oBaseData.getProperty("/Parameters/PostingDate") == ""
										) {
											oBaseData.setProperty("/Parameters/Paymentscheduled", "");
										} else {
											oBaseData.setProperty(
												"/Parameters/Paymentscheduled",
												oBaseData.getProperty("/Parameters/PostingDate")
											);
										}
										this.getView().byId("iptAcctRecon").fireChange();
									}.bind(this)
								);
						}

						oValueHelpData.getProperty("/_oVHDialog/VHSupplier").close();
						break;

					case "search":
						let oFilterBar = oValueHelpData
							.getProperty("/_oVHDialog/VHSupplier")
							.getFilterBar();
						let sSearchQuery = oFilterBar.getBasicSearchValue();
						let aSelectionSet = oEvent.getParameter("selectionSet");

						let aFilters = aSelectionSet.reduce(function (aResult, oControl) {
							if (oControl.getValue()) {
								aResult.push(
									new Filter({
										path: oControl.getName(),
										operator: FilterOperator.Contains,
										value1: oControl.getValue(),
									})
								);
							}

							return aResult;
						}, []);

						aFilters.push(
							new Filter({
								filters: [
									new Filter({
										path: "Supplier",
										operator: FilterOperator.Contains,
										value1: sSearchQuery.substr(0, 10),
									}),
									new Filter({
										path: "SupplierName",
										operator: FilterOperator.Contains,
										value1: sSearchQuery.substr(0, 20),
									}),
								],
								and: false,
							})
						);

						oValueHelpData
							.getProperty("/_oVHDialog/VHSupplier")
							.getTableAsync()
							.then(
								function (oTable) {
									if (oTable.bindRows) {
										oTable.getBinding("rows").filter(
											new Filter({
												filters: aFilters,
												and: true,
											})
										);
									}
									if (oTable.bindItems) {
										oTable.getBinding("items").filter(
											new Filter({
												filters: aFilters,
												and: true,
											})
										);
									}
									oValueHelpData.getProperty("/_oVHDialog/VHSupplier").update();
								}.bind(this)
							);
						break;

					case "afterClose":
						break;
				}
			},
			onActionVHCostCenter: function (oEvent) {
				let oBaseData = this.getView().getModel("BaseData");
				let oValueHelpData = this.getView().getModel("ValueHelpData");

				switch (oEvent.sId) {
					case "cancel":
						oValueHelpData.getProperty("/_oVHDialog/VHCostCenter").close();
						break;

					case "ok":
						if (oEvent.getParameter("tokens")[0] !== undefined) {
							let oTable = oEvent.oSource.getTable();
							let token = oEvent.getParameter("tokens")[0].getProperty("key");
							oBaseData.setProperty("/Parameters/Costcenter", token);
							let CostCenterName = oTable
								.getContextByIndex(oTable.getSelectedIndex())
								.getObject();
							oBaseData.setProperty(
								"/Parameters/CostcenterName",
								CostCenterName.CostCenterName
							);
						}

						oValueHelpData.getProperty("/_oVHDialog/VHCostCenter").close();
						break;

					case "search":
						let oFilterBar = oValueHelpData
							.getProperty("/_oVHDialog/VHCostCenter")
							.getFilterBar();
						let sSearchQuery = oFilterBar.getBasicSearchValue();
						let aSelectionSet = oEvent.getParameter("selectionSet");

						let aFilters = aSelectionSet.reduce(function (aResult, oControl) {
							if (oControl.getValue()) {
								aResult.push(
									new Filter({
										path: oControl.getName(),
										operator: FilterOperator.Contains,
										value1: oControl.getValue(),
									})
								);
							}

							return aResult;
						}, []);

						aFilters.push(
							new Filter({
								filters: [
									new Filter({
										path: "CostCenter",
										operator: FilterOperator.Contains,
										value1: sSearchQuery.substr(0, 10),
									}),
									new Filter({
										path: "CostCenterName",
										operator: FilterOperator.Contains,
										value1: sSearchQuery.substr(0, 20),
									}),
								],
								and: false,
							})
						);

						oValueHelpData
							.getProperty("/_oVHDialog/VHCostCenter")
							.getTableAsync()
							.then(
								function (oTable) {
									if (oTable.bindRows) {
										oTable.getBinding("rows").filter(
											new Filter({
												filters: aFilters,
												and: true,
											})
										);
									}
									if (oTable.bindItems) {
										oTable.getBinding("items").filter(
											new Filter({
												filters: aFilters,
												and: true,
											})
										);
									}
									oValueHelpData
										.getProperty("/_oVHDialog/VHCostCenter")
										.update();
								}.bind(this)
							);
						break;

					case "afterClose":
						break;
				}
			},

			onOpenVHTBCostCenter: function (oEvent) {
				let oBaseData = this.getView().getModel("BaseData");
				let oValueHelpData = this.getView().getModel("ValueHelpData");
				oValueHelpData.setProperty("/v4SelectInput", oEvent.getSource());

				this.loadFragment({
					name: "fi.zfrfi0050.fs.view.f4.F4TBCostCenter",
				}).then(
					function (oDialog) {
						oValueHelpData.setProperty("/_oVHDialog/VHTBCostCenter", oDialog);
						this.getView().addDependent(oDialog);
						let oFilterBar = oDialog.getFilterBar();
						let oBasicSearchField = new SearchField();
						oFilterBar.setFilterBarExpanded(false);
						oFilterBar.setBasicSearch(oBasicSearchField);
						oBasicSearchField.attachSearch(function () {
							oFilterBar.search();
						});
						oDialog.getTableAsync().then(
							function (oTable) {
								oTable.setModel(this.getView().getModel());
								oTable.setThreshold(100);
								if (oTable.bindRows) {
									oTable.bindAggregation("rows", {
										path: "/ZFI_V_COSTCENTER_C_ETC",
										events: {
											dataReceived: function () {
												oDialog.update();
											},
										},
									});
									oTable.addColumn(
										new UIColumn({
											label: new Label({ text: "비용귀속" }),
											template: new Text({ text: "{CodeId}" }),
										})
									);
									oTable.addColumn(
										new UIColumn({
											label: new Label({ text: "비용귀속명" }),
											template: new Text({ text: "{CodeName}" }),
										})
									);
								}
								oDialog.update();
							}.bind(this)
						);
						oDialog.open();
					}.bind(this)
				);
			},

			onOpenVHTBAccount: function (oEvent) {
				let oBaseData = this.getView().getModel("BaseData");
				let oValueHelpData = this.getView().getModel("ValueHelpData");
				oValueHelpData.setProperty("/v4SelectInput", oEvent.getSource());

				this.loadFragment({
					name: "fi.zfrfi0050.fs.view.f4.F4Account",
				}).then(
					function (oDialog) {
						oValueHelpData.setProperty("/_oVHDialog/VHTBGLAccount", oDialog);
						this.getView().addDependent(oDialog);
						let oFilterBar = oDialog.getFilterBar();
						let oBasicSearchField = new SearchField();
						oFilterBar.setFilterBarExpanded(false);
						oFilterBar.setBasicSearch(oBasicSearchField);
						oBasicSearchField.attachSearch(function () {
							oFilterBar.search();
						});
						oDialog.getTableAsync().then(
							function (oTable) {
								oTable.setModel(this.getView().getModel());
								oTable.setThreshold(100);
								if (oTable.bindRows) {
									oTable.bindAggregation("rows", {
										path: "/ZFI_V_ACCOUNT_C_ETC",
										events: {
											dataReceived: function () {
												oDialog.update();
											},
										},
									});
									oTable.addColumn(
										new UIColumn({
											label: new Label({ text: "G/L 계정" }),
											template: new Text({ text: "{CodeId}" }),
										})
									);
									oTable.addColumn(
										new UIColumn({
											label: new Label({ text: "G/L 계정명" }),
											template: new Text({ text: "{CodeName}" }),
										})
									);
								}
								oDialog.update();
							}.bind(this)
						);
						oDialog.open();
					}.bind(this)
				);
			},

			onOpenVHTBCurrency: function (oEvent) {
				let oBaseData = this.getView().getModel("BaseData");
				let oValueHelpData = this.getView().getModel("ValueHelpData");
				oValueHelpData.setProperty("/v4SelectInput", oEvent.getSource());

				if (!oValueHelpData.getProperty("/_oVHDialog/VHTBCurrency")) {
					this.loadFragment({
						name: "fi.zfrfi0050.fs.view.f4.F4TBCurrency",
					}).then(
						function (oDialog) {
							oValueHelpData.setProperty("/_oVHDialog/VHTBCurrency", oDialog);
							this.getView().addDependent(oDialog);
							let oFilterBar = oDialog.getFilterBar();
							let oBasicSearchField = new SearchField();
							oFilterBar.setFilterBarExpanded(false);
							oFilterBar.setBasicSearch(oBasicSearchField);
							oBasicSearchField.attachSearch(function () {
								oFilterBar.search();
							});
							oDialog.getTableAsync().then(
								function (oTable) {
									oTable.setModel(this.getView().getModel());
									oTable.setThreshold(100);
									if (oTable.bindRows) {
										oTable.bindAggregation("rows", {
											path: "/ZFI_CURRENCY",
											events: {
												dataReceived: function () {
													oDialog.update();
												},
											},
										});
										oTable.addColumn(
											new UIColumn({
												label: new Label({ text: "통화" }),
												template: new Text({ text: "{Currency}" }),
											})
										);
										oTable.addColumn(
											new UIColumn({
												label: new Label({ text: "통화명" }),
												template: new Text({ text: "{CurrencyName}" }),
											})
										);
									}
									oDialog.update();
								}.bind(this)
							);
							oDialog.open();
						}.bind(this)
					);
				} else {
					oValueHelpData.getProperty("/_oVHDialog/VHTBCurrency").open();
				}
			},

			onOpenVHTBTaxCode: function (oEvent) {
				let oBaseData = this.getView().getModel("BaseData");
				let oValueHelpData = this.getView().getModel("ValueHelpData");
				oValueHelpData.setProperty("/v4SelectInput", oEvent.getSource());

				if (!oValueHelpData.getProperty("/_oVHDialog/VHTBTaxCode")) {
					this.loadFragment({
						name: "fi.zfrfi0050.fs.view.f4.F4TBTaxcode",
					}).then(
						function (oDialog) {
							oValueHelpData.setProperty("/_oVHDialog/VHTBTaxCode", oDialog);
							this.getView().addDependent(oDialog);
							let oFilterBar = oDialog.getFilterBar();
							let oBasicSearchField = new SearchField();
							oFilterBar.setFilterBarExpanded(false);
							oFilterBar.setBasicSearch(oBasicSearchField);
							oBasicSearchField.attachSearch(function () {
								oFilterBar.search();
							});
							oDialog.getTableAsync().then(
								function (oTable) {
									oTable.setModel(this.getView().getModel());
									oTable.setThreshold(100);
									if (oTable.bindRows) {
										oTable.bindAggregation("rows", {
											path: "/ZFI_V_TAXCODE_C",
											events: {
												dataReceived: function () {
													oDialog.update();
												},
											},
										});
										oTable.addColumn(
											new UIColumn({
												label: new Label({ text: "세금코드" }),
												template: new Text({ text: "{CodeId}" }),
											})
										);
										oTable.addColumn(
											new UIColumn({
												label: new Label({ text: "세금코드명" }),
												template: new Text({ text: "{CodeName}" }),
											})
										);
									}
									oDialog.update();
								}.bind(this)
							);
							oDialog.open();
						}.bind(this)
					);
				} else {
					oValueHelpData.getProperty("/_oVHDialog/VHTBTaxCode").open();
				}
			},

			onOpenVHBankAccount: function (oEvent) {
				let oBaseData = this.getView().getModel("BaseData");
				let oValueHelpData = this.getView().getModel("ValueHelpData");
				let oBaseDataData = oBaseData.getData();

				if (
					!oBaseDataData.Parameters.Supplier &&
					oBaseDataData.Parameters.Supplier == ""
				) {
					oBaseData.setProperty("/Parameters/SupplierState", "Error");
					MessageBox.error("공급 업체를 입력하세요!");
				} else {
					oBaseData.setProperty("/Parameters/SupplierState", "None");
					if (!oValueHelpData.getProperty("/_oVHDialog/VHBankAccount")) {
						this.loadFragment({
							name: "fi.zfrfi0050.fs.view.f4.F4BankAccount",
						}).then(
							function (oDialog) {
								oValueHelpData.setProperty(
									"/_oVHDialog/VHBankAccount",
									oDialog
								);
								this.getView().addDependent(oDialog);
								let oFilterBar = oDialog.getFilterBar();
								let oBasicSearchField = new SearchField();
								oFilterBar.setFilterBarExpanded(false);
								oFilterBar.setBasicSearch(oBasicSearchField);
								oBasicSearchField.attachSearch(function () {
									oFilterBar.search();
								});
								oDialog.getTableAsync().then(
									function (oTable) {
										oTable.setModel(this.getView().getModel());
										oTable.setThreshold(100);
										if (oTable.bindRows) {
											oTable.bindAggregation("rows", {
												path: "/ZFI_V_SUPPLIER_ACCOUNT",
												events: {
													dataReceived: function () {
														oDialog.update();
													},
												},
											});
											oTable.addColumn(
												new UIColumn({
													label: new Label({ text: "공급업체" }),
													template: new Text({ text: "{Supplier}" }),
												})
											);
											oTable.addColumn(
												new UIColumn({
													label: new Label({ text: "계좌번호" }),
													template: new Text({ text: "{BankAccount}" }),
												})
											);
											oTable.addColumn(
												new UIColumn({
													label: new Label({ text: "은행" }),
													template: new Text({ text: "{Bank}" }),
												})
											);
											oTable.addColumn(
												new UIColumn({
													label: new Label({ text: "은행국가" }),
													template: new Text({ text: "{BankCountry}" }),
												})
											);
											oTable.addColumn(
												new UIColumn({
													label: new Label({ text: "예금주" }),
													template: new Text({
														text: "{BankAccountHolderName}",
													}),
												})
											);
											oTable.addColumn(
												new UIColumn({
													label: new Label({ text: "계좌명" }),
													template: new Text({
														text: "{BankAccountName}",
													}),
												})
											);
										}
										oTable.getBinding("rows").filter(
											new Filter({
												path: "Supplier",
												operator: FilterOperator.Contains,
												value1: oBaseDataData.Parameters.Supplier,
											})
										);
										oDialog.update();
									}.bind(this)
								);
								oDialog.open();
							}.bind(this)
						);
					} else {
						oValueHelpData
							.getProperty("/_oVHDialog/VHBankAccount")
							.getTable()
							.getBinding("rows")
							.filter(
								new Filter({
									path: "Supplier",
									operator: FilterOperator.Contains,
									value1: oBaseDataData.Parameters.Supplier,
								})
							);
						oValueHelpData.getProperty("/_oVHDialog/VHBankAccount").open();
					}
				}
			},

			onOpenVHAccountRecon: function (oEvent) {
				let oBaseData = this.getView().getModel("BaseData");
				let oValueHelpData = this.getView().getModel("ValueHelpData");
				let oBaseDataData = oBaseData.getData();

				if (!oValueHelpData.getProperty("/_oVHDialog/VHAccountRecon")) {
					this.loadFragment({
						name: "fi.zfrfi0050.fs.view.f4.F4AccountRecon",
					}).then(
						function (oDialog) {
							oValueHelpData.setProperty("/_oVHDialog/VHAccountRecon", oDialog);
							this.getView().addDependent(oDialog);
							let oFilterBar = oDialog.getFilterBar();
							let oBasicSearchField = new SearchField();
							oFilterBar.setFilterBarExpanded(false);
							oFilterBar.setBasicSearch(oBasicSearchField);
							oBasicSearchField.attachSearch(function () {
								oFilterBar.search();
							});
							oDialog.getTableAsync().then(
								function (oTable) {
									oTable.setModel(this.getView().getModel());
									oTable.setThreshold(100);
									if (oTable.bindRows) {
										oTable.bindAggregation("rows", {
											path: "/ZFI_V_ACCOUNT_RECON",
											events: {
												dataReceived: function () {
													oDialog.update();
												},
											},
										});
										oTable.addColumn(
											new UIColumn({
												label: new Label({ text: "{i18n>AccountRecon}" }),
												template: new Text({ text: "{GLAccount}" }),
											})
										);
										oTable.addColumn(
											new UIColumn({
												label: new Label({ text: "{i18n>AccountReconName}" }),
												template: new Text({ text: "{GLAccountName}" }),
											})
										);
									}
									oDialog.update();
								}.bind(this)
							);
							oDialog.open();
						}.bind(this)
					);
				} else {
					oValueHelpData.getProperty("/_oVHDialog/VHAccountRecon").open();
				}
			},
			onOpenVHPaymentTerms: function (oEvent) {
				let oBaseData = this.getView().getModel("BaseData");
				let oValueHelpData = this.getView().getModel("ValueHelpData");
				let oBaseDataData = oBaseData.getData();
				let isTrue = true;
				if (
					!oBaseDataData.Parameters.PostingDate ||
					oBaseDataData.Parameters.PostingDate == ""
				) {
					isTrue = false;
					oBaseData.setProperty("/Parameters/PostingDateState", "Error");
				}
				// if (
				//   !oBaseDataData.Parameters.Supplier ||
				//   oBaseDataData.Parameters.Supplier == ""
				// ) {
				//   isTrue = false;
				//   oBaseData.setProperty("/Parameters/SupplierState", "Error");
				// }
				if (isTrue) {
					oBaseData.setProperty("/Parameters/SupplierState", "None");
					oBaseData.setProperty("/Parameters/PostingDateState", "None");
					if (!oValueHelpData.getProperty("/_oVHDialog/VHPaymentTerms")) {
						this.loadFragment({
							name: "fi.zfrfi0050.fs.view.f4.F4PaymentTerms",
						}).then(
							function (oDialog) {
								oValueHelpData.setProperty(
									"/_oVHDialog/VHPaymentTerms",
									oDialog
								);
								this.getView().addDependent(oDialog);
								let oFilterBar = oDialog.getFilterBar();
								let oBasicSearchField = new SearchField();
								oFilterBar.setFilterBarExpanded(false);
								oFilterBar.setBasicSearch(oBasicSearchField);
								oBasicSearchField.attachSearch(function () {
									oFilterBar.search();
								});
								oDialog.getTableAsync().then(
									function (oTable) {
										oTable.setModel(this.getView().getModel());
										oTable.setThreshold(100);
										if (oTable.bindRows) {
											oTable.bindAggregation("rows", {
												path: "/ZFI_V_PAYMENT_TERMS_STD",
												events: {
													dataReceived: function () {
														oDialog.update();
													},
												},
											});
											// oTable.addColumn(
											//   new UIColumn({
											//     label: new Label({ text: "회사코드" }),
											//     template: new Text({ text: "{CompanyCode}" }),
											//   })
											// );
											// oTable.addColumn(
											//   new UIColumn({
											//     label: new Label({ text: "공급업체" }),
											//     template: new Text({ text: "{Supplier}" }),
											//   })
											// );
											oTable.addColumn(
												new UIColumn({
													label: new Label({ text: "지급조건" }),
													template: new Text({ text: "{PaymentTerms}" }),
												})
											);
											oTable.addColumn(
												new UIColumn({
													label: new Label({ text: "지급조건내역" }),
													template: new Text({ text: "{PaymentTermsName}" }),
												})
											);
											oTable.addColumn(
												new UIColumn({
													label: new Label({ text: "지급일수" }),
													template: new Text({ text: "{CashDiscount1Days}" }),
												})
											);
										}
										// oTable.getBinding("rows").filter(
										//   new Filter({
										//     path: "Supplier",
										//     operator: FilterOperator.Contains,
										//     value1: oBaseDataData.Parameters.Supplier,
										//   })
										// );

										oDialog.update();
									}.bind(this)
								);
								oDialog.open();
							}.bind(this)
						);
					} else {
						// oValueHelpData
						//   .getProperty("/_oVHDialog/VHPaymentTerms")
						//   .getTable()
						//   .getBinding("rows")
						//   .filter(
						//     new Filter({
						//       path: "Supplier",
						//       operator: FilterOperator.Contains,
						//       value1: oBaseDataData.Parameters.Supplier,
						//     })
						//   );
						oValueHelpData.getProperty("/_oVHDialog/VHPaymentTerms").open();
					}
				}
			},

			onOpenVHPaymentMethod: function (oEvent) {
				let oBaseData = this.getView().getModel("BaseData");
				let oValueHelpData = this.getView().getModel("ValueHelpData");
				let oBaseDataData = oBaseData.getData();
				let isTrue = true;

				if (!oValueHelpData.getProperty("/_oVHDialog/VHPaymentMethod")) {
					this.loadFragment({
						name: "fi.zfrfi0050.fs.view.f4.F4PaymentMethod",
					}).then(
						function (oDialog) {
							oValueHelpData.setProperty(
								"/_oVHDialog/VHPaymentMethod",
								oDialog
							);
							this.getView().addDependent(oDialog);
							let oFilterBar = oDialog.getFilterBar();
							let oBasicSearchField = new SearchField();
							oFilterBar.setFilterBarExpanded(false);
							oFilterBar.setBasicSearch(oBasicSearchField);
							oBasicSearchField.attachSearch(function () {
								oFilterBar.search();
							});
							oDialog.getTableAsync().then(
								function (oTable) {
									oTable.setModel(this.getView().getModel());
									oTable.setThreshold(100);
									if (oTable.bindRows) {
										oTable.bindAggregation("rows", {
											path: "/ZFI_V_PAYMENT_METHOD_STD",
											events: {
												dataReceived: function () {
													oDialog.update();
												},
											},
										});
										oTable.addColumn(
											new UIColumn({
												label: new Label({ text: "지급방법" }),
												template: new Text({ text: "{PaymentMethodsList}" }),
											})
										);
										oTable.addColumn(
											new UIColumn({
												label: new Label({ text: "지급방법내역" }),
												template: new Text({ text: "{PaymentMethodName}" }),
											})
										);
									}

									oDialog.update();
								}.bind(this)
							);
							oDialog.open();
						}.bind(this)
					);
				} else {
					oValueHelpData.getProperty("/_oVHDialog/VHPaymentMethod").open();
				}
			},

			onCalculationPaymentscheduled: function () {
				let oBaseData = this.getView().getModel("BaseData");
				let currentDate = new Date(
					oBaseData.getProperty("/Parameters/PostingDate")
				);
				currentDate.setDate(
					currentDate.getDate() +
						Number(oBaseData.getProperty("/Parameters/CashDiscount1Days"))
				);
				let oMonth = currentDate.getMonth() + 1;
				let oYear = currentDate.getFullYear();
				let oDay = currentDate.getDate();
				if (oDay < 10) {
					oDay = "0" + oDay;
				}
				if (oMonth < 10) {
					oMonth = "0" + oMonth;
				}
				let oEnd = oYear + "-" + oMonth + "-" + oDay;

				oBaseData.setProperty("/Parameters/Paymentscheduled", oEnd);
			},
			onActionVHPaymentTerms: function (oEvent) {
				let oBaseData = this.getView().getModel("BaseData");
				let oValueHelpData = this.getView().getModel("ValueHelpData");

				switch (oEvent.sId) {
					case "cancel":
						oValueHelpData.getProperty("/_oVHDialog/VHPaymentTerms").close();
						break;

					case "ok":
						if (oEvent.getParameter("tokens")[0] !== undefined) {
							let oTable = oEvent.oSource.getTable();
							let CashDiscount1Days = oTable
								.getContextByIndex(oTable.getSelectedIndex())
								.getObject().CashDiscount1Days;
							oBaseData.setProperty(
								"/Parameters/CashDiscount1Days",
								CashDiscount1Days
							);
							let token = oEvent.getParameter("tokens")[0].getProperty("key");
							oBaseData.setProperty("/Parameters/PaymentTerms", token);
						}

						this.onCalculationPaymentscheduled();
						oValueHelpData.getProperty("/_oVHDialog/VHPaymentTerms").close();
						break;

					case "search":
						let oFilterBar = oValueHelpData
							.getProperty("/_oVHDialog/VHPaymentTerms")
							.getFilterBar();
						let sSearchQuery = oFilterBar.getBasicSearchValue();
						let aSelectionSet = oEvent.getParameter("selectionSet");

						let aFilters = aSelectionSet.reduce(function (aResult, oControl) {
							if (oControl.getValue()) {
								aResult.push(
									new Filter({
										path: oControl.getName(),
										operator: FilterOperator.Contains,
										value1: oControl.getValue(),
									})
								);
							}

							return aResult;
						}, []);

						aFilters.push(
							new Filter({
								filters: [
									new Filter({
										path: "PaymentTerms",
										operator: FilterOperator.Contains,
										value1: sSearchQuery.substr(0, 10),
									}),
									new Filter({
										path: "PaymentTermsDescription",
										operator: FilterOperator.Contains,
										value1: sSearchQuery.substr(0, 20),
									}),
								],
								and: false,
							})
						);

						oValueHelpData
							.getProperty("/_oVHDialog/VHPaymentTerms")
							.getTableAsync()
							.then(
								function (oTable) {
									if (oTable.bindRows) {
										oTable.getBinding("rows").filter(
											new Filter({
												filters: aFilters,
												and: true,
											})
										);
									}
									if (oTable.bindItems) {
										oTable.getBinding("items").filter(
											new Filter({
												filters: aFilters,
												and: true,
											})
										);
									}
									oValueHelpData
										.getProperty("/_oVHDialog/VHPaymentTerms")
										.update();
								}.bind(this)
							);
						break;

					case "afterClose":
						break;
				}
			},
			onActionVHPaymentMethod: function (oEvent) {
				let oBaseData = this.getView().getModel("BaseData");
				let oValueHelpData = this.getView().getModel("ValueHelpData");

				switch (oEvent.sId) {
					case "cancel":
						oValueHelpData.getProperty("/_oVHDialog/VHPaymentMethod").close();
						break;

					case "ok":
						if (oEvent.getParameter("tokens")[0] !== undefined) {
							let oTable = oEvent.oSource.getTable();
							let token = oEvent.getParameter("tokens")[0].getProperty("key");
							oBaseData.setProperty("/Parameters/PaymentMethod", token);
						}
						oValueHelpData.getProperty("/_oVHDialog/VHPaymentMethod").close();
						break;

					case "search":
						let oFilterBar = oValueHelpData
							.getProperty("/_oVHDialog/VHPaymentMethod")
							.getFilterBar();
						let sSearchQuery = oFilterBar.getBasicSearchValue();
						let aSelectionSet = oEvent.getParameter("selectionSet");

						let aFilters = aSelectionSet.reduce(function (aResult, oControl) {
							if (oControl.getValue()) {
								aResult.push(
									new Filter({
										path: oControl.getName(),
										operator: FilterOperator.Contains,
										value1: oControl.getValue(),
									})
								);
							}

							return aResult;
						}, []);

						aFilters.push(
							new Filter({
								filters: [
									new Filter({
										path: "PaymentMethodsList",
										operator: FilterOperator.Contains,
										value1: sSearchQuery.substr(0, 10),
									}),
									new Filter({
										path: "PaymentMethodName",
										operator: FilterOperator.Contains,
										value1: sSearchQuery.substr(0, 20),
									}),
								],
								and: false,
							})
						);

						oValueHelpData
							.getProperty("/_oVHDialog/VHPaymentMethod")
							.getTableAsync()
							.then(
								function (oTable) {
									if (oTable.bindRows) {
										oTable.getBinding("rows").filter(
											new Filter({
												filters: aFilters,
												and: true,
											})
										);
									}
									if (oTable.bindItems) {
										oTable.getBinding("items").filter(
											new Filter({
												filters: aFilters,
												and: true,
											})
										);
									}
									oValueHelpData
										.getProperty("/_oVHDialog/VHPaymentMethod")
										.update();
								}.bind(this)
							);
						break;

					case "afterClose":
						break;
				}
			},
			onActionVHBankAccount: function (oEvent) {
				let oBaseData = this.getView().getModel("BaseData");
				let oValueHelpData = this.getView().getModel("ValueHelpData");

				switch (oEvent.sId) {
					case "cancel":
						oValueHelpData.getProperty("/_oVHDialog/VHBankAccount").close();
						break;

					case "ok":
						if (oEvent.getParameter("tokens")[0] !== undefined) {
							let oTable = oEvent.oSource.getTable();
							let BankName = oTable
								.getContextByIndex(oTable.getSelectedIndex())
								.getObject();
							oBaseData.setProperty("/Parameters/Bank", BankName.Bank);
							let token = oEvent.getParameter("tokens")[0].getProperty("key");
							oBaseData.setProperty("/Parameters/Bankaccount", token);
							oBaseData.setProperty(
								"/Parameters/BankaccountName",
								BankName.BankAccountHolderName
							);
							oBaseData.setProperty(
								"/Parameters/BankCountry",
								BankName.BankCountry
							);
							oBaseData.setProperty(
								"/Parameters/BPBankAccountInternalID",
								BankName.BPBankAccountInternalID
							);
						}

						oValueHelpData.getProperty("/_oVHDialog/VHBankAccount").close();
						break;

					case "search":
						let oFilterBar = oValueHelpData
							.getProperty("/_oVHDialog/VHBankAccount")
							.getFilterBar();
						let sSearchQuery = oFilterBar.getBasicSearchValue();
						let aSelectionSet = oEvent.getParameter("selectionSet");

						let aFilters = aSelectionSet.reduce(function (aResult, oControl) {
							if (oControl.getValue()) {
								aResult.push(
									new Filter({
										path: oControl.getName(),
										operator: FilterOperator.Contains,
										value1: oControl.getValue(),
									})
								);
							}

							return aResult;
						}, []);

						aFilters.push(
							new Filter({
								filters: [
									new Filter({
										path: "Bank",
										operator: FilterOperator.Contains,
										value1: sSearchQuery.substr(0, 10),
									}),
									new Filter({
										path: "BankAccount",
										operator: FilterOperator.Contains,
										value1: sSearchQuery.substr(0, 20),
									}),
								],
								and: false,
							})
						);

						oValueHelpData
							.getProperty("/_oVHDialog/VHBankAccount")
							.getTableAsync()
							.then(
								function (oTable) {
									if (oTable.bindRows) {
										oTable.getBinding("rows").filter(
											new Filter({
												filters: aFilters,
												and: true,
											})
										);
									}
									if (oTable.bindItems) {
										oTable.getBinding("items").filter(
											new Filter({
												filters: aFilters,
												and: true,
											})
										);
									}
									oValueHelpData
										.getProperty("/_oVHDialog/VHBankAccount")
										.update();
								}.bind(this)
							);
						break;

					case "afterClose":
						break;
				}
			},

			onActionVHAccountRecon: function (oEvent) {
				let oBaseData = this.getView().getModel("BaseData");
				let oValueHelpData = this.getView().getModel("ValueHelpData");

				switch (oEvent.sId) {
					case "cancel":
						oValueHelpData.getProperty("/_oVHDialog/VHAccountRecon").close();
						break;

					case "ok":
						if (oEvent.getParameter("tokens")[0] !== undefined) {
							let oTable = oEvent.oSource.getTable();
							let token = oEvent.getParameter("tokens")[0].getProperty("key");
							oBaseData.setProperty("/Parameters/AccountRecon", token);
							oBaseData.setProperty(
								"/Parameters/AccountReconText",
								oTable.getContextByIndex(oTable.getSelectedIndex()).getObject()
									.GLAccountName
							);
						}
						oValueHelpData.getProperty("/_oVHDialog/VHAccountRecon").close();

						break;

					case "search":
						let oFilterBar = oValueHelpData
							.getProperty("/_oVHDialog/VHAccountRecon")
							.getFilterBar();
						let sSearchQuery = oFilterBar.getBasicSearchValue();
						let aSelectionSet = oEvent.getParameter("selectionSet");

						let aFilters = aSelectionSet.reduce(function (aResult, oControl) {
							if (oControl.getValue()) {
								aResult.push(
									new Filter({
										path: oControl.getName(),
										operator: FilterOperator.Contains,
										value1: oControl.getValue(),
									})
								);
							}

							return aResult;
						}, []);

						aFilters.push(
							new Filter({
								filters: [
									new Filter({
										path: "GLAccount",
										operator: FilterOperator.Contains,
										value1: sSearchQuery,
									}),
									new Filter({
										path: "GLAccountName",
										operator: FilterOperator.Contains,
										value1: sSearchQuery,
									}),
								],
								and: false,
							})
						);

						oValueHelpData
							.getProperty("/_oVHDialog/VHPaymentTerms")
							.getTableAsync()
							.then(
								function (oTable) {
									if (oTable.bindRows) {
										oTable.getBinding("rows").filter(
											new Filter({
												filters: aFilters,
												and: true,
											})
										);
									}
									if (oTable.bindItems) {
										oTable.getBinding("items").filter(
											new Filter({
												filters: aFilters,
												and: true,
											})
										);
									}
									oValueHelpData
										.getProperty("/_oVHDialog/VHPaymentTerms")
										.update();
								}.bind(this)
							);
						break;

					case "afterClose":
						break;
				}
			},
			onActionVHTaxcode: function (oEvent) {
				let oBaseData = this.getView().getModel("BaseData");
				let oValueHelpData = this.getView().getModel("ValueHelpData");

				switch (oEvent.sId) {
					case "cancel":
						oValueHelpData.getProperty("/_oVHDialog/VHTaxcode").close();
						break;

					case "ok":
						let oTable = oEvent.oSource.getTable();
						if (oEvent.getParameter("tokens")[0] !== undefined) {
							let token = oEvent.getParameter("tokens")[0].getProperty("key");
							oBaseData.setProperty("/Parameters/TaxCode", token);
							if (oTable.getContextByIndex(oTable.getSelectedIndex())) {
								let TaxCodeName = oTable
									.getContextByIndex(oTable.getSelectedIndex())
									.getObject();
								oBaseData.setProperty(
									"/Parameters/TaxPer",
									Number(TaxCodeName.CodeName.split("%")[0])
								);
								oBaseData.setProperty(
									"/Parameters/TaxCodeName",
									TaxCodeName.CodeName
								);
							} else {
								oBaseData.setProperty("/Parameters/TaxPer", 0);
								oBaseData.setProperty("/Parameters/TaxCodeName", "");
							}
							oBaseData.setProperty("/Parameters/VATAmount", 0);
							this.onCalculation();
						}
						oValueHelpData.getProperty("/_oVHDialog/VHTaxcode").close();
						break;

					case "search":
						let oFilterBar = oValueHelpData
							.getProperty("/_oVHDialog/VHTaxcode")
							.getFilterBar();
						let sSearchQuery = oFilterBar.getBasicSearchValue();
						let aSelectionSet = oEvent.getParameter("selectionSet");

						let aFilters = aSelectionSet.reduce(function (aResult, oControl) {
							if (oControl.getValue()) {
								aResult.push(
									new Filter({
										path: oControl.getName(),
										operator: FilterOperator.Contains,
										value1: oControl.getValue(),
									})
								);
							}

							return aResult;
						}, []);

						aFilters.push(
							new Filter({
								filters: [
									new Filter({
										path: "CodeId",
										operator: FilterOperator.Contains,
										value1: sSearchQuery.substr(0, 10),
									}),
									new Filter({
										path: "CodeName",
										operator: FilterOperator.Contains,
										value1: sSearchQuery.substr(0, 20),
									}),
								],
								and: false,
							})
						);

						oValueHelpData
							.getProperty("/_oVHDialog/VHTaxcode")
							.getTableAsync()
							.then(
								function (oTable) {
									if (oTable.bindRows) {
										oTable.getBinding("rows").filter(
											new Filter({
												filters: aFilters,
												and: true,
											})
										);
									}
									if (oTable.bindItems) {
										oTable.getBinding("items").filter(
											new Filter({
												filters: aFilters,
												and: true,
											})
										);
									}
									oValueHelpData.getProperty("/_oVHDialog/VHTaxcode").update();
								}.bind(this)
							);
						break;

					case "afterClose":
						break;
				}
			},

			onActionVHTBCostCenter: function (oEvent) {
				let oBaseData = this.getView().getModel("BaseData");
				let oValueHelpData = this.getView().getModel("ValueHelpData");

				switch (oEvent.sId) {
					case "cancel":
						oValueHelpData.getProperty("/_oVHDialog/VHTBCostCenter").close();
						break;

					case "ok":
						let oTable = oEvent.oSource.getTable();
						let oSelected = oEvent.getParameter("tokens")[0].getProperty("key");
						let sPath = oValueHelpData
							.getProperty("/v4SelectInput")
							.getParent()
							.getBindingContextPath();
						let oCostCenterName = oTable
							.getContextByIndex(oTable.getSelectedIndex())
							.getObject();

						oBaseData.setProperty(sPath + "/Costcenter", oSelected);
						oBaseData.setProperty(
							sPath + "/CostcenterName",
							oCostCenterName.CodeName
						);
						oValueHelpData.getProperty("/_oVHDialog/VHTBCostCenter").close();
						this._changeBalance(sPath);
						break;

					case "search":
						let oFilterBar = oValueHelpData
							.getProperty("/_oVHDialog/VHTBCostCenter")
							.getFilterBar();
						let sSearchQuery = oFilterBar.getBasicSearchValue();
						let aSelectionSet = oEvent.getParameter("selectionSet");

						let aFilters = aSelectionSet.reduce(function (aResult, oControl) {
							if (oControl.getValue()) {
								aResult.push(
									new Filter({
										path: oControl.getName(),
										operator: FilterOperator.Contains,
										value1: oControl.getValue(),
									})
								);
							}

							return aResult;
						}, []);

						aFilters.push(
							new Filter({
								filters: [
									new Filter({
										path: "CodeId",
										operator: FilterOperator.Contains,
										value1: sSearchQuery.substr(0, 10),
									}),
									new Filter({
										path: "CodeName",
										operator: FilterOperator.Contains,
										value1: sSearchQuery.substr(0, 20),
									}),
								],
								and: false,
							})
						);

						oValueHelpData
							.getProperty("/_oVHDialog/VHTBCostCenter")
							.getTableAsync()
							.then(
								function (oTable) {
									if (oTable.bindRows) {
										oTable.getBinding("rows").filter(
											new Filter({
												filters: aFilters,
												and: true,
											})
										);
									}
									if (oTable.bindItems) {
										oTable.getBinding("items").filter(
											new Filter({
												filters: aFilters,
												and: true,
											})
										);
									}
									oValueHelpData
										.getProperty("/_oVHDialog/VHTBCostCenter")
										.update();
								}.bind(this)
							);
						break;

					case "afterClose":
						oValueHelpData.getProperty("/_oVHDialog/VHTBCostCenter").destroy();
						break;
				}
			},

			onActionVHTBAccount: function (oEvent) {
				let oBaseData = this.getView().getModel("BaseData");
				let oValueHelpData = this.getView().getModel("ValueHelpData");

				switch (oEvent.sId) {
					case "cancel":
						oValueHelpData.getProperty("/_oVHDialog/VHTBGLAccount").close();
						break;

					case "ok":
						let oTable = oEvent.oSource.getTable();
						let oSelected = oEvent.getParameter("tokens")[0].getProperty("key");
						let sPath = oValueHelpData
							.getProperty("/v4SelectInput")
							.getParent()
							.getBindingContextPath();
						let AccountName = oTable
							.getContextByIndex(oTable.getSelectedIndex())
							.getObject();
						oBaseData.setProperty(sPath + "/GLAccount", oSelected);
						oBaseData.setProperty(
							sPath + "/GLAccountName",
							AccountName.CodeName
						);
						let oModel = this.getView().getModel();
						let oParamData = oBaseData.getProperty("/Parameters");
						let sUrl = `/sap/opu/odata4/sap/zfi_c_other_receipt_ui_v4/srvd/sap/zfi_c_other_receipt_ui/0001/I_GLAccount?$filter=CompanyCode%20eq%20%27${
							oParamData.CompanyCode
						}%27%20and%20GLAccount%20eq%20%27${
							"0".repeat(10 - oSelected.length) + oSelected
						}%27`;

						const headers = {
							"X-Csrf-Token": oModel.getHttpHeaders()["X-CSRF-Token"],
						};

						axios
							.get(sUrl, { headers: headers })
							.then(
								function (oResult) {
									if (oResult.data.value.length === 1) {
										let oData = oResult.data.value[0];
										if (oData.GLAccountType === "P") {
											if (oSelected.slice(0, 2) === "41") {
												oBaseData.setProperty(`${sPath}/Costcenter`, "");
												oBaseData.setProperty(`${sPath}/CostcenterName`, "");
												oBaseData.setProperty(
													`${sPath}/CostcenterEnable`,
													false
												);
												oBaseData.setProperty(
													`${sPath}/profitcenterEnable`,
													true
												);
												oBaseData.setProperty(
													`${sPath}/profitcenter`,
													oBaseData.getProperty("/profitcenter")
												);
												oBaseData.setProperty(
													`${sPath}/profitcenterName`,
													oBaseData.getProperty("/profitcentername")
												);
												oBaseData.setProperty(`${sPath}/balanceCheck`, false);
												oBaseData.setProperty(`${sPath}/balanceEnable`, false);
												oBaseData.setProperty(`${sPath}/balance`, 0);
												oBaseData.setProperty(
													`${sPath}/balanceCurrency`,
													"KRW"
												);
											} else {
												oBaseData.setProperty(
													`${sPath}/CostcenterEnable`,
													true
												);
												oBaseData.setProperty(
													`${sPath}/profitcenterEnable`,
													false
												);
												oBaseData.setProperty(`${sPath}/profitcenter`, "");
												oBaseData.setProperty(`${sPath}/profitcenterName`, "");

												oBaseData.setProperty(`${sPath}/balanceCheck`, true);

												if (oParamData.Amount > 0) {
													oBaseData.setProperty(`${sPath}/balanceEnable`, true);
													this._changeBalance(sPath);
												} else {
													oBaseData.setProperty(
														`${sPath}/balanceEnable`,
														false
													);
													oBaseData.setProperty(`${sPath}/balance`, 0);
													oBaseData.setProperty(
														`${sPath}/balanceCurrency`,
														"KRW"
													);
												}
											}
										} else {
											oBaseData.setProperty(`${sPath}/Costcenter`, "");
											oBaseData.setProperty(`${sPath}/CostcenterName`, "");
											oBaseData.setProperty(`${sPath}/CostcenterEnable`, false);
											oBaseData.setProperty(
												`${sPath}/profitcenterEnable`,
												false
											);
											oBaseData.setProperty(`${sPath}/profitcenter`, "");
											oBaseData.setProperty(`${sPath}/profitcenterName`, "");
											oBaseData.setProperty(`${sPath}/balanceCheck`, false);
											oBaseData.setProperty(`${sPath}/balanceEnable`, false);
											oBaseData.setProperty(`${sPath}/balance`, 0);
											oBaseData.setProperty(`${sPath}/balanceCurrency`, "KRW");
										}
									} else {
										oBaseData.setProperty(`${sPath}/Costcenter`, "");
										oBaseData.setProperty(`${sPath}/CostcenterName`, "");
										oBaseData.setProperty(`${sPath}/CostcenterEnable`, false);
										oBaseData.setProperty(`${sPath}/profitcenterEnable`, false);
										oBaseData.setProperty(`${sPath}/profitcenter`, "");
										oBaseData.setProperty(`${sPath}/profitcenterName`, "");
										oBaseData.setProperty(`${sPath}/balanceCheck`, false);
										oBaseData.setProperty(`${sPath}/balanceEnable`, false);
										oBaseData.setProperty(`${sPath}/balance`, 0);
										oBaseData.setProperty(`${sPath}/balanceCurrency`, "KRW");
									}
									this._changeBalance(sPath);
								}.bind(this)
							)
							.catch(
								function (error) {
									oBaseData.setProperty(`${sPath}/Costcenter`, "");
									oBaseData.setProperty(`${sPath}/CostcenterName`, "");
									oBaseData.setProperty(`${sPath}/CostcenterEnable`, false);
									oBaseData.setProperty(`${sPath}/profitcenterEnable`, false);
									oBaseData.setProperty(`${sPath}/profitcenter`, "");
									oBaseData.setProperty(`${sPath}/profitcenterName`, "");
									oBaseData.setProperty(`${sPath}/balanceCheck`, false);
									oBaseData.setProperty(`${sPath}/balanceEnable`, false);
									oBaseData.setProperty(`${sPath}/balance`, 0);
									this._changeBalance(sPath);
								}.bind(this)
							);
						oValueHelpData.getProperty("/_oVHDialog/VHTBGLAccount").close();
						break;

					case "search":
						let oFilterBar = oValueHelpData
							.getProperty("/_oVHDialog/VHTBGLAccount")
							.getFilterBar();
						let sSearchQuery = oFilterBar.getBasicSearchValue();
						let aSelectionSet = oEvent.getParameter("selectionSet");

						let aFilters = aSelectionSet.reduce(function (aResult, oControl) {
							if (oControl.getValue()) {
								aResult.push(
									new Filter({
										path: oControl.getName(),
										operator: FilterOperator.Contains,
										value1: oControl.getValue(),
									})
								);
							}

							return aResult;
						}, []);

						aFilters.push(
							new Filter({
								filters: [
									new Filter({
										path: "CodeId",
										operator: FilterOperator.Contains,
										value1: sSearchQuery.substr(0, 10),
									}),
									new Filter({
										path: "CodeName",
										operator: FilterOperator.Contains,
										value1: sSearchQuery.substr(0, 20),
									}),
								],
								and: false,
							})
						);

						oValueHelpData
							.getProperty("/_oVHDialog/VHTBGLAccount")
							.getTableAsync()
							.then(
								function (oTable) {
									if (oTable.bindRows) {
										oTable.getBinding("rows").filter(
											new Filter({
												filters: aFilters,
												and: true,
											})
										);
									}
									if (oTable.bindItems) {
										oTable.getBinding("items").filter(
											new Filter({
												filters: aFilters,
												and: true,
											})
										);
									}
									oValueHelpData
										.getProperty("/_oVHDialog/VHTBGLAccount")
										.update();
								}.bind(this)
							);
						break;

					case "afterClose":
						oValueHelpData.getProperty("/_oVHDialog/VHTBGLAccount").destroy();
						break;
				}
			},

			onActionVHTBCurrency: function (oEvent) {
				let oBaseData = this.getView().getModel("BaseData");
				let oValueHelpData = this.getView().getModel("ValueHelpData");

				switch (oEvent.sId) {
					case "cancel":
						oValueHelpData.getProperty("/_oVHDialog/VHTBCurrency").close();

						break;
					case "ok":
						let oTable = oEvent.oSource.getTable();
						let oSelected = oEvent.getParameter("tokens")[0].getProperty("key");
						let sPath = oValueHelpData
							.getProperty("/v4SelectInput")
							.getParent()
							.getBindingContextPath();
						let AccountName = oTable
							.getContextByIndex(oTable.getSelectedIndex())
							.getObject();
						oBaseData.setProperty(sPath + "/Currency", oSelected);
						oValueHelpData.getProperty("/_oVHDialog/VHTBCurrency").close();

						break;
					case "search":
						let oFilterBar = oValueHelpData
							.getProperty("/_oVHDialog/VHTBCurrency")
							.getFilterBar();
						let sSearchQuery = oFilterBar.getBasicSearchValue();
						let aSelectionSet = oEvent.getParameter("selectionSet");

						let aFilters = aSelectionSet.reduce(function (aResult, oControl) {
							if (oControl.getValue()) {
								aResult.push(
									new Filter({
										path: oControl.getName(),
										operator: FilterOperator.Contains,
										value1: oControl.getValue(),
									})
								);
							}

							return aResult;
						}, []);

						aFilters.push(
							new Filter({
								filters: [
									new Filter({
										path: "Currency",
										operator: FilterOperator.Contains,
										value1: sSearchQuery.substr(0, 10),
									}),
									new Filter({
										path: "CurrencyName",
										operator: FilterOperator.Contains,
										value1: sSearchQuery.substr(0, 20),
									}),
								],
								and: false,
							})
						);

						oValueHelpData
							.getProperty("/_oVHDialog/VHTBCurrency")
							.getTableAsync()
							.then(
								function (oTable) {
									if (oTable.bindRows) {
										oTable.getBinding("rows").filter(
											new Filter({
												filters: aFilters,
												and: true,
											})
										);
									}
									if (oTable.bindItems) {
										oTable.getBinding("items").filter(
											new Filter({
												filters: aFilters,
												and: true,
											})
										);
									}
									oValueHelpData
										.getProperty("/_oVHDialog/VHTBCurrency")
										.update();
								}.bind(this)
							);
						break;
					case "afterClose":
						break;
				}
			},

			onActionVHTBTaxcode: function (oEvent) {
				let oBaseData = this.getView().getModel("BaseData");
				let oValueHelpData = this.getView().getModel("ValueHelpData");

				switch (oEvent.sId) {
					case "cancel":
						oValueHelpData.getProperty("/_oVHDialog/VHTBTaxCode").close();

						break;
					case "ok":
						let oTable = oEvent.oSource.getTable();
						let oSelected = oEvent.getParameter("tokens")[0].getProperty("key");
						let sPath = oValueHelpData
							.getProperty("/v4SelectInput")
							.getParent()
							.getBindingContextPath();
						let AccountName = oTable
							.getContextByIndex(oTable.getSelectedIndex())
							.getObject();
						oBaseData.setProperty(sPath + "/AmountTax", oSelected);
						oValueHelpData.getProperty("/_oVHDialog/VHTBTaxCode").close();

						break;
					case "search":
						let oFilterBar = oValueHelpData
							.getProperty("/_oVHDialog/VHTBTaxCode")
							.getFilterBar();
						let sSearchQuery = oFilterBar.getBasicSearchValue();
						let aSelectionSet = oEvent.getParameter("selectionSet");

						let aFilters = aSelectionSet.reduce(function (aResult, oControl) {
							if (oControl.getValue()) {
								aResult.push(
									new Filter({
										path: oControl.getName(),
										operator: FilterOperator.Contains,
										value1: oControl.getValue(),
									})
								);
							}

							return aResult;
						}, []);

						aFilters.push(
							new Filter({
								filters: [
									new Filter({
										path: "CodeId",
										operator: FilterOperator.Contains,
										value1: sSearchQuery.substr(0, 10),
									}),
									new Filter({
										path: "CodeName",
										operator: FilterOperator.Contains,
										value1: sSearchQuery.substr(0, 20),
									}),
								],
								and: false,
							})
						);

						oValueHelpData
							.getProperty("/_oVHDialog/VHTBTaxCode")
							.getTableAsync()
							.then(
								function (oTable) {
									if (oTable.bindRows) {
										oTable.getBinding("rows").filter(
											new Filter({
												filters: aFilters,
												and: true,
											})
										);
									}
									if (oTable.bindItems) {
										oTable.getBinding("items").filter(
											new Filter({
												filters: aFilters,
												and: true,
											})
										);
									}
									oValueHelpData
										.getProperty("/_oVHDialog/VHTBTaxCode")
										.update();
								}.bind(this)
							);
						break;
					case "afterClose":
						break;
				}
			},

			onChangeDebitCreditCode: function (oEvent) {
				this.onCalculation();
			},

			onChangePostingDate: function (oEvent) {
				let oModel = this.getView().getModel();
				let oBaseData = this.getView().getModel("BaseData");
				let vPostingDate = oBaseData.getProperty("/Parameters/PostingDate");
				if (!vPostingDate || vPostingDate == "") {
					oBaseData.setProperty("/Parameters/Paymentscheduled", "");
				} else {
					oBaseData.setProperty(
						"/Parameters/FiscalYear",
						oEvent.getParameter("newValue").substr(0, 4)
					);
					this.onCalculationPaymentscheduled();
				}

				let sUrl = `/sap/opu/odata4/sap/zfi_c_other_receipt_ui_v4/srvd/sap/zfi_c_other_receipt_ui/0001/ZFI_C_EXCHANGERATE(iDate=${vPostingDate})/Set?$expand=_Rate`;

				const headers = {
					"X-Csrf-Token": oModel.getHttpHeaders()["X-CSRF-Token"],
				};

				axios
					.get(sUrl, { headers: headers })
					.then(
						function (oResult) {
							oBaseData.setProperty("/ExchangeRates", oResult.data.value);
							let vCurrency = oBaseData.getProperty("/Parameters/Currency");
							if (vCurrency === "KRW") {
								oBaseData.setProperty("/ExchangeRate", 1);
								oBaseData.setProperty("/ValidityStartDate", "");
								oBaseData.setProperty("/NumberOfSourceCurrencyUnits", 100);
								oBaseData.setProperty("/Parameters/CurrencyState", "None");
								oBaseData.setProperty("/Parameters/CurrencyStateText", "");
							} else if (oResult.data.value.length > 0) {
								let oNowRate = oResult.data.value.find(
									(e) => e.SourceCurrency == vCurrency
								);
								oBaseData.setProperty(
									"/ExchangeRate",
									oNowRate._Rate.CalExchange
								);
								// oBaseData.setProperty('/ExchangeRate', oNowRate._Rate.ExchangeRate * 100)
								oBaseData.setProperty(
									"/ValidityStartDate",
									oNowRate._Rate.ValidityStartDate
								);
								oBaseData.setProperty(
									"/NumberOfSourceCurrencyUnits",
									oNowRate._Rate.NumberOfSourceCurrencyUnits
								);
								oBaseData.setProperty("/Parameters/CurrencyState", "None");
								oBaseData.setProperty("/Parameters/CurrencyStateText", "");
							} else {
								oBaseData.setProperty("/ExchangeRate", 0);
								oBaseData.setProperty("/ValidityStartDate", "");
								oBaseData.setProperty("/NumberOfSourceCurrencyUnits", 0);
								oBaseData.setProperty("/Parameters/CurrencyState", "Error");
								oBaseData.setProperty(
									"/Parameters/CurrencyStateText",
									"환율 데이터가 존재하지 않습니다."
								);
							}
							let aDetailItems = oBaseData.getProperty("/Items");
							aDetailItems.forEach((element, idx) => {
								if (idx === 0) return;
								let sPath = `/Items/${idx}`;
								if (oBaseData.getProperty(`${sPath}/balanceEnable`)) {
									this._changeBalance(sPath);
								}
							});
						}.bind(this)
					)
					.catch(
						function (error) {
							oBaseData.setProperty("/ExchangeRate", 0);
							oBaseData.setProperty("/ValidityStartDate", "");
							oBaseData.setProperty("/NumberOfSourceCurrencyUnits", 0);
							oBaseData.setProperty("/Parameters/CurrencyState", "Error");
							oBaseData.setProperty(
								"/Parameters/CurrencyStateText",
								"환율 데이터가 존재하지 않습니다."
							);
							let aDetailItems = oBaseData.getProperty("/Items");
							aDetailItems.forEach((element, idx) => {
								if (idx === 0) return;
								let sPath = `/Items/${idx}`;
								if (oBaseData.getProperty(`${sPath}/balanceEnable`)) {
									this._changeBalance(sPath);
								}
							});
						}.bind(this)
					);
			},

			onChangeAmount: function (oEvent) {
				this.onCalculation();
			},

			onCalculation: function (oEvent) {
				let oBaseData = this.getView().getModel("BaseData");
				let oBaseDataData = oBaseData.getData();
				let isCount = 0;
				let DebitSum = 0;
				let CreditSum = 0;
				let vTaxPer = oBaseData.getProperty("/Parameters/TaxPer");
				let vTaxCode = oBaseData.getProperty("/Parameters/TaxCode");
				for (let i = 0; i < oBaseDataData.Items.length; i++) {
					//D 차변 (Debit), C 대변 (Credit)
					if (oBaseDataData.Items[i].DebitCreditCode == "S") {
						DebitSum += oBaseDataData.Items[i].Amount;
					} else if (oBaseDataData.Items[i].DebitCreditCode == "H") {
						CreditSum += oBaseDataData.Items[i].Amount;
					}
				}

				let AmountTotal, VATAmount;
				let HeaderCode = oBaseDataData.Items[0].DebitCreditCode;
				let VATParam;
				if (HeaderCode === "S") {
					if (oBaseDataData.Parameters.VATAmount === 0 && vTaxCode !== "") {
						VATAmount = Math.round((DebitSum * vTaxPer) / (100 + vTaxPer));
					} else {
						VATAmount = oBaseDataData.Parameters.VATAmount;
					}
					if (oBaseDataData.Parameters.TaxCode.slice(0, 1) === "9") {
						VATParam = 0;
					} else {
						VATParam = VATAmount;
					}
					oBaseData.setProperty(
						"/Parameters/AmountTotal",
						DebitSum - VATParam - CreditSum
					);
					oBaseData.setProperty("/Parameters/VATAmount", VATAmount);
					oBaseData.setProperty("/Parameters/VATParam", VATParam);
				} else {
					if (oBaseDataData.Parameters.VATAmount === 0 && vTaxCode !== "") {
						VATAmount = Math.round((CreditSum * vTaxPer) / (100 + vTaxPer));
					} else {
						VATAmount = oBaseDataData.Parameters.VATAmount;
					}
					if (oBaseDataData.Parameters.TaxCode.slice(0, 1) === "9") {
						VATParam = 0;
					} else {
						VATParam = VATAmount;
					}
					oBaseData.setProperty(
						"/Parameters/AmountTotal",
						CreditSum - VATParam - DebitSum
					);
					oBaseData.setProperty("/Parameters/VATAmount", VATAmount);
					oBaseData.setProperty("/Parameters/VATParam", VATParam);
				}
				oBaseData.setProperty("/Parameters/DebitTotal", DebitSum);
				oBaseData.setProperty("/Parameters/CreditTotal", CreditSum);
				// oBaseData.setProperty('/Parameters/AmountTotal', DebitSum - CreditSum);
			},

			//유효성 검사
			onValidation: function () {
				let oModel = this.getView().getModel();
				let oBaseData = this.getView().getModel("BaseData");
				let oBaseDataData = oBaseData.getData();
				let isTrue = true;
				let isCount = 0;

				if (
					!oBaseDataData.Parameters.PostingDate ||
					oBaseDataData.Parameters.PostingDate == ""
				) {
					isTrue = false;
					oBaseData.setProperty("/Parameters/PostingDateState", "Error");
				} else {
					oBaseData.setProperty("/Parameters/PostingDateState", "None");
				}
				if (
					!oBaseDataData.Parameters.Amount ||
					oBaseDataData.Parameters.Amount == ""
				) {
					isTrue = false;
					oBaseData.setProperty("/Parameters/AmountState", "Error");
				} else {
					oBaseData.setProperty("/Parameters/AmountState", "None");
				}
				if (
					!oBaseDataData.Parameters.Currency ||
					oBaseDataData.Parameters.Currency == ""
				) {
					isTrue = false;
					oBaseData.setProperty("/Parameters/CurrencyState", "Error");
				} else {
					oBaseData.setProperty("/Parameters/CurrencyState", "None");
				}
				if (
					!oBaseDataData.Parameters.PaymentTerms ||
					oBaseDataData.Parameters.PaymentTerms == ""
				) {
					isTrue = false;
					oBaseData.setProperty("/Parameters/PaymentTermsState", "Error");
				} else {
					oBaseData.setProperty("/Parameters/PaymentTermsState", "None");
				}
				if (
					!oBaseDataData.Parameters.PaymentMethod ||
					oBaseDataData.Parameters.PaymentMethod == ""
				) {
					isTrue = false;
					oBaseData.setProperty("/Parameters/PaymentMethodState", "Error");
				} else {
					oBaseData.setProperty("/Parameters/PaymentMethodState", "None");
				}
				if (
					!oBaseDataData.Parameters.Supplier ||
					oBaseDataData.Parameters.Supplier == ""
				) {
					isTrue = false;
					oBaseData.setProperty("/Parameters/SupplierState", "Error");
				} else {
					oBaseData.setProperty("/Parameters/SupplierState", "None");
				}
				// if(!oBaseDataData.Parameters.DocumentItemText || oBaseDataData.Parameters.DocumentItemText == '')
				// {
				//     isTrue = false;
				//     oBaseData.setProperty('/Parameters/DocumentItemTextState', 'Error');
				// }
				// else{
				//     oBaseData.setProperty('/Parameters/DocumentItemTextState', 'None');
				// }
				if (
					!oBaseDataData.Parameters.DocumentDate ||
					oBaseDataData.Parameters.DocumentDate == ""
				) {
					isTrue = false;
					oBaseData.setProperty("/Parameters/DocumentDateState", "Error");
				} else {
					oBaseData.setProperty("/Parameters/DocumentDateState", "None");
				}
				// if(!oBaseDataData.Parameters.Costcenter || oBaseDataData.Parameters.Costcenter == '')
				// {
				//     isTrue = false;
				//     oBaseData.setProperty('/Parameters/CostcenterState', 'Error');
				// }
				// else{
				//     oBaseData.setProperty('/Parameters/CostcenterState', 'None');
				// }
				// if(!oBaseDataData.Parameters.Bank || oBaseDataData.Parameters.Bank == '')
				// {
				//     isTrue = false;
				//     oBaseData.setProperty('/Parameters/BankState', 'Error');
				// }
				// else{
				//     oBaseData.setProperty('/Parameters/BankState', 'None');
				// }

				if (
					oBaseDataData.Parameters.PaymentMethod === "T" &&
					(!oBaseDataData.Parameters.Bankaccount ||
						oBaseDataData.Parameters.Bankaccount == "")
				) {
					isTrue = false;
					oBaseData.setProperty("/Parameters/BankaccountState", "Error");
				} else {
					oBaseData.setProperty("/Parameters/BankaccountState", "None");
				}

				if (
					!oBaseDataData.Parameters.DocumentItemText ||
					oBaseDataData.Parameters.DocumentItemText == ""
				) {
					isTrue = false;
					oBaseData.setProperty("/Parameters/DocumentItemTextState", "Error");
				} else {
					oBaseData.setProperty("/Parameters/DocumentItemTextState", "None");
				}
				if (
					!oBaseDataData.Parameters.DocumentReferenceID ||
					oBaseDataData.Parameters.DocumentReferenceID == ""
				) {
					isTrue = false;
					oBaseData.setProperty(
						"/Parameters/DocumentReferenceIDState",
						"Error"
					);
				} else {
					oBaseData.setProperty("/Parameters/DocumentReferenceIDState", "None");
				}

				let oBudget = {};
				let vBudgetCheck = true;
				if (oBaseDataData.ExchangeRate === 0) {
					vBudgetCheck = false;
				} else {
				}
				let vBudgetRslt = true;
				let vNowKey;

				for (let i = 1; i < oBaseDataData.Items.length; i++) {
					if (
						!oBaseDataData.Items[i].DebitCreditCode ||
						oBaseDataData.Items[i].DebitCreditCode == ""
					) {
						isTrue = false;
						oBaseData.setProperty(
							"/Items/" + i + "/DebitCreditCodeState",
							"Error"
						);
					} else {
						oBaseData.setProperty(
							"/Items/" + i + "/DebitCreditCodeState",
							"None"
						);
					}
					if (
						oBaseDataData.Items[i].CostcenterEnable &&
						(!oBaseDataData.Items[i].Costcenter ||
							oBaseDataData.Items[i].Costcenter == "")
					) {
						isTrue = false;
						oBaseData.setProperty("/Items/" + i + "/CostcenterState", "Error");
					} else {
						oBaseData.setProperty("/Items/" + i + "/CostcenterState", "None");
					}
					if (
						!oBaseDataData.Items[i].GLAccount ||
						oBaseDataData.Items[i].GLAccount == ""
					) {
						isTrue = false;
						oBaseData.setProperty("/Items/" + i + "/GLAccountState", "Error");
					} else {
						oBaseData.setProperty("/Items/" + i + "/GLAccountState", "None");
					}

					// 금액 Empty Check
					if (
						!oBaseDataData.Items[i].Amount ||
						oBaseDataData.Items[i].Amount == ""
					) {
						isTrue = false;
						oBaseData.setProperty("/Items/" + i + "/AmountState", "Error");
					} else {
						oBaseData.setProperty("/Items/" + i + "/AmountState", "None");
					}

					// 예산 check data
					if (
						vBudgetCheck &&
						oBaseDataData.Items[i].Costcenter &&
						oBaseDataData.Items[i].GLAccount &&
						oBaseDataData.Items[i].AmountState != "Error" &&
						oBaseDataData.Items[i].balanceEnable
					) {
						vNowKey = `${oBaseDataData.Items[i].Costcenter}|${oBaseDataData.Items[i].GLAccount}`;
						if (!(vNowKey in oBudget)) {
							oBudget[vNowKey] = {
								Validation: true,
								Amount: 0,
								Balance: Number(oBaseDataData.Items[i].balance),
							};
							// oBudget[vNowKey]['Validation'] = true;
							// oBudget[vNowKey]['Amount'] = 0;
							// oBudget[vNowKey]['Balance'] = Number(oBaseDataData.Items[i].balance);
						}
						oBudget[vNowKey].Amount += Number(oBaseDataData.Items[i].Amount);
						if (oBudget[vNowKey].Balance < oBudget[vNowKey].Amount) {
							oBudget[vNowKey].Validation = false;
							vBudgetRslt = false;
							isTrue = false;
						}
					}

					// 2023/12/06 CJH 수정 _ 적요
					if (
						!oBaseDataData.Items[i].DocumentItemText ||
						oBaseDataData.Items[i].DocumentItemText == ""
					) {
						isTrue = false;
						oBaseData.setProperty(
							"/Items/" + i + "/DocumentItemTextState",
							"Error"
						);
					} else {
						oBaseData.setProperty(
							"/Items/" + i + "/DocumentItemTextState",
							"None"
						);
					}
					// if(!oBaseDataData.Items[i].Currency || oBaseDataData.Items[i].Currency == '')
					// {
					//     isTrue = false;
					//     oBaseData.setProperty('/Items/'+i+'/CurrencyState', 'Error');
					// }
					// else {
					//     oBaseData.setProperty('/Items/'+i+'/CurrencyState', 'None');
					// }
					// if(!oBaseDataData.Items[i].AmountTax || oBaseDataData.Items[i].AmountTax == '')
					// {
					//     isTrue = false;
					//     oBaseData.setProperty('/Items/'+i+'/AmountTaxState', 'Error');
					// }
					// else {
					//     oBaseData.setProperty('/Items/'+i+'/AmountTaxState', 'None');
					// }
				}

				// 예산잔액 체크
				if (!vBudgetRslt) {
					for (let i = 1; i < oBaseDataData.Items.length; i++) {
						if (
							oBaseDataData.Items[i].Costcenter &&
							oBaseDataData.Items[i].GLAccount &&
							oBaseDataData.Items[i].AmountState != "Error"
						) {
							vNowKey = `${oBaseDataData.Items[i].Costcenter}|${oBaseDataData.Items[i].GLAccount}`;
							if (!oBudget[vNowKey].Validation) {
								oBaseData.setProperty("/Items/" + i + "/AmountState", "Error");
								oBaseData.setProperty(
									"/Items/" + i + "/AmountStateText",
									Model.I18n.getProperty("Error011")
								);
							} else {
								oBaseData.setProperty("/Items/" + i + "/AmountState", "None");
								oBaseData.setProperty("/Items/" + i + "/AmountStateText", "");
							}
						}
					}
				}
				// 2023/12/06 CJH 수정 _ 적요
				// if (!oBaseDataData.Items[0].DocumentItemText || oBaseDataData.Items[0].DocumentItemText == '') {
				//     isTrue = false;
				//     oBaseData.setProperty('/Items/0/DocumentItemTextState', 'Error');
				// }
				// else {
				//     oBaseData.setProperty('/Items/0/DocumentItemTextState', 'None');
				// }

				if (oBaseDataData.Parameters.AmountTotal !== 0) {
					isTrue = false;
					MessageBox.error(Model.I18n.getProperty("Error010"));
				}

				return isTrue;
			},

			onChangeHeaderAmount: function (oEvent) {
				let oBaseData = this.getView().getModel("BaseData");
				let oBaseDataData = oBaseData.getData();
				oBaseData.setProperty(
					"/Items/0/Amount",
					Math.abs(Number(oBaseDataData.Parameters.Amount))
				);
				for (let i = 0; i < oBaseDataData.Items.length; i++) {
					if (i == 0) {
						if (
							Number(oEvent.getParameter("newValue").replace(/,/g, "")) >= 0
						) {
							oBaseData.setProperty("/Items/0/DebitCreditCode", "H");
						} else {
							oBaseData.setProperty("/Items/0/DebitCreditCode", "S");
						}
					} else {
						if (
							Number(oEvent.getParameter("newValue").replace(/,/g, "")) >= 0
						) {
							oBaseData.setProperty("/Items/" + i + "/DebitCreditCode", "S");
						} else {
							oBaseData.setProperty("/Items/" + i + "/DebitCreditCode", "H");
						}
					}
				}

				let aDetailItems = oBaseData.getProperty("/Items");

				if (Number(oBaseData.getProperty("/Parameters/Amount")) > 0) {
					aDetailItems.forEach((element, idx) => {
						if (idx === 0) return;
						let sPath = `/Items/${idx}`;
						if (element.balanceCheck) {
							oBaseData.setProperty(`${sPath}/balanceEnable`, true);
							this._changeBalance(sPath);
						}
					});
				} else {
					aDetailItems.forEach((element, idx) => {
						if (idx === 0) return;
						let sPath = `/Items/${idx}`;
						oBaseData.setProperty(`${sPath}/balanceEnable`, false);
						oBaseData.setProperty(`${sPath}/balance`, 0);
						oBaseData.setProperty(`${sPath}/balanceCurrency`, "KRW");
					});
				}

				this.onTaxChange();
				this.onCalculation();
			},

			onChangeHeaderVATAmount: function (oEvent) {
				this.onCalculation();
			},

			onTaxChange: function (oEvent) {
				let oBaseData = this.getView().getModel("BaseData");
				let oTaxPercent = "";
				if (
					oBaseData.getProperty("/Parameters/TaxCode") === "" ||
					oBaseData.getProperty("/Parameters/TaxCode") === undefined
				) {
					oBaseData.setProperty("/Parameters/TaxPer", 0);
					oBaseData.setProperty("/Parameters/VATAmount", 0);
					oBaseData.setProperty("/Parameters/TaxCodeName", "");
					this.onCalculation();
				} else {
					let oParamData = oBaseData.getProperty("/Parameters");
					let oModel = this.oView.getModel();
					let sUrl = `/sap/opu/odata4/sap/zfi_c_other_receipt_ui_v4/srvd/sap/zfi_c_other_receipt_ui/0001/ZFI_V_TAXCODE_C_ETC?$filter=CodeId%20eq%20%27${oParamData.TaxCode}%27`;

					const headers = {
						"X-Csrf-Token": oModel.getHttpHeaders()["X-CSRF-Token"],
					};

					axios
						.get(sUrl, { headers: headers })
						.then(
							function (oResult) {
								if (oResult.data.value.length === 1) {
									oBaseData.setProperty(
										"/Parameters/TaxCodeName",
										oResult.data.value[0].CodeName
									);
									oBaseData.setProperty(
										"/Parameters/TaxPer",
										Number(oResult.data.value[0].CodeName.split("%")[0])
									);
								} else {
									oBaseData.setProperty("/Parameters/TaxCodeName", "");
									oBaseData.setProperty("/Parameters/TaxPer", 0);
								}
								oBaseData.setProperty("/Parameters/VATAmount", 0);
								this.onCalculation();
							}.bind(this)
						)
						.catch(
							function (error) {
								oBaseData.setProperty("/Parameters/TaxCodeName", "");
								oBaseData.setProperty("/Parameters/TaxPer", 0);
								oBaseData.setProperty("/Parameters/VATAmount", 0);
								this.onCalculation();
							}.bind(this)
						);
				}
				// oBaseData
			},

			onChangeAccountRecon: function (oEvent) {
				let oBaseData = this.getView().getModel("BaseData");
				let oParamData = oBaseData.getProperty("/Parameters");
				let oModel = this.oView.getModel();
				let sUrl = `/sap/opu/odata4/sap/zfi_c_other_receipt_ui_v4/srvd/sap/zfi_c_other_receipt_ui/0001/ZFI_V_ACCOUNT_RECON?$filter=CompanyCode%20eq%20%27${
					oParamData.CompanyCode
				}%27%20and%20GLAccount%20eq%20%27${
					"0".repeat(10 - oParamData.AccountRecon.length) +
					oParamData.AccountRecon
				}%27`;

				const headers = {
					"X-Csrf-Token": oModel.getHttpHeaders()["X-CSRF-Token"],
				};

				axios
					.get(sUrl, { headers: headers })
					.then(
						function (oResult) {
							if (oResult.data.value.length === 1) {
								oBaseData.setProperty(
									"/Parameters/AccountReconText",
									oResult.data.value[0].GLAccountName
								);
							} else {
								oBaseData.setProperty("/Parameters/AccountReconText", "");
							}
						}.bind(this)
					)
					.catch(
						function (error) {
							oBaseData.setProperty("/Parameters/AccountReconText", "");
						}.bind(this)
					);
			},

			//결재상신
			onBtnPress: function (oEvent) {
				let oBaseData = this.getView().getModel("BaseData");
				let oBaseDataData = oBaseData.getData();

				oBaseData.setProperty("/Parameters/_Item", oBaseDataData.Items);
				oBaseData.setProperty("/Visible/Footer", false);
				oBaseData.setProperty("/ErrMsgs", []);
				if (!this.onValidation()) {
					MessageBox.error(Model.I18n.getProperty("Error020"));
				} else {
					BusyIndicator.show(0);
					MessageBox.confirm(Model.I18n.getProperty("Info0020"), {
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.YES) {
								//Item정리
								_.forEach(
									oBaseDataData.Parameters._Item,
									function (Items) {
										if (Items.DebitCreditCode == "S") {
											Items.AmountDebit = Items.Amount;
											Items.AmountCredit = 0;
										} else if (Items.DebitCreditCode == "H") {
											Items.AmountCredit = Items.Amount;
											Items.AmountDebit = 0;
										}

										delete Items.profitcenterName;
										delete Items.profitcenterEnable;
										delete Items.profitcenterState;
										delete Items.CostcenterEnable;
										delete Items.balanceCheck;
										delete Items.balanceEnable;
										delete Items.balanceCurrency;
										delete Items.DebitCreditCodeState;
										delete Items.CostcenterState;
										delete Items.CostcenterEnable;
										delete Items.GLAccountState;
										delete Items.AmountState;
										delete Items.CurrencyState;
										delete Items.AmountTaxState;
										delete Items.DocumentItemTextState;
										delete Items.Budgetbalance;
										delete Items.DebitCreditCodeEnable;
										delete Items.DebitCreditCodeEnable;
										delete Items.GLAccountEnable;
										delete Items.AmountEnable;
									}.bind(this)
								);
								// oBaseData.setProperty('/Parameters/_Item',oBaseDataData.Parameters._Item);

								//Post
								//X-Csrf-Token 가져오기
								// const headers = {
								//     'X-Csrf-Token' : 'n1QtnwQ9avmLHkRs6fzjXQ=='
								// };
								const headers = {
									"X-CSRF-TOKEN": this.oView.getModel().getHttpHeaders()[
										"X-CSRF-Token"
									],
								};
								//n1QtnwQ9avmLHkRs6fzjXQ==
								let aItem = [];
								oBaseDataData.Parameters._Item
									.filter(function (_, index) {
										return index !== 0;
									})
									.forEach((element) => {
										let oItem = {};
										oItem.DebitCreditCode = element.DebitCreditCode;
										oItem.Costcenter = element.Costcenter;
										oItem.CostcenterText = element.CostcenterName;
										oItem.GLAccount = element.GLAccount;
										oItem.AccountText = element.GLAccountName;
										oItem.Amount = element.Amount;
										oItem.AmountDebit = element.AmountDebit;
										oItem.AmountCredit = element.AmountCredit;
										oItem.AmountTax = element.AmountTax;
										oItem.Currency = element.Currency;
										oItem.DocumentItemText = element.DocumentItemText;
										oItem.Profitcenter = element.profitcenter;
										aItem.push(oItem);
									});
								axios
									.post(
										"/sap/opu/odata4/sap/zfi_c_other_receipt_ui_v4/srvd/sap/zfi_c_other_receipt_ui/0001/ZFI_C_DOC_APPROVAL/com.sap.gateway.srvd.zfi_c_other_receipt_ui.v0001.Posting",
										{
											AccountingDocument: "",
											RequestType: "E2",
											CompanyCode: oBaseDataData.Parameters.CompanyCode,
											FiscalYear: oBaseDataData.Parameters.FiscalYear,
											PostingDate: oBaseDataData.Parameters.PostingDate,
											Amount: oBaseDataData.Parameters.VATAmount,
											// Amount: oBaseDataData.Parameters.Amount,
											Currency: oBaseDataData.Parameters.Currency,
											PaymentTerms: oBaseDataData.Parameters.PaymentTerms,
											PaymentMethod: oBaseDataData.Parameters.PaymentMethod,
											DocumentItemText:
												oBaseDataData.Parameters.DocumentItemText,
											KeyCardPur: oBaseDataData.Parameters.KeyCardPur,
											TaxCode: oBaseDataData.Parameters.TaxCode,
											DocumentDate: oBaseDataData.Parameters.DocumentDate,
											paymentdate: oBaseDataData.Parameters.Paymentscheduled,
											Costcenter: "",
											Supplier: oBaseDataData.Parameters.Supplier,
											BankCountry: oBaseDataData.Parameters.BankCountry,
											Bank: oBaseDataData.Parameters.Bank,
											Bankaccount: oBaseDataData.Parameters.Bankaccount,
											AmountTotal: oBaseDataData.Parameters.Amount,
											// AmountTotal: oBaseDataData.Parameters.AmountTotal,
											BusinessPlace: oBaseDataData.Parameters.BusinessPlace,
											DocumentReferenceID:
												oBaseDataData.Parameters.DocumentReferenceID,
											TblKey: "",
											ReqID: "",
											Title: "",
											Content: "",
											AccountRecon: oBaseDataData.Parameters.AccountRecon,
											TaxcodeText: oBaseDataData.Parameters.TaxCodeName,
											DueCalculationBaseDate:
												oBaseDataData.Parameters.Paymentscheduled,
											BPBankAccountInternalID:
												oBaseDataData.Parameters.BPBankAccountInternalID,
											AccountReconText:
												oBaseDataData.Parameters.AccountReconText,
											ExchangeRate: oBaseDataData.ExchangeRate,
											URL: "",
											_Item: aItem,
										},
										{
											headers: headers,
											//n1QtnwQ9avmLHkRs6fzjXQ==
										}
									)
									.then(
										function (response) {
											BusyIndicator.hide();
											//console.log(response);
											if (response.data.value) {
												this.onOpenEDMS(response.data.value);
											}
											let oRouter = this.getOwnerComponent().getRouter();
											oRouter.navTo("ZFI_C_OTHER_RECEIPTList");
										}.bind(this)
									)
									.catch(
										function (error) {
											BusyIndicator.hide();
											// CustomExtention.showErrorMessage(error);
											let oBaseData = this.getView().getModel("BaseData");
											let aError = [];

											if (error.response.data.error.message) {
												aError.push({
													ErrMsg: error.response.data.error.message,
												});
											}

											if (
												error.response.data.error.details &&
												error.response.data.error.details.length > 0
											) {
												_.forEach(
													error.response.data.error.details,
													function (o) {
														aError.push({ ErrMsg: o.message });
													}
												);
											}

											oBaseData.setProperty("/Error", aError);

											if (!oBaseData.getProperty("/_oErrDialog")) {
												this.loadFragment({
													name: "fi.zfrfi0050.fs.view.f4.DialogError",
												}).then(
													function (oDialog) {
														oBaseData.setProperty("/_oErrDialog", oDialog);
														this.getView().addDependent(oDialog);
														oDialog.open();
													}.bind(this)
												);
											} else {
												oBaseData.getProperty("/_oErrDialog").open();
											}

											// let aError = [];
											// let oErrMsg = {};
											// let oErrRes = error.response.data.error,
											//     sInnerErr = oErrRes.message,
											//     aDetailErr = oErrRes.details
											// if (sInnerErr) {
											//     oErrMsg.ErrMsg = sInnerErr
											//     aError.push(oErrMsg);
											// }
											// if (aDetailErr) {
											//     aDetailErr.forEach(oErr => {
											//         oErrMsg = {};
											//         oErrMsg.ErrMsg = oErr.message;
											//         aError.push(oErrMsg);
											//     });
											// }
											// if (aError.length > 0) {
											//     oBaseData.setProperty('/Visible/Footer', true);
											//     oBaseData.setProperty('/ErrMsgs', aError);
											// }
										}.bind(this)
									);
							} else {
								BusyIndicator.hide();
							}
						}.bind(this),
					});
				}
			},

			//전자결재 기안창 호출
			onOpenEDMS: function (oResponseData) {
				var oFrm = document.workflowForm;
				var oWin = window.open(
					"",
					"popWorkflow",
					"location=no,status=no,toolbar=no,scrollbars=yes,width=1100,height=" +
						screen.height
				);
				let sUrl = oResponseData[0].URL;
				//전자결재 URL (개발/운영서버 분기처리)
				// if (sUrl === '') sUrl = "https://gwdev.sbckcloud.com/Interworking/Interworking.aspx";

				oFrm.SystemID.value = "erp"; //고정
				oFrm.WorkKind.value = "APPROVAL-03"; //결재타입-기타영수증
				oFrm.TblKey.value = oResponseData[0].TblKey; //문서번호 : 데이터 고유키 (ABAP에서 반환 됨)
				oFrm.ReqID.value = oResponseData[0].ReqID; //사용자 계정 (ABAP에서 반환 됨)
				oFrm.Title.value = oResponseData[0].Title; //제목 (ABAP 반환 OR 고정)
				oFrm.Content.value = oResponseData[0].Content; //HTML 내용 (ABAP에서 반환 됨)
				oFrm.action = sUrl; //전자결재 URL (개발/운영서버 URL다름 분기처리 필요, ABAP반환 필요할 듯)
				oFrm.target = "popWorkflow";
				oFrm.method = "post";
				oFrm.submit();
			},

			onMessagePopoverPress: function (oEvent) {
				let oSourceControl = oEvent.getSource();
				let oView = this.getView();
				let oErrBtn = oEvent.getSource();
				let oBaseData = this.getView().getModel("BaseData");
				if (!oBaseData.getProperty("/_oErrDialog")) {
					this.loadFragment({
						name: "fi.zfrfi0050.fs.view.f4.ErrMsgPopover",
					}).then(
						function (oDialog) {
							oBaseData.setProperty("/_oErrDialog", oDialog);
							oView.addDependent(oDialog);
							oDialog.openBy(oErrBtn);
						}.bind(this)
					);
				} else {
					oBaseData.getProperty("/_oErrDialog").openBy(oErrBtn);
				}
			},

			onCancelDialog: function (oEvent) {
				let oBaseData = this.getView().getModel("BaseData");
				oBaseData.getProperty("/_oErrDialog").close();
			},

			_changeBalance: function (sPath) {
				// let oBaseDataModel = this.oView.getModel("BaseData");
				// let oParamData = oBaseDataModel.getProperty('/Parameters')
				// let oDetailLine = oBaseDataModel.getProperty(sPath);
				// let oModel = this.oView.getModel();
				// let sUrl = `/ZFI_C_PLAN_COST_SUMMARY?$filter=CompanyCode%20eq%20%27${oParamData.CompanyCode}%27%20and%20FiscalYear%20eq%20%27${oParamData.InputData.slice(0,4)}%27%20and%20CostCenter%20eq%20%27${'0'.repeat(10-oDetailLine.Costcenter.length) + oDetailLine.Costcenter}%27%20and%20GLAccount%20eq%20%27${'0'.repeat(10 - oDetailLine.GLAccount.length) + oDetailLine.GLAccount}%27)`
				// let oContextBinding = oModel.bindContext(sUrl);

				// oContextBinding.requestObject()
				// .then(
				//   function (oResult) {
				//     if (oResult.value.length === 1){
				//         oBaseDataModel.setProperty(sPath+'/balance', oResult.AvailableBudget);
				//         oBaseDataModel.setProperty(sPath+'/Amount', 0);
				//         this.onCalculation(oBaseDataModel);
				//     } else {
				//         oBaseDataModel.setProperty(sPath+'/balance', 0);
				//         oBaseDataModel.setProperty(sPath+'/Amount', 0);
				//         this.onCalculation(oBaseDataModel);
				//     }
				//   }.bind(this)
				// )
				// .catch(
				//   function (error) {
				//   }.bind(this)
				// );

				let oBaseDataModel = this.oView.getModel("BaseData");
				let oParamData = oBaseDataModel.getProperty("/Parameters");
				let oDetailLine = oBaseDataModel.getProperty(sPath);
				let vExchangeRate = oBaseDataModel.getProperty("/ExchangeRate");
				if (!oDetailLine.balanceEnable) return;

				let oModel = this.oView.getModel();
				let sUrl = `/sap/opu/odata4/sap/zfi_c_other_receipt_ui_v4/srvd/sap/zfi_c_other_receipt_ui/0001/ZFI_C_PLAN_COST_SUMMARY?$filter=CompanyCode%20eq%20%27${
					oParamData.CompanyCode
				}%27%20and%20FiscalYear%20eq%20%27${oParamData.PostingDate.slice(
					0,
					4
				)}%27%20and%20CostCenter%20eq%20%27${
					"0".repeat(10 - oDetailLine.Costcenter.length) +
					oDetailLine.Costcenter
				}%27%20and%20GLAccount%20eq%20%27${
					"0".repeat(10 - oDetailLine.GLAccount.length) + oDetailLine.GLAccount
				}%27`;

				const headers = {
					"X-Csrf-Token": oModel.getHttpHeaders()["X-CSRF-Token"],
				};

				axios
					.get(sUrl, { headers: headers })
					.then(
						function (sPath, oResult) {
							if (oResult.data.value.length === 1) {
								oBaseDataModel.setProperty(
									sPath + "/balanceKRW",
									oResult.data.value[0].AvailableBudget
								);
								oBaseDataModel.setProperty(
									sPath + "/balanceCurrency",
									oResult.data.value[0].CompanyCodeCurrency
								);
								let oCurrUnit =
									oBaseDataModel.getProperty("/NumberOfSourceCurrencyUnits") /
									100;
								if (vExchangeRate != 0) {
									oBaseDataModel.setProperty(
										sPath + "/balance",
										Math.floor(
											oResult.data.value[0].AvailableBudget /
												vExchangeRate /
												oCurrUnit
										) * oCurrUnit
									);
								} else {
									oBaseDataModel.setProperty(sPath + "/balance", 0);
								}
								oBaseDataModel.setProperty(sPath + "/Amount", 0);
								this.onCalculation(oBaseDataModel);
							} else {
								oBaseDataModel.setProperty(sPath + "/balance", 0);
								oBaseDataModel.setProperty(sPath + "/balanceKRW", 0);
								oBaseDataModel.setProperty(sPath + "/balanceCurrency", "");
								oBaseDataModel.setProperty(sPath + "/Amount", 0);
								this.onCalculation(oBaseDataModel);
							}
						}.bind(this, sPath)
					)
					.catch(
						function (sPath, error) {
							oBaseDataModel.setProperty(sPath + "/balance", 0);
							oBaseDataModel.setProperty(sPath + "/balanceKRW", 0);
							oBaseDataModel.setProperty(sPath + "/balanceCurrency", "");
							oBaseDataModel.setProperty(sPath + "/Amount", 0);
							this.onCalculation(oBaseDataModel);
						}.bind(this, sPath)
					);
			},
		});
	}
);
