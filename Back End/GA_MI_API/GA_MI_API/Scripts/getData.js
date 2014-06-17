var getData = {};
getData.ready = false;
getData.account = "";
getData.profile = "";
getData.progress = 0; // 0 = authenticating, 1 = getting need/want list, 2= getting data, 3=resting
getData.queryingGA = false;
getData.loop = function () {
    getData.looping = setInterval(getData.isReady, 500);
}
getData.needListPass = function () {
    clearInterval(getData.looping);
    if (getData.needList.length > 0) {
        var params = {};
        params.profileId = getData.profile;
        params.real_date = getData.needList[0].real_date.substr(0,10);
        params.metric = getData.needList[0].metric;
        getData.needList.splice(0, 1);
        getData.pullFromGoogle(params);
    } else {
        alert("needlist empty");
    }
}

getData.isReady = function () {
    if (getData.progress == 0) {
        if (getData.account != "" && getData.profile != "") { getData.ready = true; getData.progress++}
    }
    if (getData.progress == 1) {
        dsdConn.get();
    }

    if (getData.progress == 2) {
        getData.needListPass();
    }

    if (getData.progress == 5) {
        clearInterval(getData.looping);
        alert('Grabbing data from DSD failed');
    }

}
getData.pullFromGoogle = function (params) {
    var metricAdd = "";
    if(params.metric=='ga:pageviews'){metricAdd = ',ga:pagepath'}
    gapi.client.analytics.data.ga.get({
        'ids': 'ga:' + params.profileId
        , 'start-date': params.real_date
        , 'end-date': params.real_date
        , 'dimensions': 'ga:year,ga:month,ga:day,ga:hour' + metricAdd
        , 'metrics': params.metric
    }).execute(printResults);
}

/*
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
*/

var a;
function printResults(results) {
    if (results.error) {
        a = results.error;
        alert(results.error);
    } else {
        if (results.rows && results.rows.length) {
            var records = [];
            for (var i = 0; i < results.rows.length; i++) {
                var row = [];
                for (var i2 = 0; i2 < results.rows[i].length; i2++) {
                    row.push(results.rows[i][i2]);
                }
                records.push(row);
            }
        } else {
            console.log('No results found');
        }
    }
    getData.results = records;
    var json = JSON.stringify(getData.results);
    dsdConn.post(json);
}

var dsdConn = {};
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
        if (xmlHTTP.readyState == 4 && xmlHTTP.status == 200) {
            getData.needList = eval( "(" + xmlHTTP.response + ")");
            getData.progress++
        }
        if (xmlHTTP.readyState == 4 && xmlHTTP.status != 200) { alert(xmlHTTP.status); getData.progress = 5 }
    }
}
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
        if (xmlHTTP.readyState == 4 && xmlHTTP.status == 200) { 
            console.log(xmlHTTP.status);
            getData.needListPass();
        }
        if (xmlHTTP.readyState == 4 && xmlHTTP.status != 200) { 
            console.log(xmlHTTP.status + " " + xmlHTTP.statusText);
            getData.needListPass();
        }
    }
}




















getData.loop();