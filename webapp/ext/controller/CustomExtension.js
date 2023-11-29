sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/MessageBox",
], function(
        MessageToast,
        MessageBox) {
    'use strict';

    return {
        CancelReq: function(oEvent) {
            MessageToast.show("Custom handler invoked.");
        },
        CreateData: function(oEvent){
            this.getRouting().navigateToRoute('CreateTemplate',this);
        },
        CancelData: function(oEvent){
            let oTable = this._view.byId('fi.zfrfi0050::ZFI_C_OTHER_RECEIPTList--fe::table::ZFI_C_OTHER_RECEIPT::LineItem-innerTable');
            let oSelectedItem = oTable.getSelectedItems();

            MessageBox.confirm("상신을 취소하시겠습니까?",{
                actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                onClose: function(oAction){
                    if(oAction == sap.m.MessageBox.Action.YES)
                    {
                        const headers = {
                            'X-Csrf-Token' : this.getModel().getHttpHeaders()['X-CSRF-Token']
                        };
                        console.log(this.getModel().getHttpHeaders());
                        ///sap/opu/odata4/sap/zfi_c_other_receipt_ui_v4/srvd/sap/zfi_c_other_receipt_ui/0001/ZFI_C_DOC_APPROVAL/com.sap.gateway.srvd.zfi_c_other_receipt_ui.v0001.Posting
                        axios.post('/sap/opu/odata4/sap/zfi_c_other_receipt_ui_v4/srvd/sap/zfi_c_other_receipt_ui/0001/ZFI_C_DOC_APPROVAL/com.sap.gateway.srvd.zfi_c_other_receipt_ui.v0001.CancelReq', 
                            {
                                'KeyRequest' : oSelectedItem[0].getBindingContext().getObject().KeyRequest
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
                }.bind(this)
            })


            
        }
    };
});
