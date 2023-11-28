sap.ui.define([
	'sap/ui/core/mvc/ControllerExtension',
	'fi/zfrfi0050/model/models'
], function (
	ControllerExtension, 
	Model) {
	'use strict';

	return ControllerExtension.extend('fi.zfrfi0050.ext.controller.ZFI_C_OTHER_RECEIPTList_Ext', {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		override: {
			onInit: function () {
				this.extAPI = this.base.getExtensionAPI();
				this.getView().setModel(Model.createBaseDataModel(), 'BaseData');
				this.base.getAppComponent().getRouter().getRoute('ZFI_C_OTHER_RECEIPTList').attachPatternMatched(this.onObjectMatched, this);
			},

			onAfterRendering: function () {
				// this.extAPI.i18n = this.base.getModel('i18n').getResourceBundle();
			}
		},
		onObjectMatched(oEvent){
			let a = console.log('asdf');
			this.getView().bindElement({
				path: '/BaseData',
				model: 'BaseData'
			})
		}

	});
});
