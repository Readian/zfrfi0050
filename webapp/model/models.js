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
                    VHTaxcode: undefined
                },
                v4SelectInput : undefined
            },
            
            Data : {
                DebitCreditCode: [
                    { key: 'D', text: '차변' },
                    { key: 'C', text: '대변' }
                ],
                Items: [],
                Visible : {
                    Debit : true,
                    Credit : false
                },
                Parameters : {
                    AccountingDocument : '미생성',
                    CompanyCode: '회사코드',
                    FiscalYear: '',
                    PostingDate: '',
                    Amount: 0,
                    Currency : 'KRW',
                    PaymentTerms: '',
                    DocumenItemText: '',
                    KeyCarPur: '',
                    TaxCode: '',
                    DocumentDate: '',
                    Costcenter: '',
                    Supplier: '',
                    BankCountry: '',
                    Bank: '',
                    Bankaccount: '',
                    AmountTotal: 0,
                    _Item: []
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