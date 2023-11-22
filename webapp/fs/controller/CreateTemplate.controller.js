sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/ui/core/routing/History',
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/ValueState",
    "fi/zfrfi0050/model/models"
], function (
    Controller,
    JSONModel,
    History,
    MessageToast,
    MessageBox,
    ValueState,
    Model) {
    'use strict';

    return Controller.extend("fi.zfrfi0050.fs.controller.CreateTemplate", {
        //View Controller ID
      
        onInit: function () {
            this.getView().setModel(Model.createBaseDataModel(), 'BaseData')
        },
        onAfterRendering : function(){
            let oBaseData = this.getView().getModel();
            
        },
        onAddBtnPress: function(oEvent) {
            //Table Add 버튼
            let oBaseData = this.getView().getModel('BaseData');
            let oBaseDataData = oBaseData.getData();

            oBaseDataData.Items.push({

            });

            oBaseData.setProperty('/Items', oBaseDataData.Items);

        },
        onRemoveBtnPress : function(oEvent){
            //Table Remove 버튼
        },
        onChangeDebitCreditCode: function(oEvent){

        }
    });
});