sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'fi.zfrfi0050',
            componentId: 'ZFI_C_OTHER_RECEIPTObjectPage',
            contextPath: '/ZFI_C_OTHER_RECEIPT'
        },
        CustomPageDefinitions
    );
});