sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'fi/zfrfi0050/test/integration/FirstJourney',
		'fi/zfrfi0050/test/integration/pages/ZFI_C_OTHER_RECEIPTList',
		'fi/zfrfi0050/test/integration/pages/ZFI_C_OTHER_RECEIPTObjectPage'
    ],
    function(JourneyRunner, opaJourney, ZFI_C_OTHER_RECEIPTList, ZFI_C_OTHER_RECEIPTObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('fi/zfrfi0050') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheZFI_C_OTHER_RECEIPTList: ZFI_C_OTHER_RECEIPTList,
					onTheZFI_C_OTHER_RECEIPTObjectPage: ZFI_C_OTHER_RECEIPTObjectPage
                }
            },
            opaJourney.run
        );
    }
);