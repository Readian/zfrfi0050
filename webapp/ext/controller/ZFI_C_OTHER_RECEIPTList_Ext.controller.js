sap.ui.define(
  [
    "sap/ui/core/mvc/ControllerExtension",
    "fi/zfrfi0050/model/models",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/FilterOperator"
  ],
  function (ControllerExtension, Model, JSONModel, FilterOperator) {
    "use strict";

    return ControllerExtension.extend(
      "fi.zfrfi0050.ext.controller.ZFI_C_OTHER_RECEIPTList_Ext",
      {
        // this section allows to extend lifecycle hooks or hooks provided by Fiori elements
        override: {
          onInit: function () {
            this.extAPI = this.base.getExtensionAPI();
            this.getView().setModel(Model.createBaseDataModel(), "BaseData");
            this.getView().setModel(Model.createViewDataModel(), "ViewData");
            this.getView().setModel(
              Model.createValueHelpDataModel(),
              "ValueHelpData"
            );
            this.base
              .getAppComponent()
              .getRouter()
              .getRoute("CreateTemplate")
              .attachPatternMatched(this.onObjectMatched, this);
            this.getView()
              .getModel("ViewData")
              .setProperty("/ListView", this.getView());
            this.base
              .getAppComponent()
              .getRouter()
              .getRoute("ZFI_C_OTHER_RECEIPTList")
              .attachMatched(this._onRouteMatched, this);
            // this.base.getExtensionAPI()._view.byId('fe::table::ZFI_C_OTHER_RECEIPT::LineItem-innerTable').setMode('SingleSelectLeft');
          },

          onBeforeRendering: function () {  
            sap.ushell.Container.getServiceAsync("UserInfo").then(oUserData => {
              let sUserId = oUserData.getId();

              this.extAPI.setFilterValues('DraftUser', FilterOperator.EQ, sUserId);
              let oModel = this.getView().getModel();
              let sUrl = `/sap/opu/odata4/sap/zfi_c_other_receipt_ui_v4/srvd/sap/zfi_c_other_receipt_ui/0001/ZFI_C_BP_AUTH?$filter=UserID%20eq%20%27${sUserId}%27`;

              const headers = {
                "X-Csrf-Token": oModel.getHttpHeaders()["X-CSRF-Token"],
              };


              axios
                .get(sUrl, { headers: headers })
                .then(
                  function (oResult) {
                    if (oResult.data.value.length > 0 && oResult.data.value[0].IsAuth === true) {
                      this.extAPI.byId('fe::FilterBar::ZFI_C_OTHER_RECEIPT::FilterField::DraftUser').setEditMode('Editable')
                    } else {
                      this.extAPI.byId('fe::FilterBar::ZFI_C_OTHER_RECEIPT::FilterField::DraftUser').setEditMode('Disabled')
                    }
                  }.bind(this)
                )
                .catch(
                  function (error) {
                    this.extAPI.byId('fe::FilterBar::ZFI_C_OTHER_RECEIPT::FilterField::DraftUser').setEditMode('Disabled')
                  }.bind(this)
                );
            });
            // sap.ushell.Container.getServiceAsync("UserInfo").then(oUserData => {
            //   this.extAPI.setFilterValues('Supplier', FilterOperator.EQ, '1000000')
            //   this.extAPI.byId('fe::FilterBar::ZFI_C_OTHER_RECEIPT::CustomFilterField::DraftUser--DraftUser').setValue('CB9980000011')
            //   // this.extAPI.setFilterValues('DraftUser', FilterOperator.EQ, 'CB9980000011')
            // });
          },

          onAfterRendering: function () {
            this.extAPI.i18n = this.base.getModel("i18n").getResourceBundle();
          },
        },

        _onRouteMatched: function (oEvent) {
          this.base.getModel().refresh();
        },

        onObjectMatched(oEvent) {
          let oDate = new Date();
          let oMonth = oDate.getMonth() + 1;
          let oYear = oDate.getFullYear();
          let oDay = oDate.getDate();
          if (oDay < 10) {
            oDay = "0" + oDay;
          }
          if (oMonth < 10) {
            oMonth = "0" + oMonth;
          }
          let oEnd = oYear + "-" + oMonth + "-" + oDay;

          let ValueHelpData = {
            _oVHDialog: {
              VHCurrency: undefined,
              VHSupplier: undefined,
              VHTaxcode: undefined,
              VHCostCenter: undefined,
              VHTBCostCenter: undefined,
              VHTBGLAccount: undefined,
              VHTBCurrency: undefined,
              VHTBTaxCode: undefined,
              VHBankAccount: undefined,
              VHPaymentTerms: undefined,
            },
            v4SelectInput: undefined,
          };
          let Data = {
            DebitCreditCode: [
              { key: "S", text: this.extAPI.i18n.getText("col0010") },
              { key: "H", text: this.extAPI.i18n.getText("col0020") },
            ],
            Items: [
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
              },
            ],
            Visible: {
              Debit: true,
              Credit: false,
            },
            //15a76f81-e23a-1ede-99df-d3d7b1feabb2
            Parameters: {
              AccountingDocument: this.extAPI.i18n.getText("col0030"),
              CompanyCode: this.base
                .getExtensionAPI()
                .byId(
                  "fi.zfrfi0050::ZFI_C_OTHER_RECEIPTList--fe::FilterBar::ZFI_C_OTHER_RECEIPT::FilterField::CompanyCode-inner"
                )
                .getValue()
                .match(/\((\d+)\)/)[1],
              FiscalYear: "",
              PostingDate: "",
              Amount: 0,
              Currency: "KRW",
              PaymentTerms: "",
              DocumentItemText: "",
              KeyCardPur: "00000000-0000-0000-0000-000000000000",
              TaxCode: "",
              TaxCodeName: "",
              DocumentDate: "",
              Costcenter: "",
              CostcenterName: "",
              Supplier: "",
              BankCountry: "",
              Bank: "",
              Bankaccount: "",
              AmountTotal: 0,
              _Item: [],
              DebitTotal: 0,
              CreditTotal: 0,
              InputData: oEnd,
              BankaccountName: "",
              Paymentscheduled: "",
              CashDiscount1Days: 0,
            },
          };
          let oModel = new JSONModel(Data);
          let oValueHelpData = new JSONModel(ValueHelpData);
          this.getView()
            .getModel("ViewData")
            .getProperty("/_View")
            .setModel(oValueHelpData, "ValueHelpData");
          this.getView()
            .getModel("ViewData")
            .getProperty("/_View")
            .setModel(oModel, "BaseData");
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
        },

        _fcCallGroupWare: function (sUrl, sTblKey, sReqID, sWorkKind, sTitle, sContent) {
          let oWin = window.open(
            "",
            "popWorkflow",
            "location=no,status=no,toolbar=no,scrollbars=yes,width=1100,height=" +
              screen.height
          );

          let oFrm = document.workflowForm;
          if (!oFrm) {
            //없으면 생성
            oFrm = document.createElement("form");
            oFrm.setAttribute("id", "workflowForm");
            oFrm.setAttribute("action", sUrl);
            oFrm.setAttribute("target", "popWorkflow");
            oFrm.setAttribute("method", "post");

            if (sTblKey) {
              let oHidden1 = document.createElement("input");
              oHidden1.setAttribute("type", "hidden");
              oHidden1.setAttribute("name", "SystemID");
              oHidden1.setAttribute("value", "erp");
              oFrm.appendChild(oHidden1);

              let oHidden2 = document.createElement("input");
              oHidden2.setAttribute("type", "hidden");
              oHidden2.setAttribute("name", "WorkKind");
              oHidden2.setAttribute("value", sWorkKind);
              oFrm.appendChild(oHidden2);

              let oHidden3 = document.createElement("input");
              oHidden3.setAttribute("type", "hidden");
              oHidden3.setAttribute("name", "TblKey");
              oHidden3.setAttribute("value", sTblKey);
              oFrm.appendChild(oHidden3);

              let oHidden4 = document.createElement("input");
              oHidden4.setAttribute("type", "hidden");
              oHidden4.setAttribute("name", "ReqID");
              oHidden4.setAttribute("value", sReqID);
              oFrm.appendChild(oHidden4);

              let oHidden5 = document.createElement("input");
              oHidden5.setAttribute("type", "hidden");
              oHidden5.setAttribute("name", "Title");
              oHidden5.setAttribute("value", sTitle);
              oFrm.appendChild(oHidden5);

              let oHidden6 = document.createElement("input");
              oHidden6.setAttribute("type", "hidden");
              oHidden6.setAttribute("name", "Content");
              oHidden6.setAttribute("value", sContent);
              oFrm.appendChild(oHidden6);
            }

            document.body.appendChild(oFrm);
          } else {
            if (sTblKey) {
              oFrm.SystemID.value = "erp"; //고정
              oFrm.WorkKind.value = sWorkKind; //결재타입
              oFrm.TblKey.value = sTblKey; //문서번호 : 데이터 고유키 (ABAP에서 반환 됨)
              oFrm.ReqID.value = sReqID; //사용자 계정 (ABAP에서 반환 됨)
              oFrm.Title.value = sTitle; //제목 (ABAP 반환 OR 고정)
              oFrm.Content.value = sContent; //HTML 내용 (ABAP에서 반환 됨)
            }
            oFrm.action = sUrl; //전자결재 (ABAP에서 반환 됨)
            oFrm.target = "popWorkflow";
            oFrm.method = "post";
          }
          oFrm.submit();
        },
      }
    );
  }
);
