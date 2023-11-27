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
            ValueHelpData : {
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
            },
            
            Data : {
                DebitCreditCode: [
                    { key: 'H', text: '차변' },
                    { key: 'S', text: '대변' }
                ],
                Items: [
                    {
                       DebitCreditCode : "S" ,
                       DebitCreditCodeEnable : false,
                       GLAccount : "",
                       GLAccountEnable : false,
                       GLAccountName : "",
                       Budgetbalance : 0,
                       Currency : "KRW",
                       Amount : 0,
                       AmountEnable : false,
                       Costcenter : "",
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
                    AccountingDocument : '미생성',
                    CompanyCode: '1000',
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
                    CashDiscount1Days : 0
                }
            },
            createBaseDataModel : function(){
                let oModel = new JSONModel(this.Data);
                return oModel;
            },
            createValueHelpDataModel : function(){
                let oModel = new JSONModel(this.ValueHelpData);
                return oModel;
            },
            createDeviceModel: function () {
                let oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },
        };
    });