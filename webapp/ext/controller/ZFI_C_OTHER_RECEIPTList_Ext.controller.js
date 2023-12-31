sap.ui.define([
	'sap/ui/core/mvc/ControllerExtension',
	'fi/zfrfi0050/model/models',
	"sap/ui/model/json/JSONModel"
], function (
	ControllerExtension, 
	Model,
	JSONModel) {
	'use strict';

	return ControllerExtension.extend('fi.zfrfi0050.ext.controller.ZFI_C_OTHER_RECEIPTList_Ext', {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		override: {
			onInit: function () {
				this.extAPI = this.base.getExtensionAPI();
				this.getView().setModel(Model.createBaseDataModel(), 'BaseData');
				this.getView().setModel(Model.createViewDataModel(), 'ViewData');
				this.getView().setModel(Model.createValueHelpDataModel(), 'ValueHelpData');
				this.base.getAppComponent().getRouter().getRoute('CreateTemplate').attachPatternMatched(this.onObjectMatched, this);
                this.getView().getModel('ViewData').setProperty('/ListView', this.getView());
				// this.base.getExtensionAPI()._view.byId('fe::table::ZFI_C_OTHER_RECEIPT::LineItem-innerTable').setMode('SingleSelectLeft');
			
            },

			onAfterRendering: function () {
				this.extAPI.i18n = this.base.getModel('i18n').getResourceBundle();
			}
		},
		onObjectMatched(oEvent){
            let oDate = new Date();
            let oMonth = oDate.getMonth() + 1;
            let oYear = oDate.getFullYear();
            let oDay = oDate.getDate();
            if(oDay < 10) {
                oDay = "0"+oDay;
            }
            if(oMonth < 10) {
                oMonth = "0"+oMonth;
            }
            let oEnd = oYear+'-'+oMonth+'-'+oDay;

            let ValueHelpData = {
                _oVHDialog : {
                    VHCurrency : undefined,
                    VHSupplier: undefined,
                    VHTaxcode: undefined,
                    VHCostCenter : undefined,
                    VHTBCostCenter : undefined,
                    VHTBGLAccount : undefined,
                    VHTBCurrency : undefined,
                    VHTBTaxCode : undefined,
                    VHBankAccount : undefined,
                    VHPaymentTerms: undefined
                },
                v4SelectInput : undefined
            };
			let Data = {
                DebitCreditCode: [
                    { key: 'S', text: this.extAPI.i18n.getText("col0010") },
                    { key: 'H', text: this.extAPI.i18n.getText("col0020") }
                ],
                Items: [
                    {
                       DebitCreditCode : "H" ,
                       DebitCreditCodeEnable : false,
                       GLAccount : "",
                       GLAccountEnable : false,
                       GLAccountName : "",
                       Budgetbalance : 0,
                       Currency : "KRW",
                       Amount : 0,
                       AmountEnable : false,
                       Costcenter : "",
                       CostcenterEnable: false,
                       AmountTax : 0,
                       DocumentItemText : ""
                    }
                ],
                Visible : {
                    Debit : true,
                    Credit : false
                },
                //15a76f81-e23a-1ede-99df-d3d7b1feabb2
                Parameters : {
                    AccountingDocument : this.extAPI.i18n.getText("col0030"),
                    CompanyCode: this.base.getExtensionAPI().byId('fi.zfrfi0050::ZFI_C_OTHER_RECEIPTList--fe::FilterBar::ZFI_C_OTHER_RECEIPT::FilterField::CompanyCode-inner').getValue().match(/\((\d+)\)/)[1],
                    FiscalYear: '',
                    PostingDate: '',
                    Amount: 0,
                    Currency : 'KRW',
                    PaymentTerms: '',
                    DocumentItemText: '',
                    KeyCardPur: '00000000-0000-0000-0000-000000000000',
                    TaxCode: '',
                    TaxCodeName: '',
                    DocumentDate: '',
                    Costcenter: '',
                    CostcenterName: '',
                    Supplier: '',
                    BankCountry: '',
                    Bank: '',
                    Bankaccount: '',
                    AmountTotal: 0,
                    _Item: [],
                    DebitTotal : 0,
                    CreditTotal : 0,
                    InputData : oEnd,
                    BankaccountName: '',
                    Paymentscheduled: '',
                    CashDiscount1Days : 0
                }
            };
			let oModel = new JSONModel(Data);
            let oValueHelpData = new JSONModel(ValueHelpData);
            this.getView().getModel('ViewData').getProperty('/_View').setModel(oValueHelpData,'ValueHelpData');
            this.getView().getModel('ViewData').getProperty('/_View').setModel(oModel, 'BaseData');
			// this.getView().getModel('BaseData').setData(Data);
			
			// this.getView().setModel(Model.createBaseDataModel(), 'BaseData');
			// this.getView().bindElement({
			// 	path: '/',
			// 	model: 'BaseData'
			// })
            // this.getView().bindElement({
			// 	path: '/',
			// 	model: 'ViewData'
			// })
			// this.getView().getModel('BaseData').setData(Data);
		}

	});
});
