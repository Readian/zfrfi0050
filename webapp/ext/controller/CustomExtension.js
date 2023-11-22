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
        }
    };
});
