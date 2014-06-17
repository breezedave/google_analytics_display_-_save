var getData = {};
getData.ready = false;
getData.account = "";
getData.profile = "";
getData.progress = 0; // 0 = authenticating, 1 = getting need/want list, 2= getting data, 3=resting
getData.queryingGA = false;
getData.loop = function () {
    getData.looping = setInterval(getData.isReady, 500);
}
getData.isReady = function () {
    if (getData.progress == 0) {
        if (getData.account != "" && getData.profile != "") { getData.ready = true; getData.progress++}
    }
    if (getData.progress == 1) {
        dsdConn.get();
    }

    if (getData.progress == 2) {
        //practice query
        if (getData.queryingGA == false) {
            queryCoreReportingApi(getData.profile);
            getData.queryingGA == true;
        }
    }

    if (getData.progress == 3) {
        clearInterval(getData.looping);
        var json = JSON.stringify(getData.results);
        alert(json.toString());
        dsdConn.post(json);
    }
    if (getData.progress == 5) {
        clearInterval(getData.looping);
        alert('Grabbing data from DSD failed');
    }

}

function queryCoreReportingApi(profileId) {
    console.log('Querying Core Reporting API.');

    // Use the Analytics Service Object to query the Core Reporting API
    gapi.client.analytics.data.ga.get({
        'ids': 'ga:' + profileId
        ,'start-date': '2014-03-03'
        ,'end-date': '2014-04-03'
        ,'dimensions': 'ga:year,ga:month,ga:day,ga:hour,ga:pagepath'
        ,'metrics': 'ga:pageviews'
    }).execute(printResults);
}

function printResults(results) {
    if (results.error) {
        Alert('Something went ary, with my Canada Dry')
    } else {
        if (results.rows && results.rows.length) {
            var records = [];
            for (var i = 0; i < results.rows.length; i++) {
                var row = [];
                for (var i2 = 0; i2 < results.rows[i].length; i2++) {
                    console.log(results.rows[i][i2]);
                    row.push(results.rows[i][i2]);
                }
                records.push(row);
            }
        } else {
            console.log('No results found');
        }
    }
    getData.results = records;
    getData.progress++;
    getData.queryingGA = false;
}

var dsdConn = {};
dsdConn.post = function (json) {
    var xmlHTTP;
    if (window.XMLHttpRequest) {
        xmlHTTP = new window.XMLHttpRequest;
    } else {
        alert("This service will not work with your browser");
    }

    xmlHTTP.open("POST", "api/values", true);
    xmlHTTP.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHTTP.send(json);

    xmlHTTP.onreadystatechange = function () {
        if (xmlHTTP.readyState == 4 && xmlHTTP.status == 200) { alert("Worked") }
        if (xmlHTTP.readyState == 4 && xmlHTTP.status != 200) { alert(xmlHTTP.status) }
    }
}
dsdConn.get = function () {
    var xmlHTTP;
    if (window.XMLHttpRequest) {
        xmlHTTP = new window.XMLHttpRequest;
    } else {
        alert("This service will not work with your browser");
    }
    xmlHTTP.open("GET", "api/values", true);
    xmlHTTP.send();
    xmlHTTP.onreadystatechange = function () {
        if (xmlHTTP.readyState == 4 && xmlHTTP.status == 200) { alert("Worked"); getData.progress++ }
        if (xmlHTTP.readyState == 4 && xmlHTTP.status != 200) { getData.progress = 5}
    }
}




















getData.loop();