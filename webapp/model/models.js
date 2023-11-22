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
            
            Data : {
                DebitCreditCode: [
                    { key: 'D', text: '차변' },
                    { key: 'C', text: '대변' }
                ],
                Items: [],
                Visible : {
                    Debit : true,
                    Credit : false
                }
            },
            createBaseDataModel : function(){
                let oModel = new JSONModel(this.Data);
                return oModel;
            },
            createDeviceModel: function () {
                let oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },
        };
    });