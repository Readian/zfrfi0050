sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'fi.zfrfi0050',
            componentId: 'ZFI_C_OTHER_RECEIPTList',
            contextPath: '/ZFI_C_OTHER_RECEIPT'
        },
        CustomPageDefinitions
    );
});