var getData = {};
getData.ready = false;
getData.account = "";
getData.profile = "";
getData.progress = 0; // 0 = authenticating, 1 = getting need/want list, 2= getting data, 3=resting
getData.loop = function () {
    getData.looping = setInterval(getData.isReady, 500);
}
getData.isReady = function () {
    if (getData.progress == 0) {
        if (getData.account != "" && getData.profile != "") { getData.ready = true; getData.progress++}
    }
    if (getData.progress == 1) {
        //practice query
        queryCoreReportingApi(getData.profile);
    }
    if (getData.progress == 2) {
        clearInterval(getData.looping);
        alert(getData.results);
    }
}

function queryCoreReportingApi(profileId) {
    console.log('Querying Core Reporting API.');

    // Use the Analytics Service Object to query the Core Reporting API
    gapi.client.analytics.data.ga.get({
        'ids': 'ga:' + profileId,
        'start-date': '2014-03-03',
        'end-date': '2014-04-03',
        'metrics': 'ga:sessions'
    }).execute(printResults);
}

function printResults(results) {
    if (results.error) {
        Alert('Something went ary, with my Canada Dry')
    } else {
        if (results.rows && results.rows.length) {
            for (var i = 0; i < results.rows.length; i++) {
                for (var i2 = 0; i2 < results.rows[i].length; i2++) {
                    console.log(results.rows[i][i2]);
                    getData.results = results.rows[i][i2];
                }
            }
            getData.progress++;
        } else {
            console.log('No results found');
        }
    }
}



getData.loop();