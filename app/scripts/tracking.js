/* jshint camelcase: false */
/*global window,gtmDataLayer,wt,document,webtrekkConfig */
var trackdevice = '';
function checkMobileDesktopApp() {
    if (trackdevice === 'app' || window.location.search.indexOf('app=hd') !== -1 || window.location.search.indexOf('app=sf') !== -1) {
        trackdevice = 'app';
    } else {
            trackdevice = 'desktop';
    }
}

function setGTM() {
    if(trackdevice !== 'app') {
        gtmDataLayer = [];
        var gtmId = '';
        if(trackdevice === 'mobile') {
            gtmId = 'GTM-MJ33W5';
        } else {
            gtmId = 'GTM-PRFPDL';
        }
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!=='dataLayer'?'&l='+l:'';j.async=true;j.src=
        '//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','gtmDataLayer',gtmId);
    }
}

function setIVW() {
    if(trackdevice !== 'app') {
        var ivwSt = '';
        var ivwSv = '';
        if(trackdevice === 'mobile') {
            ivwSt = 'mobwelt';
            ivwSv = 'mo';
        } else {
            ivwSt = 'welt';
            ivwSv = 'in';
        }
        var iam_data = {
            'st': ivwSt,
            'cp': '90110_sonderART',
            'sv': ivwSv
        };
        iom.c(iam_data,1);
    }
}


function setTracking() {
    var wtId = '';
    if(trackdevice === 'app') {
        wtId = '236432914098511';
    } else {
        if(trackdevice === 'mobile') {
            wtId = '642818193324417';
        } else {
            wtId = '560716172952885';
        }
    }
    webtrekkConfig = {
        trackId: wtId,
        trackDomain: 'weltonline01.webtrekk.net',
        domain: 'REGEXP:(.welt.de)|(.wulffmorgenthaler.de)|(.watchever.de)',
        cookie: '1',
        mediaCode: 'wtmc,wtrid',
        executePluginFunction: 'wt_replaceLinkInfos',
        ignorePrerendering: true
    };
    var pageConfig = {
        linkTrack: 'link',
        heatmap: '0'
    };
    wt = new webtrekkV3(pageConfig);
    wt.contentId = 'Cartodb: US-Wahl: 1';
    wt.contentGroup = {
        1: 'US-Wahl',
        2: '1',
        3: '',
        4: 'Cartodb: US-Wahl: 1'
    };
    wt.customParameter = {};
    wt.customParameter[1] = '';
    wt.customParameter[2] = 'Cartodb';
    wt.customParameter[3] = 'Cartodb: US-Wahl: 1';
    wt.customParameter[4] = 'US-Wahl';
    wt.customParameter[5] = '1';
    wt.customParameter[6] = '';
    wt.customParameter[7] = '';
    wt.customParameter[8] = '90110_sonderART';
    wt.customParameter[9] = '';
    wt.customParameter[10] = 'Cartodb: US-Wahl: 1';
    wt.customParameter[11] = 'won';
    wt.customParameter[24] = window.location.href;
}

checkMobileDesktopApp();
setTracking();
//setIVW();
setGTM();
//wt.sendinfo();
wt.sendinfo({linkId:'_PE_uswahl_1_onview_'});
