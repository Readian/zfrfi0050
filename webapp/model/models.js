sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
],
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device) {
        "use strict";

        return {
            I18n : null,
            ValueHelpData : {
                _oVHDialog : {
                    VHBusinessPlace: undefined,
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
            },
            
            Data : {
                View : undefined,
                _oErrDialog: undefined,
                DebitCreditCode: [
                    { key: 'S', text: '차변' },
                    { key: 'H', text: '대변' }
                ],
                Items: [
                ],
                Visible : {
                    Debit : true,
                    Credit : false,
                    Footer: false,
                },
                //15a76f81-e23a-1ede-99df-d3d7b1feabb2
                Parameters : {
                    AccountingDocument : '미생성',
                    CompanyCode: '',
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
                    InputData : '',
                    BankaccountName: '',
                    Paymentscheduled: '',
                    CashDiscount1Days : 0,
                    VATAmount : 0,
                    TaxPer: 0,
                    AccountRecon: '',
                    AccountReconText: '',
                    BPBankAccountInternalID: '',
                    VATParam: 0,
                },
                Error: []
            },
            ViewData :{
                _View : undefined,
                ListView : undefined,
            },
            createBaseDataModel : function(){
                let oModel = new JSONModel(this.Data);
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

                oModel.setProperty('/Parameters/InputData',oEnd);
                return oModel;
            },
            createValueHelpDataModel : function(){
                let oModel = new JSONModel(this.ValueHelpData);
                return oModel;
            },
            createViewDataModel : function(){
                let oModel = new JSONModel(this.ViewData);
                return oModel;
            },
            createDeviceModel: function () {
                let oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },
        };
    });