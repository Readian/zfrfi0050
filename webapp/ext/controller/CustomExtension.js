sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        CancelReq: function(oEvent) {
            MessageToast.show("Custom handler invoked.");
        },
        CreateData: function(oEvent){
            this.getRouting().navigateToRoute('CreateTemplate',this);
        },
        CancelData: function(oEvent){
            let oTable = this.oView.byId('fi.zfrfi0050::ZFI_C_OTHER_RECEIPTList--fe::table::ZFI_C_OTHER_RECEIPT::LineItem-innerTable');
            oBindContext.requestObject().then(function(oResult){
                let a = oResult;
            }.bind(this));

            const headers = {
                'X-Csrf-Token' : this.getModel().getHttpHeaders()['X-CSRF-Token']
            };
            console.log(this.getModel().getHttpHeaders());
            ///sap/opu/odata4/sap/zfi_c_other_receipt_ui_v4/srvd/sap/zfi_c_other_receipt_ui/0001/ZFI_C_DOC_APPROVAL/com.sap.gateway.srvd.zfi_c_other_receipt_ui.v0001.Posting
            axios.post('/sap/opu/odata4/sap/zfi_u_tran_approval_ui_v4/srvd/sap/zfi_u_tran_approval_ui/0001/ZFI_IR_TRAN_APPROVAL/com.sap.gateway.srvd.zfi_u_tran_approval_ui.v0001.CancelReq', 
                {
              },{
                headers : headers
              })
              .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              });
        }
    };
});
