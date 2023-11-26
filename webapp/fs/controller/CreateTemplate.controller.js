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
                DebitCreditCode : 'D',
                Costcenter : '',
                GLAccount : '',
                GLAccountName : '',
                Amount : 0,
                Currency : 'KRW',
                AmountTax : ''
            });

            oBaseData.setProperty('/Items', oBaseDataData.Items);

        },
        onRemoveBtnPress : function(oEvent){
            //Table Remove 버튼
        },
        onChangeDebitCreditCode: function(oEvent){

        },
        onOpenCurrency : function(oEvent){
            let oBaseData = this.getView().getModel('BaseData');
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
            let oBaseData = this.getView().getModel('BaseData');
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
            let oBaseData = this.getView().getModel('BaseData');
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
            let oBaseData = this.getView().getModel('BaseData');
            let oValueHelpData = this.getView().getModel('ValueHelpData');
            if(!oValueHelpData.getProperty('/_oVHDialog/VHCostCenter'))
            {
                this.loadFragment({
                    name: "fi.zfrfi0050.fs.view.f4.F4CostCenter"
                }).then(function(oDialog){
                    oValueHelpData.setProperty('/_oVHDialog/VHCostCenter', oDialog);
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


                }.bind(this));
            }else{
                oValueHelpData.getProperty('/_oVHDialog/VHCostCenter').open();
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
                    let oFilterBar = oValueHelpData.getProperty('/_oVHDialog/VHCurrency').getFilterBar();
                    let sSearchQuery = oFilterBar.getBasicSearchValue();
                    let aSelectionSet = oEvent.getParameter("selectionSet");

                    let aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                        if (oControl.getValue()) {
                            aResult.push(new Filter({
                                path: oControl.getName(),
                                operator: FilterOperator.Contains,
                                value1: oControl.getValue()
                            }));
                        }
    
                        return aResult;
                    }, []);
    
                    aFilters.push(new Filter({
                        filters: [
                            new Filter({ path: "Currency", operator: FilterOperator.Contains, value1: sSearchQuery.substr(0, 10) }),
                            new Filter({ path: "CurrencyName", operator: FilterOperator.Contains, value1: sSearchQuery.substr(0, 20) })
                        ],
                        and: false
                    }));
    
                    oValueHelpData.getProperty('/_oVHDialog/VHCurrency').getTableAsync().then(
                        function (oTable) {
                            if(oTable.bindRows){
                                oTable.getBinding("rows").filter(new Filter({
                                    filters: aFilters,
                                    and: true
                                }));
                            }
                            if(oTable.bindItems){
                                oTable.getBinding("items").filter(new Filter({
                                    filters: aFilters,
                                    and: true
                                }));
                            }
                            oValueHelpData.getProperty('/_oVHDialog/VHCurrency').update();
                        }.bind(this)
                    );
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
                    let oFilterBar = oValueHelpData.getProperty('/_oVHDialog/VHSupplier').getFilterBar();
                    let sSearchQuery = oFilterBar.getBasicSearchValue();
                    let aSelectionSet = oEvent.getParameter("selectionSet");

                    let aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                        if (oControl.getValue()) {
                            aResult.push(new Filter({
                                path: oControl.getName(),
                                operator: FilterOperator.Contains,
                                value1: oControl.getValue()
                            }));
                        }
    
                        return aResult;
                    }, []);
    
                    aFilters.push(new Filter({
                        filters: [
                            new Filter({ path: "Supplier", operator: FilterOperator.Contains, value1: sSearchQuery.substr(0, 10) }),
                            new Filter({ path: "SupplierName", operator: FilterOperator.Contains, value1: sSearchQuery.substr(0, 20) })
                        ],
                        and: false
                    }));
    
                    oValueHelpData.getProperty('/_oVHDialog/VHSupplier').getTableAsync().then(
                        function (oTable) {
                            if(oTable.bindRows){
                                oTable.getBinding("rows").filter(new Filter({
                                    filters: aFilters,
                                    and: true
                                }));
                            }
                            if(oTable.bindItems){
                                oTable.getBinding("items").filter(new Filter({
                                    filters: aFilters,
                                    and: true
                                }));
                            }
                            oValueHelpData.getProperty('/_oVHDialog/VHSupplier').update();
                        }.bind(this)
                    );
                    break;
                case 'afterClose':
                    break;
            }
        },
        onActionVHCostCenter: function(oEvent){
            let oBaseData = this.getView().getModel('BaseData');
            let oValueHelpData = this.getView().getModel('ValueHelpData');
            
            switch(oEvent.sId){
                case 'cancel':
                    oValueHelpData.getProperty('/_oVHDialog/VHCostCenter').close();

                    break;
                case 'ok':
                    let token = oEvent.getParameter('tokens')[0].getProperty('key');
                    oBaseData.setProperty('/Parameters/Costcenter',token);

                    oValueHelpData.getProperty('/_oVHDialog/VHCostCenter').close();
                    
                    break;
                case 'search' :
                    let oFilterBar = oValueHelpData.getProperty('/_oVHDialog/VHCostCenter').getFilterBar();
                    let sSearchQuery = oFilterBar.getBasicSearchValue();
                    let aSelectionSet = oEvent.getParameter("selectionSet");

                    let aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                        if (oControl.getValue()) {
                            aResult.push(new Filter({
                                path: oControl.getName(),
                                operator: FilterOperator.Contains,
                                value1: oControl.getValue()
                            }));
                        }
    
                        return aResult;
                    }, []);
    
                    aFilters.push(new Filter({
                        filters: [
                            new Filter({ path: "CodeId", operator: FilterOperator.Contains, value1: sSearchQuery.substr(0, 10) }),
                            new Filter({ path: "CodeName", operator: FilterOperator.Contains, value1: sSearchQuery.substr(0, 20) })
                        ],
                        and: false
                    }));
    
                    oValueHelpData.getProperty('/_oVHDialog/VHCostCenter').getTableAsync().then(
                        function (oTable) {
                            if(oTable.bindRows){
                                oTable.getBinding("rows").filter(new Filter({
                                    filters: aFilters,
                                    and: true
                                }));
                            }
                            if(oTable.bindItems){
                                oTable.getBinding("items").filter(new Filter({
                                    filters: aFilters,
                                    and: true
                                }));
                            }
                            oValueHelpData.getProperty('/_oVHDialog/VHCostCenter').update();
                        }.bind(this)
                    );
                    break;
                case 'afterClose':
                    break;
            }
        },
        onOpenVHTBCostCenter: function(oEvent){
            let oBaseData = this.getView().getModel('BaseData');
            let oValueHelpData = this.getView().getModel('ValueHelpData');
            oValueHelpData.setProperty('/v4SelectInput', oEvent.getSource());
            
            if(!oValueHelpData.getProperty('/_oVHDialog/VHTBCostCenter'))
            {
                this.loadFragment({
                    name: "fi.zfrfi0050.fs.view.f4.F4TBCostCenter"
                }).then(function(oDialog){
                    oValueHelpData.setProperty('/_oVHDialog/VHTBCostCenter', oDialog);
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


                }.bind(this));
            }else{
                oValueHelpData.getProperty('/_oVHDialog/VHTBCostCenter').open();
            }
        },
        onOpenVHTBAccount: function(oEvent){
            let oBaseData = this.getView().getModel('BaseData');
            let oValueHelpData = this.getView().getModel('ValueHelpData');
            oValueHelpData.setProperty('/v4SelectInput', oEvent.getSource());
            
            if(!oValueHelpData.getProperty('/_oVHDialog/VHTBGLAccount'))
            {
                this.loadFragment({
                    name: "fi.zfrfi0050.fs.view.f4.F4Account"
                }).then(function(oDialog){
                    oValueHelpData.setProperty('/_oVHDialog/VHTBGLAccount', oDialog);
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
                                    path: "/ZFI_V_GL_ACCOUNT_EXPENSE",
                                    events: {
                                        dataReceived: function () {
                                            oDialog.update();
                                        },
                                    },
                                });
                                oTable.addColumn(
                                    new UIColumn({
                                        label: new Label({ text: "G/L 계정" }),
                                        template: new Text({ text: "{GLAccount}" }),
                                    })
                                );
                                oTable.addColumn(
                                    new UIColumn({
                                        label: new Label({ text: "G/L 계정명" }),
                                        template: new Text({ text: "{GLAccountName}" }),
                                    })
                                );
                            }
                            oDialog.update();
                        }.bind(this)
                    );
                    oDialog.open();


                }.bind(this));
            }else{
                oValueHelpData.getProperty('/_oVHDialog/VHTBGLAccount').open();
            }
        },

        onOpenVHTBCurrency: function(oEvent){
            let oBaseData = this.getView().getModel('BaseData');
            let oValueHelpData = this.getView().getModel('ValueHelpData');
            oValueHelpData.setProperty('/v4SelectInput', oEvent.getSource());
            
            if(!oValueHelpData.getProperty('/_oVHDialog/VHTBCurrency'))
            {
                this.loadFragment({
                    name: "fi.zfrfi0050.fs.view.f4.F4TBCurrency"
                }).then(function(oDialog){
                    oValueHelpData.setProperty('/_oVHDialog/VHTBCurrency', oDialog);
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


                }.bind(this));
            }else{
                oValueHelpData.getProperty('/_oVHDialog/VHTBCurrency').open();
            }
        },

        onOpenVHTBTaxCode: function(oEvent){
            let oBaseData = this.getView().getModel('BaseData');
            let oValueHelpData = this.getView().getModel('ValueHelpData');
            oValueHelpData.setProperty('/v4SelectInput', oEvent.getSource());
            
            if(!oValueHelpData.getProperty('/_oVHDialog/VHTBTaxCode'))
            {
                this.loadFragment({
                    name: "fi.zfrfi0050.fs.view.f4.F4TBTaxcode"
                }).then(function(oDialog){
                    oValueHelpData.setProperty('/_oVHDialog/VHTBTaxCode', oDialog);
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
                oValueHelpData.getProperty('/_oVHDialog/VHTBTaxCode').open();
            }
        },

        
        onActionVHTaxcode : function(oEvent){
            let oBaseData = this.getView().getModel('BaseData');
            let oValueHelpData = this.getView().getModel('ValueHelpData');
            
            switch(oEvent.sId){
                case 'cancel':
                    oValueHelpData.getProperty('/_oVHDialog/VHTaxcode').close();

                    break;
                case 'ok':
                    let token = oEvent.getParameter('tokens')[0].getProperty('key');
                    oBaseData.setProperty('/Parameters/TaxCode',token);

                    oValueHelpData.getProperty('/_oVHDialog/VHTaxcode').close();
                    
                    break;
                case 'search' :
                    let oFilterBar = oValueHelpData.getProperty('/_oVHDialog/VHTaxcode').getFilterBar();
                    let sSearchQuery = oFilterBar.getBasicSearchValue();
                    let aSelectionSet = oEvent.getParameter("selectionSet");

                    let aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                        if (oControl.getValue()) {
                            aResult.push(new Filter({
                                path: oControl.getName(),
                                operator: FilterOperator.Contains,
                                value1: oControl.getValue()
                            }));
                        }
    
                        return aResult;
                    }, []);
    
                    aFilters.push(new Filter({
                        filters: [
                            new Filter({ path: "CodeId", operator: FilterOperator.Contains, value1: sSearchQuery.substr(0, 10) }),
                            new Filter({ path: "CodeName", operator: FilterOperator.Contains, value1: sSearchQuery.substr(0, 20) })
                        ],
                        and: false
                    }));
    
                    oValueHelpData.getProperty('/_oVHDialog/VHTaxcode').getTableAsync().then(
                        function (oTable) {
                            if(oTable.bindRows){
                                oTable.getBinding("rows").filter(new Filter({
                                    filters: aFilters,
                                    and: true
                                }));
                            }
                            if(oTable.bindItems){
                                oTable.getBinding("items").filter(new Filter({
                                    filters: aFilters,
                                    and: true
                                }));
                            }
                            oValueHelpData.getProperty('/_oVHDialog/VHTaxcode').update();
                        }.bind(this)
                    );
                    break;
                case 'afterClose':
                    break;
            }
        },
        onActionVHTBCostCenter : function(oEvent){
            let oBaseData = this.getView().getModel('BaseData');
            let oValueHelpData = this.getView().getModel('ValueHelpData');

            switch(oEvent.sId){
                case 'cancel':
                    oValueHelpData.getProperty('/_oVHDialog/VHTBCostCenter').close();

                    break;
                case 'ok':
                    let oSelected = oEvent.getParameter('tokens')[0].getProperty('key');
                    let sPath = oValueHelpData.getProperty('/v4SelectInput' ).getParent().getBindingContextPath();

                    oBaseData.setProperty(sPath+ '/Costcenter', oSelected);
                    oValueHelpData.getProperty('/_oVHDialog/VHTBCostCenter').close();

                    break;
                case 'search' :
                    let oFilterBar = oValueHelpData.getProperty('/_oVHDialog/VHTBCostCenter').getFilterBar();
                    let sSearchQuery = oFilterBar.getBasicSearchValue();
                    let aSelectionSet = oEvent.getParameter("selectionSet");

                    let aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                        if (oControl.getValue()) {
                            aResult.push(new Filter({
                                path: oControl.getName(),
                                operator: FilterOperator.Contains,
                                value1: oControl.getValue()
                            }));
                        }
    
                        return aResult;
                    }, []);
    
                    aFilters.push(new Filter({
                        filters: [
                            new Filter({ path: "CostCenter", operator: FilterOperator.Contains, value1: sSearchQuery.substr(0, 10) }),
                            new Filter({ path: "CostCenterName", operator: FilterOperator.Contains, value1: sSearchQuery.substr(0, 20) })
                        ],
                        and: false
                    }));
    
                    oValueHelpData.getProperty('/_oVHDialog/VHTBCostCenter').getTableAsync().then(
                        function (oTable) {
                            if(oTable.bindRows){
                                oTable.getBinding("rows").filter(new Filter({
                                    filters: aFilters,
                                    and: true
                                }));
                            }
                            if(oTable.bindItems){
                                oTable.getBinding("items").filter(new Filter({
                                    filters: aFilters,
                                    and: true
                                }));
                            }
                            oValueHelpData.getProperty('/_oVHDialog/VHTBCostCenter').update();
                        }.bind(this)
                    );
                    break;
                case 'afterClose':
                    break;
            }
        },

        onActionVHTBAccount: function(oEvent){
            let oBaseData = this.getView().getModel('BaseData');
            let oValueHelpData = this.getView().getModel('ValueHelpData');

            switch(oEvent.sId){
                case 'cancel':
                    oValueHelpData.getProperty('/_oVHDialog/VHTBGLAccount').close();

                    break;
                case 'ok':
                    let oTable = oEvent.oSource.getTable();
                    let oSelected = oEvent.getParameter('tokens')[0].getProperty('key');
                    let sPath = oValueHelpData.getProperty('/v4SelectInput' ).getParent().getBindingContextPath();
                    let AccountName = oTable.getContextByIndex(oTable.getSelectedIndex()).getObject();
                    oBaseData.setProperty(sPath+ '/GLAccount', oSelected);
                    oBaseData.setProperty(sPath+ '/GLAccountName', AccountName.GLAccountName);
                    oValueHelpData.getProperty('/_oVHDialog/VHTBGLAccount').close();

                    break;
                case 'search' :
                    let oFilterBar = oValueHelpData.getProperty('/_oVHDialog/VHTBGLAccount').getFilterBar();
                    let sSearchQuery = oFilterBar.getBasicSearchValue();
                    let aSelectionSet = oEvent.getParameter("selectionSet");

                    let aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                        if (oControl.getValue()) {
                            aResult.push(new Filter({
                                path: oControl.getName(),
                                operator: FilterOperator.Contains,
                                value1: oControl.getValue()
                            }));
                        }
    
                        return aResult;
                    }, []);
    
                    aFilters.push(new Filter({
                        filters: [
                            new Filter({ path: "GLAccount", operator: FilterOperator.Contains, value1: sSearchQuery.substr(0, 10) }),
                            new Filter({ path: "GLAccountName", operator: FilterOperator.Contains, value1: sSearchQuery.substr(0, 20) })
                        ],
                        and: false
                    }));
    
                    oValueHelpData.getProperty('/_oVHDialog/VHTBGLAccount').getTableAsync().then(
                        function (oTable) {
                            if(oTable.bindRows){
                                oTable.getBinding("rows").filter(new Filter({
                                    filters: aFilters,
                                    and: true
                                }));
                            }
                            if(oTable.bindItems){
                                oTable.getBinding("items").filter(new Filter({
                                    filters: aFilters,
                                    and: true
                                }));
                            }
                            oValueHelpData.getProperty('/_oVHDialog/VHTBGLAccount').update();
                        }.bind(this)
                    );
                    break;
                case 'afterClose':
                    break;
            }
        },

        onActionVHTBCurrency: function(oEvent){
            let oBaseData = this.getView().getModel('BaseData');
            let oValueHelpData = this.getView().getModel('ValueHelpData');

            switch(oEvent.sId){
                case 'cancel':
                    oValueHelpData.getProperty('/_oVHDialog/VHTBCurrency').close();

                    break;
                case 'ok':
                    let oTable = oEvent.oSource.getTable();
                    let oSelected = oEvent.getParameter('tokens')[0].getProperty('key');
                    let sPath = oValueHelpData.getProperty('/v4SelectInput' ).getParent().getBindingContextPath();
                    let AccountName = oTable.getContextByIndex(oTable.getSelectedIndex()).getObject();
                    oBaseData.setProperty(sPath+ '/Currency', oSelected);
                    oValueHelpData.getProperty('/_oVHDialog/VHTBCurrency').close();

                    break;
                case 'search' :
                    let oFilterBar = oValueHelpData.getProperty('/_oVHDialog/VHTBCurrency').getFilterBar();
                    let sSearchQuery = oFilterBar.getBasicSearchValue();
                    let aSelectionSet = oEvent.getParameter("selectionSet");

                    let aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                        if (oControl.getValue()) {
                            aResult.push(new Filter({
                                path: oControl.getName(),
                                operator: FilterOperator.Contains,
                                value1: oControl.getValue()
                            }));
                        }
    
                        return aResult;
                    }, []);
    
                    aFilters.push(new Filter({
                        filters: [
                            new Filter({ path: "Currency", operator: FilterOperator.Contains, value1: sSearchQuery.substr(0, 10) }),
                            new Filter({ path: "CurrencyName", operator: FilterOperator.Contains, value1: sSearchQuery.substr(0, 20) })
                        ],
                        and: false
                    }));
    
                    oValueHelpData.getProperty('/_oVHDialog/VHTBCurrency').getTableAsync().then(
                        function (oTable) {
                            if(oTable.bindRows){
                                oTable.getBinding("rows").filter(new Filter({
                                    filters: aFilters,
                                    and: true
                                }));
                            }
                            if(oTable.bindItems){
                                oTable.getBinding("items").filter(new Filter({
                                    filters: aFilters,
                                    and: true
                                }));
                            }
                            oValueHelpData.getProperty('/_oVHDialog/VHTBCurrency').update();
                        }.bind(this)
                    );
                    break;
                case 'afterClose':
                    break;
            }
        },
        onActionVHTBTaxcode: function(oEvent){
            let oBaseData = this.getView().getModel('BaseData');
            let oValueHelpData = this.getView().getModel('ValueHelpData');

            switch(oEvent.sId){
                case 'cancel':
                    oValueHelpData.getProperty('/_oVHDialog/VHTBTaxCode').close();

                    break;
                case 'ok':
                    let oTable = oEvent.oSource.getTable();
                    let oSelected = oEvent.getParameter('tokens')[0].getProperty('key');
                    let sPath = oValueHelpData.getProperty('/v4SelectInput' ).getParent().getBindingContextPath();
                    let AccountName = oTable.getContextByIndex(oTable.getSelectedIndex()).getObject();
                    oBaseData.setProperty(sPath+ '/AmountTax', oSelected);
                    oValueHelpData.getProperty('/_oVHDialog/VHTBTaxCode').close();

                    break;
                case 'search' :
                    let oFilterBar = oValueHelpData.getProperty('/_oVHDialog/VHTBTaxCode').getFilterBar();
                    let sSearchQuery = oFilterBar.getBasicSearchValue();
                    let aSelectionSet = oEvent.getParameter("selectionSet");

                    let aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                        if (oControl.getValue()) {
                            aResult.push(new Filter({
                                path: oControl.getName(),
                                operator: FilterOperator.Contains,
                                value1: oControl.getValue()
                            }));
                        }
    
                        return aResult;
                    }, []);
    
                    aFilters.push(new Filter({
                        filters: [
                            new Filter({ path: "CodeId", operator: FilterOperator.Contains, value1: sSearchQuery.substr(0, 10) }),
                            new Filter({ path: "CodeName", operator: FilterOperator.Contains, value1: sSearchQuery.substr(0, 20) })
                        ],
                        and: false
                    }));
    
                    oValueHelpData.getProperty('/_oVHDialog/VHTBTaxCode').getTableAsync().then(
                        function (oTable) {
                            if(oTable.bindRows){
                                oTable.getBinding("rows").filter(new Filter({
                                    filters: aFilters,
                                    and: true
                                }));
                            }
                            if(oTable.bindItems){
                                oTable.getBinding("items").filter(new Filter({
                                    filters: aFilters,
                                    and: true
                                }));
                            }
                            oValueHelpData.getProperty('/_oVHDialog/VHTBTaxCode').update();
                        }.bind(this)
                    );
                    break;
                case 'afterClose':
                    break;
            }
        },

        onChangeDebitCreditCode: function(oEvent){
            this.onCalculation();
        },
        
        onChangePostingDate: function(oEvent){
            let oModel = this.getView().getModel();
            let oBaseData = this.getView().getModel('BaseData');
            oBaseData.setProperty('/Parameters/FiscalYear', oEvent.getParameter('newValue').substr(0,4));
        },

        onChangeAmount: function(oEvent){

            this.onCalculation();
        },

        onCalculation: function(oEvent){
            let oBaseData = this.getView().getModel('BaseData');
            let oBaseDataData = oBaseData.getData();
            let isCount = 0;
            let DebitSum = 0;
            let CreditSum = 0;


            for(let i = 0; i < oBaseDataData.Items.length; i++)
            {
                //D 차변 (Debit), C 대변 (Credit)
                if(oBaseDataData.Items[i].DebitCreditCode == 'D'){
                    DebitSum += oBaseDataData.Items[i].Amount;
                }
                else if(oBaseDataData.Items[i].DebitCreditCode == 'C')
                {
                    CreditSum += oBaseDataData.Items[i].Amount;
                }
            }

            oBaseData.setProperty('/Parameters/DebitTotal',DebitSum);
            oBaseData.setProperty('/Parameters/CreditTotal', CreditSum);
            oBaseData.setProperty('/Parameters/AmountTotal', DebitSum-CreditSum);
            
        },

        onValidateion: function(oEvent){
            let oModel = this.getView().getModel();
            let oBaseData = this.getView().getModel('BaseData');
            let oBaseDataData = oBaseData.getData();

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