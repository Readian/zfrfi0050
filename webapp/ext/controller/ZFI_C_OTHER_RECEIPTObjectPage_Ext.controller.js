sap.ui.define([
	'sap/ui/core/mvc/ControllerExtension',
	'fi/zfrfi0050/model/models',
	"sap/m/MessageBox",
], function (
	ControllerExtension, 
	Model, 
	MessageBox) {
	'use strict';
	return ControllerExtension.extend('fi.zfrfi0050.ext.controller.ZFI_C_OTHER_RECEIPTObjectPage_Ext', {
		override: {
			onInit: function () {
			},
			onAfterRendering: function () {
				// this.extAPI.i18n = this.base.getModel('i18n').getResourceBundle();
			},
			routing: {
				onBeforeNavigation: function (oContextInfo) {
				}
			}
		}
	});
});
