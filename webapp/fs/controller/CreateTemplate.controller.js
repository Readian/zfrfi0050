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
                AmountTax : '',
                DocumentItemText: ''
            });

            oBaseData.setProperty('/Items', oBaseDataData.Items);

        },
        onRemoveBtnPress : function(oEvent){
            //Table Remove 버튼
            MessageBox.confirm('정말로 삭제하시겠습니까?', {
                actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                onClose: function (oAction) {
                  let BaseData = this.getView().getModel("BaseData");
                  let oTable = this.byId("T_Items");
  
                  if (oAction === sap.m.MessageBox.Action.YES) {
                    _(oTable.getSelectedItems().reverse()).forEach(function(n){
                        BaseData.getProperty('/Items').splice(n.getId().match(/(\d+)$/)[0],1);
                    });
  
                    BaseData.refresh(true);
                    oTable.removeSelections();
                }
  
                }.bind(this)
              });
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

        onValidation: function(){
            let oModel = this.getView().getModel();
            let oBaseData = this.getView().getModel('BaseData');
            let oBaseDataData = oBaseData.getData();
            let isTrue = true;
            let isCount = 0;

            if(!oBaseDataData.Parameters.PostingDate || oBaseDataData.Parameters.PostingDate == '')
            {
                isTrue = false;
                oBaseData.setProperty('/Parameters/PostingDateState', 'Error');
            }
            else{
                oBaseData.setProperty('/Parameters/PostingDateState', 'None');

            }
            if(!oBaseDataData.Parameters.Amount || oBaseDataData.Parameters.Amount == '')
            {
                isTrue = false;
                oBaseData.setProperty('/Parameters/AmountState', 'Error');
            }
            else{
                oBaseData.setProperty('/Parameters/AmountState', 'None');

            }
            if(!oBaseDataData.Parameters.Currency || oBaseDataData.Parameters.Currency == '')
            {
                isTrue = false;
                oBaseData.setProperty('/Parameters/CurrencyState', 'Error');
            }
            else{
                oBaseData.setProperty('/Parameters/CurrencyState', 'None');

            }
            if(!oBaseDataData.Parameters.PaymentTerms || oBaseDataData.Parameters.PaymentTerms == '')
            {
                isTrue = false;
                oBaseData.setProperty('/Parameters/PaymentTermsState', 'Error');
            }
            else{
                oBaseData.setProperty('/Parameters/PaymentTermsState', 'None');

            }
            if(!oBaseDataData.Parameters.Supplier || oBaseDataData.Parameters.Supplier == '')
            {
                isTrue = false;
                oBaseData.setProperty('/Parameters/SupplierState', 'Error');
            }
            else{
                oBaseData.setProperty('/Parameters/SupplierState', 'None');

            }
            if(!oBaseDataData.Parameters.DocumentItemText || oBaseDataData.Parameters.DocumentItemText == '')
            {
                isTrue = false;
                oBaseData.setProperty('/Parameters/DocumentItemTextState', 'Error');
            }
            else{
                oBaseData.setProperty('/Parameters/DocumentItemTextState', 'None');
            }
            if(!oBaseDataData.Parameters.TaxCode || oBaseDataData.Parameters.TaxCode == '')
            {
                isTrue = false;
                oBaseData.setProperty('/Parameters/TaxCodeState', 'Error');
            }
            else{
                oBaseData.setProperty('/Parameters/TaxCodeState', 'None');
            }
            if(!oBaseDataData.Parameters.DocumentDate || oBaseDataData.Parameters.DocumentDate == '')
            {
                isTrue = false;
                oBaseData.setProperty('/Parameters/DocumentDateState', 'Error');
            }
            else{
                oBaseData.setProperty('/Parameters/DocumentDateState', 'None');
            }
            if(!oBaseDataData.Parameters.Costcenter || oBaseDataData.Parameters.Costcenter == '')
            {
                isTrue = false;
                oBaseData.setProperty('/Parameters/CostcenterState', 'Error');
            }
            else{
                oBaseData.setProperty('/Parameters/CostcenterState', 'None');
            }
            if(!oBaseDataData.Parameters.Bank || oBaseDataData.Parameters.Bank == '')
            {
                isTrue = false;
                oBaseData.setProperty('/Parameters/BankState', 'Error');
            }
            else{
                oBaseData.setProperty('/Parameters/BankState', 'None');
            }
            if(!oBaseDataData.Parameters.Bank || oBaseDataData.Parameters.Bank == '')
            {
                isTrue = false;
                oBaseData.setProperty('/Parameters/BankState', 'Error');
            }
            else{
                oBaseData.setProperty('/Parameters/BankState', 'None');
            }
            if(!oBaseDataData.Parameters.Bankaccount || oBaseDataData.Parameters.Bankaccount == '')
            {
                isTrue = false;
                oBaseData.setProperty('/Parameters/BankaccountState', 'Error');
            }
            else{
                oBaseData.setProperty('/Parameters/BankaccountState', 'None');
            }

            for(let i = 0; i < oBaseDataData.Items.length; i++){
                if(!oBaseDataData.Items[i].DebitCreditCode || oBaseDataData.Items[i].DebitCreditCode == '')
                {
                    isTrue = false;
                    oBaseData.setProperty('/Items/'+i+'/DebitCreditCodeState', 'Error');
                }
                else 
                {
                    oBaseData.setProperty('/Items/'+i+'/DebitCreditCodeState', 'None');
                }
                if(!oBaseDataData.Items[i].Costcenter || oBaseDataData.Items[i].Costcenter == '')
                {
                    isTrue = false;
                    oBaseData.setProperty('/Items/'+i+'/CostcenterState', 'Error');
                }
                else 
                {
                    oBaseData.setProperty('/Items/'+i+'/CostcenterState', 'None');
                }
                if(!oBaseDataData.Items[i].GLAccount || oBaseDataData.Items[i].GLAccount == '')
                {
                    isTrue = false;
                    oBaseData.setProperty('/Items/'+i+'/GLAccountState', 'Error');
                }
                else {
                    oBaseData.setProperty('/Items/'+i+'/GLAccountState', 'None');
                }
                if(!oBaseDataData.Items[i].Amount || oBaseDataData.Items[i].Amount == '')
                {
                    isTrue = false;
                    oBaseData.setProperty('/Items/'+i+'/AmountState', 'Error');
                }
                else {
                    oBaseData.setProperty('/Items/'+i+'/AmountState', 'None');
                }
                if(!oBaseDataData.Items[i].Currency || oBaseDataData.Items[i].Currency == '')
                {
                    isTrue = false;
                    oBaseData.setProperty('/Items/'+i+'/CurrencyState', 'Error');
                }
                else {
                    oBaseData.setProperty('/Items/'+i+'/CurrencyState', 'None');
                }
                if(!oBaseDataData.Items[i].AmountTax || oBaseDataData.Items[i].AmountTax == '')
                {
                    isTrue = false;
                    oBaseData.setProperty('/Items/'+i+'/AmountTaxState', 'Error');
                }
                else {
                    oBaseData.setProperty('/Items/'+i+'/AmountTaxState', 'None');
                }
            }

            if(oBaseDataData.Parameters.AmountTotal !== 0)
            {
                isTrue = false;
                MessageBox.alert("차이금액이 '0' 이어야 합니다.");
            }

            return isTrue;

        },
        

        onBtnPress: function(oEvent){
            let oBaseData = this.getView().getModel('BaseData');
            let oBaseDataData = oBaseData.getData();

            oBaseData.setProperty('/Parameters/_Item', oBaseDataData.Items);

            if (this.onValidation()){
                MessageBox.confirm('[결재 상신] 하시겠습니까?', {
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    onClose: function (oAction) {
                     
      
                    if (oAction === sap.m.MessageBox.Action.YES) {


                        //Item정리
                        _.forEach(oBaseDataData.Parameters._Item, function (Items) {
                            if(Items.DebitCreditCodeState == 'D')
                            {
                                Items.AmountDebit = Items.Amount
                                Items.AmountCredit = 0
                            }
                            else if(Items.DebitCreditCodeState == 'C')
                            {
                                Items.AmountCredit = Items.Amount
                                Items.AmountDebi = 0
                            }
                            delete Items.DebitCreditCodeState
                            delete Items.CostcenterState
                            delete Items.GLAccountState
                            delete Items.GLAccountName
                            delete Items.AmountState
                            delete Items.CurrencyState
                            delete Items.AmountTaxState
                            delete Items.DocumentItemTextState
                        }.bind(this));
                        // oBaseData.setProperty('/Parameters/_Item',oBaseDataData.Parameters._Item);
                        
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
                                'CompanyCode': oBaseDataData.Parameters.CompanyCode,
                                'FiscalYear': oBaseDataData.Parameters.FiscalYear,
                                'PostingDate': oBaseDataData.Parameters.PostingDate,
                                'Amount': oBaseDataData.Parameters.Amount,
                                'Currency': oBaseDataData.Parameters.Currency,
                                'PaymentTerms': oBaseDataData.Parameters.PaymentTerms,
                                'DocumentItemText': oBaseDataData.Parameters.DocumentItemText,
                                'KeyCardPur': oBaseDataData.Parameters.KeyCardPur,
                                'TaxCode': oBaseDataData.Parameters.TaxCode,
                                'DocumentDate': oBaseDataData.Parameters.DocumentDate,
                                'Costcenter': oBaseDataData.Parameters.Costcenter,
                                'Supplier': oBaseDataData.Parameters.Supplier,
                                'BankCountry': oBaseDataData.Parameters.BankCountry,
                                'Bank': oBaseDataData.Parameters.Bank,
                                'Bankaccount': oBaseDataData.Parameters.Bankaccount,
                                'AmountTotal': oBaseDataData.Parameters.AmountTotal,
                                '_Item': oBaseDataData.Parameters._Item
                              },{
                                headers : headers
                                //n1QtnwQ9avmLHkRs6fzjXQ==
                              })
                              .then(function (response) {
                                console.log(response);
                                let oRouter = this.getOwnerComponent().getRouter();
                                oRouter.navTo('ZFI_C_OTHER_RECEIPTList');
                              }.bind(this))
                              .catch(function (error) {
                                console.log(error);
                              });
                    }
      
                    }.bind(this)
                });
            }

            
        }
    });
});