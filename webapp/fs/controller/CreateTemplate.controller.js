sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/ui/core/routing/History',
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
    "sap/ui/table/Column"
], function (
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
    UIColumn) {
    'use strict';

    return Controller.extend("fi.zfrfi0050.fs.controller.CreateTemplate", {
        //View Controller ID
      
        onInit: function () {
            this.getView().setModel(Model.createBaseDataModel(), 'BaseData')
            this.getView().setModel(Model.createValueHelpDataModel(), 'ValueHelpData')
            //      _oVHDialog ,   v4SelectInput
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

        },
        onOpenCurrency : function(oEvent){
            let oBaseData = this.getView().getModel();
            let oValueHelpData = this.getView().getModel('ValueHelpData');
            if(!oValueHelpData.getProperty('/_oVHDialog/VHCurrency'))
            {
                this.loadFragment({
                    name: "fi.zfrfi0050.fs.view.f4.F4Currency"
                }).then(function(oDialog){
                    oValueHelpData.setProperty('/_oVHDialog/VHCurrency', oDialog);
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
                            oTable.setThreshold(500);
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


                }.bind(this));
            }else{
                oValueHelpData.getProperty('/_oVHDialog/VHCurrency').open();
            }
        },
        onOpenSupplier : function(oEvent){
            let oBaseData = this.getView().getModel();
            let oValueHelpData = this.getView().getModel('ValueHelpData');
            if(!oValueHelpData.getProperty('/_oVHDialog/VHSupplier'))
            {
                this.loadFragment({
                    name: "fi.zfrfi0050.fs.view.f4.F4Supplier"
                }).then(function(oDialog){
                    oValueHelpData.setProperty('/_oVHDialog/VHSupplier', oDialog);
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
                            oTable.setThreshold(500);
                            if (oTable.bindRows) {
                                oTable.bindAggregation("rows", {
                                    path: "/ZFI_V_SUPPLIER",
                                    events: {
                                        dataReceived: function () {
                                            oDialog.update();
                                        },
                                    },
                                });
                                oTable.addColumn(
                                    new UIColumn({
                                        label: new Label({ text: "Supplier" }),
                                        template: new Text({ text: "{Supplier}" }),
                                    })
                                );
                                oTable.addColumn(
                                    new UIColumn({
                                        label: new Label({ text: "SupplierName" }),
                                        template: new Text({ text: "{SupplierName}" }),
                                    })
                                );
                            }
                            oDialog.update();
                        }.bind(this)
                    );
                    oDialog.open();


                }.bind(this));
            }else{
                oValueHelpData.getProperty('/_oVHDialog/VHSupplier').open();
            }
        },
        onOpenVHTaxcode: function(oEvent){
            let oBaseData = this.getView().getModel();
            let oValueHelpData = this.getView().getModel('ValueHelpData');
            if(!oValueHelpData.getProperty('/_oVHDialog/VHTaxcode'))
            {
                this.loadFragment({
                    name: "fi.zfrfi0050.fs.view.f4.F4Taxcode"
                }).then(function(oDialog){
                    oValueHelpData.setProperty('/_oVHDialog/VHTaxcode', oDialog);
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
                            oTable.setThreshold(500);
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


                }.bind(this));
            }else{
                oValueHelpData.getProperty('/_oVHDialog/VHSupplier').open();
            }
        },
        onOpenVHCostCenter : function(oEvent){
            let oBaseData = this.getView().getModel();
            let oValueHelpData = this.getView().getModel('ValueHelpData');
            if(!oValueHelpData.getProperty('/_oVHDialog/VHTaxcode'))
            {
                this.loadFragment({
                    name: "fi.zfrfi0050.fs.view.f4.F4Taxcode"
                }).then(function(oDialog){
                    oValueHelpData.setProperty('/_oVHDialog/VHTaxcode', oDialog);
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
                            oTable.setThreshold(500);
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


                }.bind(this));
            }else{
                oValueHelpData.getProperty('/_oVHDialog/VHSupplier').open();
            }
        },

        onActionVHCurrency: function(oEvent){
            let oBaseData = this.getView().getModel('BaseData');
            let oValueHelpData = this.getView().getModel('ValueHelpData');
            
            switch(oEvent.sId){
                case 'cancel':
                    oValueHelpData.getProperty('/_oVHDialog/VHCurrency').close();

                    break;
                case 'ok':
                    let token = oEvent.getParameter('tokens')[0].getProperty('key');
                    oBaseData.setProperty('/Parameters/Currency',token);

                    oValueHelpData.getProperty('/_oVHDialog/VHCurrency').close();
                    
                    break;
                case 'search' :
                        
                    break;
                case 'afterClose':
                    break;
            }
        },
        

        onActionVHSupplier: function(oEvent){
            let oBaseData = this.getView().getModel('BaseData');
            let oValueHelpData = this.getView().getModel('ValueHelpData');
            
            switch(oEvent.sId){
                case 'cancel':
                    oValueHelpData.getProperty('/_oVHDialog/VHSupplier').close();

                    break;
                case 'ok':
                    let token = oEvent.getParameter('tokens')[0].getProperty('key');
                    oBaseData.setProperty('/Parameters/Supplier',token);

                    oValueHelpData.getProperty('/_oVHDialog/VHSupplier').close();
                    
                    break;
                case 'search' :
                        
                    break;
                case 'afterClose':
                    break;
            }
        },

        onBtnPress: function(oEvent){
            this.getView().getModel().bindContext('/ZFI_V_COSTCENTER').requestObject().then( function (oResult){
                let a = oResult;
            }.bind(this));
            this.getView().getModel().bindContext('/ZFI_CURRENCY').requestObject().then( function (oResult){
                let a = oResult;
            }.bind(this));
            MessageBox.confirm('[결재 상신] 하시겠습니까?', {
                actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                onClose: function (oAction) {
                 
  
                if (oAction === sap.m.MessageBox.Action.YES) {
                    
                    //Post
                    //X-Csrf-Token 가져오기
                    // const headers = {
                    //     'X-Csrf-Token' : 'n1QtnwQ9avmLHkRs6fzjXQ=='
                    // };
                    const headers = {
                        'X-CSRF-TOKEN' : this.oView.getModel().getHttpHeaders()['X-CSRF-Token']
                    };
                    //n1QtnwQ9avmLHkRs6fzjXQ==
                    axios.post('/sap/opu/odata4/sap/zfi_c_other_receipt_ui_v4/srvd/sap/zfi_c_other_receipt_ui/0001/ZFI_C_DOC_APPROVAL/com.sap.gateway.srvd.zfi_c_other_receipt_ui.v0001.Posting', 
                            {
                            'AccountingDocument' : '',
                            'CompanyCode': '',
                            'FiscalYear': '',
                            'PostingDate': '',
                            'Amount': 0,
                            'Currency': '',
                            'PaymentTerms': '',
                            'DocumentItemText': '',
                            'KeyCardPur': '',
                            'TaxCode': '',
                            'DocumentDate': '',
                            'Costcenter': '',
                            'Supplier': '',
                            'BankCountry': '',
                            'Bank': '',
                            'Bankaccount': '',
                            'AmountTotal': 0,
                            '_Item': []
                          },{
                            headers : headers
                            //n1QtnwQ9avmLHkRs6fzjXQ==
                          })
                          .then(function (response) {
                            console.log(response);
                          })
                          .catch(function (error) {
                            console.log(error);
                          });
                }
  
                }.bind(this)
              });
        }
    });
});