sap.ui.define(
  [
    "sap/m/MessageToast", 
    "sap/m/MessageBox",
    "fi/zfrfi0050/ext/controller/CustomExtension"],
  function (MessageToast, MessageBox, CustomExtension) {
    "use strict";

    return {
      onPress: function (oEvent) {
        let oContextObject = oEvent.getSource().getBindingContext().getObject()
        if (
          oContextObject.Status === "DA" ||
          oContextObject.Status === "DB"
        ) {
          let sUrl = oContextObject.GroupWareUrl;
          let vTblKey, vReqID, vTitle, vContent, vWorkKind;
          let vUrl = sUrl.split("?")[0];
          let aUrl = sUrl.split("$");
          aUrl.forEach((e, idx) => {
            if (e.includes("TblKey")) {
              vTblKey = e.split("TblKey=")[1];
            } else if (e.includes("ReqID")) {
              vReqID = e.split("ReqID=")[1];
            } else if (e.includes("Title")) {
              vTitle = e.split("Title=")[1];
            } else if (e.includes("WorkKind")) {
              vWorkKind = e.split("WorkKind=")[1];
            }
          });

          vContent = oContextObject.BodyContent;

          sap.ui
            .controller(
              "fi.zfrfi0050.ext.controller.ZFI_C_OTHER_RECEIPTList_Ext"
            )
            ._fcCallGroupWare(vUrl, vTblKey, vReqID, vWorkKind, vTitle, vContent);
        } else {
          window.open(
            oEvent.getSource().getBindingContext().getObject().GroupWareUrl,
            "windowname1",
            "width=1500,height=800,scrollbars=yes,toolbar=yes,location=yes"
          );
        }
      },

      CancelReq: function (oEvent) {
        MessageToast.show("Custom handler invoked.");
      },
      CreateData: function (oEvent) {
        let oBaseData = this._controller.oView.getModel("BaseData"),
        vCompanyCode;
            // vCompanyCode = this._controller.filterBarConditions.CompanyCode[0].values[0];
        // let vCompanyCode = this._view.byId('fe::FilterBar::ZFI_C_OTHER_RECEIPT::FilterField::CompanyCode-inner').getValue();
        // oBaseData.setProperty('/Parameters/CompanyCode', vCompanyCode);


        let aFilters = this.getFilters().filters;

        while (true) {
          let oNowFilter = aFilters.shift();
          if (!oNowFilter) break;

          if (oNowFilter._bMultiFilter){
            aFilters = aFilters.concat(oNowFilter.aFilters);
            continue;
          }
          if (oNowFilter.sPath === 'CompanyCode' && oNowFilter.sOperator === 'EQ'){
            vCompanyCode = oNowFilter.oValue1;
            break;
          }
        }

        if (!vCompanyCode || vCompanyCode === ''){
          let vErrMsg = this._view.getModel('i18n').getResourceBundle().getText('Error030')
          MessageBox.error(vErrMsg);
          return
        }



        this.getRouting().navigateToRoute("CreateTemplate", {
          companyCode: btoa(vCompanyCode),
        });

      },

      CancelData: function (oEvent) {
        let oTable = this._view.byId(
          "fi.zfrfi0050::ZFI_C_OTHER_RECEIPTList--fe::table::ZFI_C_OTHER_RECEIPT::LineItem-innerTable"
        );
        let oSelectedItem = oTable.getSelectedItems();

        MessageBox.confirm("상신을 취소하시겠습니까?", {
          actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
          onClose: function (oAction) {
            if (oAction == sap.m.MessageBox.Action.YES) {
              const headers = {
                "X-Csrf-Token":
                  this.getModel().getHttpHeaders()["X-CSRF-Token"],
              };
              console.log(this.getModel().getHttpHeaders());
              ///sap/opu/odata4/sap/zfi_c_other_receipt_ui_v4/srvd/sap/zfi_c_other_receipt_ui/0001/ZFI_C_DOC_APPROVAL/com.sap.gateway.srvd.zfi_c_other_receipt_ui.v0001.Posting
              axios
                .post(
                  "/sap/opu/odata4/sap/zfi_c_other_receipt_ui_v4/srvd/sap/zfi_c_other_receipt_ui/0001/ZFI_C_DOC_APPROVAL/com.sap.gateway.srvd.zfi_c_other_receipt_ui.v0001.CancelReq",
                  {
                    KeyRequest: oSelectedItem[0].getBindingContext().getObject()
                      .KeyRequest,
                  },
                  {
                    headers: headers,
                  }
                )
                .then(function (response) {
                  console.log(response);
                })
                .catch(function (error) {
                  console.log(error);
                });
            }
          }.bind(this),
        });
      },
    };
  }
);
